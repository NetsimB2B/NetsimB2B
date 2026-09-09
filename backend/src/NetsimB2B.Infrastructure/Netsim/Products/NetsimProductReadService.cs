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
        const string sql = """
            /* STOKKART alanları müşteri Netsim kurulumu üzerinde doğrulanmalıdır. */
            SELECT FIRST @PageSize SKIP @Offset
                S.STOK_NO AS Id,
                S.STOK_KODU AS Code,
                S.STOK_ADI AS Name,
                S.BIRIM AS Unit
            FROM STOKKART S
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

