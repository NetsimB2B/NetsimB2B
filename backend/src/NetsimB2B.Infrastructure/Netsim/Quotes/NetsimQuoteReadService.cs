using Dapper;
using NetsimB2B.Application.Abstractions.Data;
using NetsimB2B.Application.Quotes;

namespace NetsimB2B.Infrastructure.Netsim.Quotes;

internal sealed class NetsimQuoteReadService(INetsimConnectionFactory connectionFactory) : IQuoteReadService
{
    // ALSAASIL'de teklif için ayrı bir "başlık" alanı yok; ACIKLAMA bu amaçla kullanılıyor
    // (COALESCE ile boşsa ISLEM_ADI'ye düşer). REFERANS_NO/YETKILI_ADI/ODEME_BILGISI/
    // DT_NAKLIYE_SEKLI/ACIKLAMA_TEXT gerçek şema alanları ama netsim-dev seed'inde başlangıçta
    // boştu — bkz. netsim-dev/V002__enrich_quote_display_fields.sql. VARSAYIM: Teklif/Sipariş/
    // Fatura ayrımı ISLEM_KODU = 'TEKLIF' ile yapılıyor; gerçek Netsim kurulumunda bu kod farklı
    // olabilir (bkz. docs/04-data/NETSIM_TABLO_HARİTASI.md → ALSAASIL).
    private const string HeaderSql = """
        SELECT
            A.BELGE_NO AS Id,
            A.REFERANS_NO AS Reference,
            COALESCE(A.ACIKLAMA, A.ISLEM_ADI) AS Title,
            CAST(A.CARI_NO AS BIGINT) AS CariNo,
            A.TARIH AS CreatedAt,
            A.VADE_TARIHI AS ValidUntil,
            A.YETKILI_ADI AS SalesRepresentative,
            A.ODEME_BILGISI AS PaymentTerm,
            A.DT_NAKLIYE_SEKLI AS DeliveryTerm,
            A.ACIKLAMA_TEXT AS Note,
            A.TOPLAM_HAM_TUTAR AS Total,
            CAST(A.ALISSATIS_NO AS BIGINT) AS HeaderId
        FROM ALSAASIL A
        WHERE A.ISLEM_KODU = 'TEKLIF'
            AND A.CARI_NO = @CariNo
            AND (A.KAYIT_DURUMU IS NULL OR A.KAYIT_DURUMU <> 'S')
        ORDER BY A.TARIH DESC
        """;

    // TANIMLI_LISTE_FIYATI (indirim öncesi liste fiyatı) boşsa BIRIM_FIYAT'a düşer —
    // gerçek Netsim'de her satırda dolu olacağı doğrulanmadı.
    private const string LinesSql = """
        SELECT
            CAST(D.STOK_NO AS BIGINT) AS ProductId,
            D.MIKTAR AS Quantity,
            D.BIRIM_FIYAT AS UnitPrice,
            COALESCE(D.TANIMLI_LISTE_FIYATI, D.BIRIM_FIYAT) AS ListPrice
        FROM ALSADETA D
        WHERE D.ISLEM_KODU = 'TEKLIF' AND D.ALISSATIS_NO = @HeaderId
        ORDER BY D.SIRA_NO
        """;

    public async Task<IReadOnlyList<QuoteSummary>> GetForCariAsync(long cariNo, CancellationToken cancellationToken)
    {
        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);

        var headers = await connection.QueryAsync<HeaderRow>(new CommandDefinition(
            HeaderSql, new { CariNo = cariNo }, cancellationToken: cancellationToken));

        var today = DateTime.Now.Date;
        var result = new List<QuoteSummary>();
        foreach (var header in headers)
        {
            var lines = await connection.QueryAsync<QuoteLineItem>(new CommandDefinition(
                LinesSql, new { HeaderId = header.HeaderId }, cancellationToken: cancellationToken));

            var status = header.ValidUntil.Date < today ? "Süresi Doldu" : "Geçerli";

            result.Add(new QuoteSummary(
                header.Id,
                header.Reference,
                header.Title,
                header.CariNo,
                header.CreatedAt,
                header.ValidUntil,
                status,
                header.SalesRepresentative,
                header.PaymentTerm,
                header.DeliveryTerm,
                header.Note,
                header.Total,
                lines.AsList()));
        }

        return result;
    }

    private sealed record HeaderRow(
        string Id,
        string? Reference,
        string Title,
        long CariNo,
        DateTime CreatedAt,
        DateTime ValidUntil,
        string? SalesRepresentative,
        string? PaymentTerm,
        string? DeliveryTerm,
        string? Note,
        double Total,
        long HeaderId);
}
