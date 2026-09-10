namespace NetsimB2B.Application.Auth;

public interface ICariAccessStore
{
    Task<IReadOnlyList<CariAccess>> GetForUserAsync(Guid userId, CancellationToken cancellationToken);
}
