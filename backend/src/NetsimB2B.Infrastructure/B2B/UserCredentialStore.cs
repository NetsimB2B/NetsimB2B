using Dapper;
using NetsimB2B.Application.Abstractions.Data;
using NetsimB2B.Application.Auth;

namespace NetsimB2B.Infrastructure.B2B;

internal sealed class UserCredentialStore(IB2BConnectionFactory connectionFactory) : IUserCredentialStore
{
    private sealed record Row(string Id, string Email, string DisplayName, bool IsActive, string PasswordHash);

    public async Task<UserCredential?> GetByEmailAsync(string email, CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT ID AS Id, EMAIL AS Email, DISPLAY_NAME AS DisplayName, IS_ACTIVE AS IsActive, PASSWORD_HASH AS PasswordHash
            FROM B2B_USERS
            WHERE EMAIL = @Email
            """;

        return await QuerySingleAsync(sql, new { Email = email }, cancellationToken);
    }

    public async Task<UserCredential?> GetByIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT ID AS Id, EMAIL AS Email, DISPLAY_NAME AS DisplayName, IS_ACTIVE AS IsActive, PASSWORD_HASH AS PasswordHash
            FROM B2B_USERS
            WHERE ID = @Id
            """;

        return await QuerySingleAsync(sql, new { Id = userId.ToString() }, cancellationToken);
    }

    private async Task<UserCredential?> QuerySingleAsync(string sql, object parameters, CancellationToken cancellationToken)
    {
        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);
        var command = new CommandDefinition(sql, parameters, cancellationToken: cancellationToken);
        var row = await connection.QuerySingleOrDefaultAsync<Row>(command);
        return row is null
            ? null
            : new UserCredential(Guid.Parse(row.Id.Trim()), row.Email, row.DisplayName, row.IsActive, row.PasswordHash);
    }
}
