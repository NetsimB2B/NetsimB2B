using Dapper;
using NetsimB2B.Application.Abstractions.Data;
using NetsimB2B.Application.Invoices;

namespace NetsimB2B.Infrastructure.Netsim.Invoices;

internal sealed class NetsimInvoiceReadService(INetsimConnectionFactory connectionFactory) : IInvoiceReadService
{
    // BAKIYE (kalan borç) gerçek bir ALSAASIL alanı ama Netsim'deki tam anlamı (satır bazlı
    // güncel bakiye mi, tahsilat sonrası mı) doğrulanmadı — Teklifler'deki VALID_UNTIL bazlı
    // canlı durum hesaplamasıyla aynı yaklaşımla (bkz. NetsimQuoteReadService), ödeme durumu
    // burada BAKIYE ve VADE_TARIHI'nden türetiliyor, ayrı bir DURUM alanına güvenilmiyor.
    // REFERANS_ALISSATIS_NO ile kaynak siparişe (ISLEM_KODU='SIPARIS') self-join yapılıyor;
    // Siparişlerim'in Teklifler'e bağlanmasıyla aynı VARSAYIM (bkz. NetsimOrderReadService).
    // E-fatura UUID için ALSAASIL'de karşılık gelen bir alan bulunamadı, taşınmadı.
    private const string HeaderSql = """
        SELECT
            A.BELGE_NO AS Id,
            CAST(A.CARI_NO AS BIGINT) AS CariNo,
            A.TARIH AS CreatedAt,
            A.VADE_TARIHI AS DueDate,
            O.BELGE_NO AS OrderId,
            A.ODEME_BILGISI AS PaymentTerm,
            A.ACIKLAMA AS Description,
            A.GENEL_TOPLAM AS Total,
            A.TOPLAM_HAM_TUTAR AS TaxExcluded,
            A.TOPLAM_KDV_TUTARI AS TaxAmount,
            COALESCE(A.BAKIYE, 0) AS RemainingAmount,
            COALESCE(A.DOVIZ_BIRIMI, 'TRY') AS Currency,
            CAST(A.ALISSATIS_NO AS BIGINT) AS HeaderId
        FROM ALSAASIL A
        LEFT JOIN ALSAASIL O ON O.ALISSATIS_NO = A.REFERANS_ALISSATIS_NO AND O.ISLEM_KODU = 'SIPARIS'
        WHERE A.ISLEM_KODU = 'FATURA'
            AND A.CARI_NO = @CariNo
            AND (A.KAYIT_DURUMU IS NULL OR A.KAYIT_DURUMU <> 'S')
        ORDER BY A.TARIH DESC
        """;

    private const string LinesSql = """
        SELECT
            CAST(D.STOK_NO AS BIGINT) AS ProductId,
            D.MIKTAR AS Quantity,
            D.BIRIM_FIYAT AS UnitPrice,
            COALESCE(D.KDV_ORANI, 0) AS TaxRate
        FROM ALSADETA D
        WHERE D.ISLEM_KODU = 'FATURA' AND D.ALISSATIS_NO = @HeaderId
        ORDER BY D.SIRA_NO
        """;

    public async Task<IReadOnlyList<InvoiceSummary>> GetForCariAsync(long cariNo, CancellationToken cancellationToken)
    {
        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);

        var headers = await connection.QueryAsync<HeaderRow>(new CommandDefinition(
            HeaderSql, new { CariNo = cariNo }, cancellationToken: cancellationToken));

        var today = DateTime.Now.Date;
        var result = new List<InvoiceSummary>();
        foreach (var header in headers)
        {
            var lines = await connection.QueryAsync<InvoiceLineItem>(new CommandDefinition(
                LinesSql, new { HeaderId = header.HeaderId }, cancellationToken: cancellationToken));

            var status = header.RemainingAmount <= 0
                ? "Ödendi"
                : header.DueDate.Date < today ? "Vadesi Geçti" : "Açık";

            result.Add(new InvoiceSummary(
                header.Id,
                header.CariNo,
                header.CreatedAt,
                header.DueDate,
                status,
                header.OrderId,
                header.PaymentTerm,
                header.Description,
                header.Total,
                header.TaxExcluded,
                header.TaxAmount,
                header.Total - header.RemainingAmount,
                header.RemainingAmount,
                header.Currency,
                lines.AsList()));
        }

        return result;
    }

    private sealed record HeaderRow(
        string Id,
        long CariNo,
        DateTime CreatedAt,
        DateTime DueDate,
        string? OrderId,
        string? PaymentTerm,
        string? Description,
        double Total,
        double TaxExcluded,
        double TaxAmount,
        double RemainingAmount,
        string Currency,
        long HeaderId);
}
