using Dapper;
using NetsimB2B.Application.Abstractions.Data;
using NetsimB2B.Application.Auth;

namespace NetsimB2B.Infrastructure.B2B;

internal sealed class CariAccessStore(IB2BConnectionFactory connectionFactory) : ICariAccessStore
{
    public async Task<IReadOnlyList<CariAccess>> GetForUserAsync(Guid userId, CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT CARI_NO AS CariNo, IS_DEFAULT AS IsDefault
            FROM B2B_USER_CARI_ACCESS
            WHERE USER_ID = @UserId
            ORDER BY CARI_NO
            """;

        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);
        var command = new CommandDefinition(sql, new { UserId = userId.ToString() }, cancellationToken: cancellationToken);
        var rows = await connection.QueryAsync<CariAccess>(command);
        return rows.AsList();
    }
}
