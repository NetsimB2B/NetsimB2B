using Dapper;
using NetsimB2B.Application.Abstractions.Data;
using NetsimB2B.Application.Favorites;

namespace NetsimB2B.Infrastructure.B2B;

internal sealed class FavoriteStore(IB2BConnectionFactory connectionFactory) : IFavoriteStore
{
    public async Task<IReadOnlyList<long>> GetStokNosAsync(Guid userId, CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT CAST(STOK_NO AS BIGINT)
            FROM B2B_FAVORITES
            WHERE USER_ID = @UserId
            ORDER BY CREATED_AT DESC
            """;

        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);
        var command = new CommandDefinition(sql, new { UserId = userId.ToString() }, cancellationToken: cancellationToken);
        var rows = await connection.QueryAsync<long>(command);
        return rows.AsList();
    }

    public async Task AddAsync(Guid userId, long stokNo, CancellationToken cancellationToken)
    {
        // Idempotent: kullanıcı zaten favorilemişse sessizce günceller (CREATED_AT hariç
        // yazılacak başka kolon yok, MATCHING satırı zaten var olsa da hata vermez).
        const string sql = """
            UPDATE OR INSERT INTO B2B_FAVORITES (USER_ID, STOK_NO)
            VALUES (@UserId, @StokNo)
            MATCHING (USER_ID, STOK_NO)
            """;

        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);
        await connection.ExecuteAsync(new CommandDefinition(
            sql, new { UserId = userId.ToString(), StokNo = stokNo }, cancellationToken: cancellationToken));
    }

    public async Task RemoveAsync(Guid userId, long stokNo, CancellationToken cancellationToken)
    {
        const string sql = "DELETE FROM B2B_FAVORITES WHERE USER_ID = @UserId AND STOK_NO = @StokNo";

        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);
        await connection.ExecuteAsync(new CommandDefinition(
            sql, new { UserId = userId.ToString(), StokNo = stokNo }, cancellationToken: cancellationToken));
    }
}
