namespace NetsimB2B.Application.Favorites;

public interface IFavoriteStore
{
    Task<IReadOnlyList<long>> GetStokNosAsync(Guid userId, CancellationToken cancellationToken);

    Task AddAsync(Guid userId, long stokNo, CancellationToken cancellationToken);

    Task RemoveAsync(Guid userId, long stokNo, CancellationToken cancellationToken);
}
