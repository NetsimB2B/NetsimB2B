using System.Data.Common;

namespace NetsimB2B.Application.Abstractions.Data;

public interface INetsimConnectionFactory
{
    ValueTask<DbConnection> OpenConnectionAsync(CancellationToken cancellationToken = default);
}

