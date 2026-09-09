using System.Data.Common;
using FirebirdSql.Data.FirebirdClient;
using NetsimB2B.Application.Abstractions.Data;

namespace NetsimB2B.Infrastructure.Netsim;

internal sealed class FirebirdConnectionFactory(string connectionString) : INetsimConnectionFactory
{
    public async ValueTask<DbConnection> OpenConnectionAsync(CancellationToken cancellationToken = default)
    {
        var connection = new FbConnection(connectionString);
        await connection.OpenAsync(cancellationToken);
        return connection;
    }
}

