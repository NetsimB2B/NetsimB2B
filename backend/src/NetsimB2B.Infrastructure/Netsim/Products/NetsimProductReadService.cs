using System.Text.RegularExpressions;
using Dapper;
using NetsimB2B.Application.Abstractions.Data;
using NetsimB2B.Application.Products;

namespace NetsimB2B.Infrastructure.Netsim.Products;

internal sealed partial class NetsimProductReadService(INetsimConnectionFactory connectionFactory) : IProductReadService
{
    // STOKKART/STOKBIRI/STOKURHA/STOKMARK/FIYADETA/STOKKADE alanları müşteri Netsim
    // kurulumu üzerinde doğrulanmalıdır (bkz. docs/03-modules/ürünler.md madde 105).
    // STOKKART'ta BIRIM kolonu yok; birim STOKBIRI'den STOK_NO + SIRA_NO=1 (ana birim) ile
    // okunur. VARSAYIM: SIRA_NO=1 ana birimi temsil eder, Netsim'de doğrulanmalıdır.
    // Fiyat: FIYADETA.CARI_KODU + TURU='SATIS' ile eşleşen tek satır alınıyor. VARSAYIM:
    // gerçek Netsim'de ONCELIK/tarih aralığı/miktar kademesi/kampanya gibi ek kriterlerle
    // birden fazla satır arasından seçim yapılabilir (bkz. docs/04-data/NETSIM_TABLO_HARİTASI.md
    // → FIYALIST/FIYADETA) — bu basitleştirilmiş sorgu tek-liste senaryosu için yeterlidir.
    // Stok: STOKKADE.MIKTAR toplamı kullanılıyor. VARSAYIM: güncel bakiye kaynağı bu tablo
    // (bkz. netsim-dev/README.md → "Stok bakiye kaynağı VARSAYIMDIR").
    // STOK_NO Netsim'de INTEGER (Int32); Dapper'ın record constructor eşlemesi Int32->long
    // genişletmesini otomatik yapmadığından BIGINT'e cast edilir.
    // NOT: SQL metni (yorumlar dahil) içine tek tırnak veya @ işareti KOYMAYIN — bu ADO.NET
    // sürücüsünün istemci taraflı parametre ayıklayıcısı SQL yorumlarını atlamıyor (bkz.
    // git geçmişindeki orijinal not, gerçekten doğrulandı). Bu yüzden bu notlar SQL string'i
    // DIŞINDA, C# yorumu olarak tutuluyor.
    private const string SelectFromJoins = """
        SELECT
            CAST(S.STOK_NO AS BIGINT) AS Id,
            S.STOK_KODU AS Code,
            S.STOK_ADI AS Name,
            SB.BIRIM AS Unit,
            UH.URUN_HATTI_ADI AS Category,
            MK.MARKA_ADI AS Brand,
            S.ACIKLAMA_HTML AS DescriptionHtml,
            FD.LISTE_FIYATI AS Price,
            COALESCE(ST.TotalStock, 0) AS Stock
        FROM STOKKART S
        LEFT JOIN STOKBIRI SB ON SB.STOK_NO = S.STOK_NO AND SB.SIRA_NO = 1
        LEFT JOIN STOKURHA UH ON UH.URUN_HATTI_NO = S.URUN_HATTI_NO
        LEFT JOIN STOKMARK MK ON MK.MARKA_NO = S.MARKA_NO
        LEFT JOIN CARIKART C ON C.CARI_NO = @CariNo
        LEFT JOIN FIYADETA FD ON FD.STOK_NO = S.STOK_NO AND FD.CARI_KODU = C.CARI_KODU
            AND FD.TURU = 'SATIS' AND FD.KAYIT_DURUMU = 'A'
        LEFT JOIN (
            SELECT STOK_NO, SUM(MIKTAR) AS TotalStock
            FROM STOKKADE
            GROUP BY STOK_NO
        ) ST ON ST.STOK_NO = S.STOK_NO
        WHERE S.WEB_AKTIF = 'E'
            AND (S.BLOKE IS NULL OR S.BLOKE <> 'E')
        """;

    public async Task<IReadOnlyList<ProductListItem>> SearchAsync(
        long cariNo,
        string? search,
        string? category,
        string? brand,
        bool inStockOnly,
        string? sort,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        var normalizedSearch = string.IsNullOrWhiteSpace(search) ? null : search.Trim();
        var normalizedCategory = string.IsNullOrWhiteSpace(category) ? null : category.Trim();
        var normalizedBrand = string.IsNullOrWhiteSpace(brand) ? null : brand.Trim();

        // Not: derived table (Q) dışından yalnızca çıktı kolon adları (Price, Name, ...)
        // görünür — iç tablo takma adları (FD, S, ...) ORDER BY içinde kullanılamaz.
        var orderBy = sort switch
        {
            "price-asc" => "ORDER BY Q.Price ASC NULLS LAST, Q.Name",
            "price-desc" => "ORDER BY Q.Price DESC NULLS LAST, Q.Name",
            _ => "ORDER BY Q.Name",
        };

        var sql = $"""
            SELECT FIRST @PageSize SKIP @Offset * FROM (
                {SelectFromJoins}
                    AND (@Search IS NULL
                        OR S.STOK_KODU CONTAINING @Search
                        OR S.STOK_ADI CONTAINING @Search
                        OR MK.MARKA_ADI CONTAINING @Search)
                    AND (@Category IS NULL OR UH.URUN_HATTI_ADI = @Category)
                    AND (@Brand IS NULL OR MK.MARKA_ADI = @Brand)
                    AND (@InStockOnly = 'N' OR COALESCE(ST.TotalStock, 0) > 0)
            ) Q
            {orderBy}
            """;

        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);
        var command = new CommandDefinition(
            sql,
            new
            {
                CariNo = cariNo,
                Search = normalizedSearch,
                Category = normalizedCategory,
                Brand = normalizedBrand,
                InStockOnly = inStockOnly ? "E" : "N",
                PageSize = pageSize,
                Offset = (page - 1) * pageSize,
            },
            cancellationToken: cancellationToken);

        var rows = await connection.QueryAsync<ProductRow>(command);
        return rows.Select(ToProductListItem).ToList();
    }

    public async Task<ProductListItem?> GetAsync(long cariNo, long id, CancellationToken cancellationToken)
    {
        var sql = $"""
            {SelectFromJoins}
                AND S.STOK_NO = @Id
            """;

        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);
        var command = new CommandDefinition(
            sql,
            new { CariNo = cariNo, Id = id },
            cancellationToken: cancellationToken);

        var row = await connection.QueryFirstOrDefaultAsync<ProductRow>(command);
        return row is null ? null : ToProductListItem(row);
    }

    private static ProductListItem ToProductListItem(ProductRow row) => new(
        row.Id,
        row.Code,
        row.Name,
        row.Unit,
        row.Category,
        row.Brand,
        StripHtml(row.DescriptionHtml),
        row.Price,
        row.Stock);

    private static string? StripHtml(string? html) =>
        string.IsNullOrWhiteSpace(html) ? null : HtmlTagRegex().Replace(html, string.Empty).Trim();

    [GeneratedRegex("<[^>]+>")]
    private static partial Regex HtmlTagRegex();

    private sealed record ProductRow(
        long Id,
        string Code,
        string Name,
        string Unit,
        string? Category,
        string? Brand,
        string? DescriptionHtml,
        double? Price,
        double Stock);
}
