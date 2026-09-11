using System.Data.Common;
using Dapper;
using NetsimB2B.Application.Abstractions.Data;
using NetsimB2B.Application.Cart;
using NetsimB2B.Application.Finance;
using NetsimB2B.Application.Orders;
using NetsimB2B.Application.Products;

namespace NetsimB2B.Infrastructure.Netsim.Orders;

// Sepetten gerçek bir SIPARIS (ALSAASIL/ALSADETA) yazar. Kullanıcı onayıyla kapsam
// bilinçli olarak dar tutuldu: yalnızca sipariş kaydı yazılır, STOKKADE (stok miktarı)
// ve CARIKALI (kredi riski) GÜNCELLENMEZ — gerçek Netsim'in sipariş anında bunları nasıl
// (hatta güncelliyor mu) etkilediği doğrulanmadı, uydurmaktansa dokunulmuyor (bkz.
// docs/implementation-status.md). Fiyat/stok/kredi limiti doğrulaması yine de gerçek
// verilerle (IProductReadService/IFinanceReadService) yapılıyor — yalnızca yan etkiler
// simüle edilmiyor.
internal sealed class NetsimOrderWriteService(
    ICartStore cartStore,
    IProductReadService productReadService,
    IFinanceReadService financeReadService,
    INetsimConnectionFactory connectionFactory) : IOrderWriteService
{
    private const string NextAlissatisNoSql = "SELECT COALESCE(MAX(ALISSATIS_NO), 0) + 1 FROM ALSAASIL";
    private const string NextDetayNoSql = "SELECT COALESCE(MAX(ALISSATIS_DETAY_NO), 0) + 1 FROM ALSADETA";
    private const string FindQuoteAlissatisNoSql =
        "SELECT ALISSATIS_NO FROM ALSAASIL WHERE BELGE_NO = @BelgeNo AND ISLEM_KODU = 'TEKLIF'";

    private const string InsertHeaderSql = """
        INSERT INTO ALSAASIL (
            ALISSATIS_NO, ISLEM_KODU, ISLEM_ADI, ISLEM_YONU, CARI_NO, BELGE_NO, TARIH,
            VADE_TARIHI, KUR_TARIHI, DURUM, REFERANS_NO, ODEME_BILGISI, DT_NAKLIYE_SEKLI,
            ACIKLAMA_TEXT, REFERANS_ALISSATIS_NO, TOPLAM_HAM_TUTAR, TOPLAM_KDV_TUTARI,
            GENEL_TOPLAM, DOVIZ_BIRIMI, DOVIZ_KURU, KAYIT_DURUMU
        ) VALUES (
            @AlissatisNo, 'SIPARIS', 'Satış Siparişi', 1, @CariNo, @BelgeNo, @Tarih,
            @VadeTarihi, @Tarih, 'Alındı', @ReferansNo, @OdemeBilgisi, @NakliyeSekli,
            @AciklamaText, @ReferansAlissatisNo, @ToplamHam, @ToplamKdv,
            @GenelToplam, 'TRY', 1.0, 'A'
        )
        """;

    private const string InsertLineSql = """
        INSERT INTO ALSADETA (
            ALISSATIS_DETAY_NO, ALISSATIS_NO, ISLEM_KODU, ISLEM_YONU, SIRA_NO, STOK_NO,
            STOK_ADI, BIRIM, BIRIMX, MIKTAR, BIRIM_FIYAT, HAM_TUTAR, KDV_ORANI, KDV_TUTARI,
            SATIR_INDIRIM_ORANI, DOVIZ_BIRIMI, DOVIZ_KURU, KAYIT_DURUMU
        ) VALUES (
            @DetayNo, @AlissatisNo, 'SIPARIS', 1, @SiraNo, @StokNo,
            @StokAdi, @Birim, 1.0, @Miktar, @BirimFiyat, @HamTutar, @KdvOrani, @KdvTutari,
            0.0, 'TRY', 1.0, 'A'
        )
        """;

    private const double KdvOraniPct = 20;

    public async Task<OrderSummary> CreateFromCartAsync(
        Guid userId, long cariNo, CreateOrderRequest request, CancellationToken cancellationToken)
    {
        var cartLines = await cartStore.GetLinesAsync(userId, cariNo, cancellationToken);
        if (cartLines.Count == 0)
        {
            throw new OrderCreationException("Sepetiniz boş.");
        }

        var validatedLines = new List<ValidatedLine>();
        double toplamHam = 0;
        string? quoteId = null;
        foreach (var line in cartLines)
        {
            var product = await productReadService.GetAsync(cariNo, line.StokNo, cancellationToken)
                ?? throw new OrderCreationException($"Ürün bulunamadı: {line.StokNo}.");
            var quantity = (double)line.Quantity;
            if (product.Stock < quantity)
            {
                throw new OrderCreationException($"'{product.Name}' için yeterli stok yok.");
            }

            var unitPrice = line.UnitPrice.HasValue ? (double)line.UnitPrice.Value : product.Price ?? 0;
            toplamHam += unitPrice * quantity;
            quoteId ??= line.QuoteId;
            validatedLines.Add(new ValidatedLine(line.StokNo, quantity, unitPrice, product.Name, product.Unit));
        }

        var accounts = await financeReadService.GetAccountsAsync([cariNo], cancellationToken);
        var account = accounts.FirstOrDefault();
        if (account is null || toplamHam > account.AvailableCredit)
        {
            throw new OrderCreationException("Kullanılabilir cari limit bu sipariş için yeterli değil.");
        }

        var toplamKdv = Math.Round(toplamHam * KdvOraniPct / 100, 2);
        var genelToplam = Math.Round(toplamHam + toplamKdv, 2);
        var now = DateTime.Now;
        var vadeTarihi = now.AddDays(3);

        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);
        await using var transaction = await connection.BeginTransactionAsync(cancellationToken);
        try
        {
            var alissatisNo = await connection.ExecuteScalarAsync<long>(new CommandDefinition(
                NextAlissatisNoSql, transaction: transaction, cancellationToken: cancellationToken));

            long? referansAlissatisNo = null;
            if (quoteId is not null)
            {
                referansAlissatisNo = await connection.QuerySingleOrDefaultAsync<long?>(new CommandDefinition(
                    FindQuoteAlissatisNoSql, new { BelgeNo = quoteId }, transaction, cancellationToken: cancellationToken));
            }

            var belgeNo = $"B2B-2026-{3000 + alissatisNo}";
            var referansNo = $"WEB-{now.Ticks % 1_000_000:D6}";
            var aciklamaText = string.IsNullOrWhiteSpace(request.DeliveryAddress)
                ? request.Note
                : $"Teslimat adresi: {request.DeliveryAddress}{(string.IsNullOrWhiteSpace(request.Note) ? "" : $"\n{request.Note}")}";

            await connection.ExecuteAsync(new CommandDefinition(InsertHeaderSql, new
            {
                AlissatisNo = alissatisNo,
                CariNo = cariNo,
                BelgeNo = belgeNo,
                Tarih = now,
                VadeTarihi = vadeTarihi,
                ReferansNo = referansNo,
                OdemeBilgisi = request.PaymentMethod,
                NakliyeSekli = request.ShippingMethod,
                AciklamaText = aciklamaText,
                ReferansAlissatisNo = referansAlissatisNo,
                ToplamHam = toplamHam,
                ToplamKdv = toplamKdv,
                GenelToplam = genelToplam,
            }, transaction, cancellationToken: cancellationToken));

            var detayNo = await connection.ExecuteScalarAsync<long>(new CommandDefinition(
                NextDetayNoSql, transaction: transaction, cancellationToken: cancellationToken));

            var sira = 1;
            foreach (var line in validatedLines)
            {
                var hamTutar = Math.Round(line.UnitPrice * line.Quantity, 2);
                var kdvTutari = Math.Round(hamTutar * KdvOraniPct / 100, 2);
                await connection.ExecuteAsync(new CommandDefinition(InsertLineSql, new
                {
                    DetayNo = detayNo,
                    AlissatisNo = alissatisNo,
                    SiraNo = sira,
                    StokNo = line.StokNo,
                    StokAdi = line.StokAdi,
                    Birim = line.Birim,
                    Miktar = line.Quantity,
                    BirimFiyat = line.UnitPrice,
                    HamTutar = hamTutar,
                    KdvOrani = KdvOraniPct,
                    KdvTutari = kdvTutari,
                }, transaction, cancellationToken: cancellationToken));
                detayNo++;
                sira++;
            }

            await transaction.CommitAsync(cancellationToken);

            await cartStore.ClearAsync(userId, cariNo, cancellationToken);

            return new OrderSummary(
                belgeNo,
                cariNo,
                now,
                "Alındı",
                referansNo,
                vadeTarihi,
                null,
                request.ShippingMethod,
                request.PaymentMethod,
                request.Note,
                quoteId,
                toplamHam,
                validatedLines.Select(l => new OrderLineItem(l.StokNo, l.Quantity, l.UnitPrice)).ToList());
        }
        catch
        {
            await transaction.RollbackAsync(CancellationToken.None);
            throw;
        }
    }

    private sealed record ValidatedLine(long StokNo, double Quantity, double UnitPrice, string StokAdi, string Birim);
}
