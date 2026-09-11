using Dapper;
using NetsimB2B.Application.Abstractions.Data;
using NetsimB2B.Application.Finance;

namespace NetsimB2B.Infrastructure.Netsim.Finance;

internal sealed class NetsimFinanceReadService(INetsimConnectionFactory connectionFactory) : IFinanceReadService
{
    // CARIKART'ta bakiye/kredi limiti alanı yok — gerçek Netsim şemasında bunlar CARIKALI'da
    // (Cari Kart Limiti). Bakiye = TOPLAM_RISK (güncel risk tutarı), kullanılabilir limit =
    // BLOKE_MAX - TOPLAM_RISK. LIMIT_TURU domain değeri doğrulanmadı, 'GENEL' VARSAYIM olarak
    // kullanıldı (bkz. netsim_seed_gen.py → gen_carikali_rows).
    private const string AccountsSql = """
        SELECT
            CAST(CK.CARI_NO AS BIGINT) AS CariNo,
            CK.CARI_KODU AS CariKodu,
            CK.CARI_ADI AS CariAdi,
            CK.VERGI_NO AS TaxNumber,
            COALESCE(L.TOPLAM_RISK, 0) AS Balance,
            COALESCE(L.BLOKE_MAX, 0) - COALESCE(L.TOPLAM_RISK, 0) AS AvailableCredit
        FROM CARIKART CK
        LEFT JOIN CARIKALI L ON L.CARI_NO = CK.CARI_NO AND L.LIMIT_TURU = 'GENEL'
        WHERE CK.CARI_NO IN @CariNos
        """;

    // Vadesi geçen tutar CARIISLM'den açık kalem netlemesiyle hesaplanır: aynı faturaya
    // (REFERANS_ALISSATIS_NO) bağlı borç/alacak satırları netleştirilir, bağlantısı olmayan
    // satırlar kendi CARI_ISLEM_NO'suyla tek başına bir grup olur (negatif işaretlenir —
    // REFERANS_ALISSATIS_NO ALSAASIL.ALISSATIS_NO'yu gösterir, CARI_ISLEM_NO ise CARIISLM'in
    // kendi PK'sı; ikisi ayrı ID uzayı olduğundan aynı sayı değerine sahip olabilirler,
    // negatifleme çakışmayı önler). Yalnızca o gruptaki FATURA satırının DURUM'u
    // 'Vadesi Geçti' olan ve net bakiyesi pozitif kalan gruplar sayılır. BAKIYE/DURUM canlı
    // Netsim trigger'larından değil, bu mock seed'inden geliyor — gerçek Netsim'de açık kalem
    // eşleştirmesi muhtemelen ayrı bir muhasebe modülünde yapılır.
    private const string OverdueSql = """
        SELECT CAST(G.CariNo AS BIGINT) AS CariNo, SUM(G.Net) AS OverdueAmount
        FROM (
            SELECT
                C.CARI_NO AS CariNo,
                COALESCE(C.REFERANS_ALISSATIS_NO, -C.CARI_ISLEM_NO) AS Grp,
                SUM(C.BORC) - SUM(C.ALACAK) AS Net,
                MAX(CASE WHEN C.ISLEM_KODU = 'FATURA' THEN C.DURUM END) AS FaturaDurum
            FROM CARIISLM C
            WHERE C.CARI_NO IN @CariNos
            GROUP BY C.CARI_NO, COALESCE(C.REFERANS_ALISSATIS_NO, -C.CARI_ISLEM_NO)
        ) G
        WHERE G.FaturaDurum = 'Vadesi Geçti' AND G.Net > 0
        GROUP BY G.CariNo
        """;

    private const string TransactionsSql = """
        SELECT
            CAST(C.CARI_ISLEM_NO AS VARCHAR(20)) AS Id,
            CAST(C.CARI_NO AS BIGINT) AS CariNo,
            C.TARIH AS "Date",
            CASE WHEN C.ISLEM_KODU = 'FATURA' THEN C.VADE_TARIHI END AS DueDate,
            C.BELGE_NO AS Document,
            C.ISLEM_ADI AS DocumentType,
            C.ACIKLAMA AS Description,
            C.BORC AS Debit,
            C.ALACAK AS Credit,
            C.BAKIYE AS BalanceAfter,
            C.DURUM AS Status,
            F.BELGE_NO AS RelatedInvoiceId
        FROM CARIISLM C
        LEFT JOIN ALSAASIL F ON F.ALISSATIS_NO = C.REFERANS_ALISSATIS_NO AND F.ISLEM_KODU = 'FATURA'
        WHERE C.CARI_NO = @CariNo
        ORDER BY C.TARIH DESC, C.CARI_ISLEM_NO DESC
        """;

    public async Task<IReadOnlyList<AccountFinanceSummary>> GetAccountsAsync(
        IReadOnlyCollection<long> cariNos, CancellationToken cancellationToken)
    {
        if (cariNos.Count == 0)
        {
            return [];
        }

        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);

        var accounts = await connection.QueryAsync<AccountRow>(new CommandDefinition(
            AccountsSql, new { CariNos = cariNos }, cancellationToken: cancellationToken));
        var overdue = await connection.QueryAsync<OverdueRow>(new CommandDefinition(
            OverdueSql, new { CariNos = cariNos }, cancellationToken: cancellationToken));
        var overdueByCari = overdue.ToDictionary(o => o.CariNo, o => o.OverdueAmount);

        return accounts.Select(a => new AccountFinanceSummary(
            a.CariNo,
            a.CariKodu,
            a.CariAdi,
            a.TaxNumber,
            a.Balance,
            a.AvailableCredit,
            overdueByCari.GetValueOrDefault(a.CariNo, 0),
            "TRY")).ToList();
    }

    public async Task<IReadOnlyList<CariTransactionSummary>> GetTransactionsAsync(
        long cariNo, CancellationToken cancellationToken)
    {
        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);
        var rows = await connection.QueryAsync<CariTransactionSummary>(new CommandDefinition(
            TransactionsSql, new { CariNo = cariNo }, cancellationToken: cancellationToken));
        return rows.AsList();
    }

    private sealed record AccountRow(
        long CariNo, string CariKodu, string CariAdi, string? TaxNumber, double Balance, double AvailableCredit);

    private sealed record OverdueRow(long CariNo, double OverdueAmount);
}
