using Dapper;
using NetsimB2B.Application.Abstractions.Data;
using NetsimB2B.Application.Products;

namespace NetsimB2B.Infrastructure.Netsim.Products;

internal sealed class NetsimProductReadService(INetsimConnectionFactory connectionFactory) : IProductReadService
{
    public async Task<IReadOnlyList<ProductListItem>> SearchAsync(
        long cariNo,
        string? search,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
    {
        // STOKKART alanları müşteri Netsim kurulumu üzerinde doğrulanmalıdır.
        // STOKKART'ta BIRIM kolonu yok; birim STOKBIRI'den STOK_NO + SIRA_NO=1 (ana birim) ile
        // okunur. VARSAYIM: SIRA_NO=1 ana birimi temsil eder, Netsim'de doğrulanmalıdır.
        // STOK_NO Netsim'de INTEGER (Int32); Dapper'ın record constructor eşlemesi Int32->long
        // genişletmesini otomatik yapmadığından BIGINT'e cast edilir.
        // NOT: SQL metni (yorumlar dahil) içine tek tırnak veya @ işareti KOYMAYIN — bu ADO.NET
        // sürücüsünün istemci taraflı parametre ayıklayıcısı SQL yorumlarını atlamıyor; yorum
        // içindeki bir tek tırnak "string literal başladı" sanılmasına (sonraki @param'lar literal
        // metin olarak sunucuya gider, "Token unknown @"), yorum içindeki çıplak bir @ ise geçersiz
        // parametre adı olarak yorumlanmasına ("Must declare the variable '@'") yol açıyor — ikisi
        // de gerçekten yaşandı ve doğrulandı. Bu yüzden bu notlar SQL string'i DIŞINDA, C# yorumu
        // olarak tutuluyor.
        const string sql = """
            SELECT FIRST @PageSize SKIP @Offset
                CAST(S.STOK_NO AS BIGINT) AS Id,
                S.STOK_KODU AS Code,
                S.STOK_ADI AS Name,
                SB.BIRIM AS Unit
            FROM STOKKART S
            LEFT JOIN STOKBIRI SB ON SB.STOK_NO = S.STOK_NO AND SB.SIRA_NO = 1
            WHERE (@Search IS NULL
                OR S.STOK_KODU CONTAINING @Search
                OR S.STOK_ADI CONTAINING @Search)
            ORDER BY S.STOK_ADI
            """;

        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);
        var command = new CommandDefinition(
            sql,
            new { CariNo = cariNo, Search = search, PageSize = pageSize, Offset = (page - 1) * pageSize },
            cancellationToken: cancellationToken);

        var rows = await connection.QueryAsync<ProductListItem>(command);
        return rows.AsList();
    }
}

