using System.Data.Common;
using FirebirdSql.Data.FirebirdClient;
using NetsimB2B.Application.Abstractions.Data;

namespace NetsimB2B.Infrastructure.B2B;

internal sealed class FirebirdB2BConnectionFactory(string connectionString) : IB2BConnectionFactory
{
    public async ValueTask<DbConnection> OpenConnectionAsync(CancellationToken cancellationToken = default)
    {
        var connection = new FbConnection(connectionString);
        await connection.OpenAsync(cancellationToken);
        return connection;
    }
}
