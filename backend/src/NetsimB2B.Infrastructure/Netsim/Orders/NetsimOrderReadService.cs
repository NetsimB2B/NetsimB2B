using Dapper;
using NetsimB2B.Application.Abstractions.Data;
using NetsimB2B.Application.Orders;

namespace NetsimB2B.Infrastructure.Netsim.Orders;

internal sealed class NetsimOrderReadService(INetsimConnectionFactory connectionFactory) : IOrderReadService
{
    private static readonly HashSet<string> ValidStatuses = ["Alındı", "Onaylandı", "Hazırlanıyor", "Sevk Edildi"];

    // VADE_TARIHI teklifte "geçerlilik tarihi" anlamına gelirken siparişte "planlanan
    // teslimat" anlamına geliyor — aynı kolon, belge türüne göre farklı iş anlamı (ERP'de
    // yaygın bir kalıp). DURUM/REFERANS_NO/YETKILI_ADI/ODEME_BILGISI/DT_NAKLIYE_SEKLI/
    // ACIKLAMA_TEXT/REFERANS_ALISSATIS_NO gerçek şema alanları ama netsim-dev seed'inde
    // başlangıçta boştu — bkz. netsim-dev/V003__enrich_order_display_fields.sql.
    // REFERANS_ALISSATIS_NO ile kaynak teklife (ISLEM_KODU='TEKLIF') self-join yapılıyor;
    // gerçek Netsim'de bu bağlantının nasıl kurulduğu doğrulanmadı.
    private const string HeaderSql = """
        SELECT
            A.BELGE_NO AS Id,
            CAST(A.CARI_NO AS BIGINT) AS CariNo,
            A.TARIH AS CreatedAt,
            A.DURUM AS Status,
            A.REFERANS_NO AS CustomerOrderNo,
            A.VADE_TARIHI AS ExpectedDeliveryDate,
            A.YETKILI_ADI AS SalesRepresentative,
            A.DT_NAKLIYE_SEKLI AS ShippingMethod,
            A.ODEME_BILGISI AS PaymentMethod,
            A.ACIKLAMA_TEXT AS Note,
            Q.BELGE_NO AS QuoteId,
            A.TOPLAM_HAM_TUTAR AS Total,
            CAST(A.ALISSATIS_NO AS BIGINT) AS HeaderId
        FROM ALSAASIL A
        LEFT JOIN ALSAASIL Q ON Q.ALISSATIS_NO = A.REFERANS_ALISSATIS_NO AND Q.ISLEM_KODU = 'TEKLIF'
        WHERE A.ISLEM_KODU = 'SIPARIS'
            AND A.CARI_NO = @CariNo
            AND (A.KAYIT_DURUMU IS NULL OR A.KAYIT_DURUMU <> 'S')
        ORDER BY A.TARIH DESC
        """;

    private const string LinesSql = """
        SELECT
            CAST(D.STOK_NO AS BIGINT) AS ProductId,
            D.MIKTAR AS Quantity,
            D.BIRIM_FIYAT AS UnitPrice
        FROM ALSADETA D
        WHERE D.ISLEM_KODU = 'SIPARIS' AND D.ALISSATIS_NO = @HeaderId
        ORDER BY D.SIRA_NO
        """;

    public async Task<IReadOnlyList<OrderSummary>> GetForCariAsync(long cariNo, CancellationToken cancellationToken)
    {
        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);

        var headers = await connection.QueryAsync<HeaderRow>(new CommandDefinition(
            HeaderSql, new { CariNo = cariNo }, cancellationToken: cancellationToken));

        var result = new List<OrderSummary>();
        foreach (var header in headers)
        {
            var lines = await connection.QueryAsync<OrderLineItem>(new CommandDefinition(
                LinesSql, new { HeaderId = header.HeaderId }, cancellationToken: cancellationToken));

            var status = header.Status is not null && ValidStatuses.Contains(header.Status) ? header.Status : "Alındı";

            result.Add(new OrderSummary(
                header.Id,
                header.CariNo,
                header.CreatedAt,
                status,
                header.CustomerOrderNo,
                header.ExpectedDeliveryDate,
                header.SalesRepresentative,
                header.ShippingMethod,
                header.PaymentMethod,
                header.Note,
                header.QuoteId,
                header.Total,
                lines.AsList()));
        }

        return result;
    }

    private sealed record HeaderRow(
        string Id,
        long CariNo,
        DateTime CreatedAt,
        string? Status,
        string? CustomerOrderNo,
        DateTime ExpectedDeliveryDate,
        string? SalesRepresentative,
        string? ShippingMethod,
        string? PaymentMethod,
        string? Note,
        string? QuoteId,
        double Total,
        long HeaderId);
}
