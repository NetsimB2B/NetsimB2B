namespace NetsimB2B.Application.Products;

public interface IProductReadService
{
    Task<IReadOnlyList<ProductListItem>> SearchAsync(
        long cariNo,
        string? search,
        int page,
        int pageSize,
        CancellationToken cancellationToken);
}

