using System.Data.Common;

namespace NetsimB2B.Application.Abstractions.Data;

public interface IB2BConnectionFactory
{
    ValueTask<DbConnection> OpenConnectionAsync(CancellationToken cancellationToken = default);
}
