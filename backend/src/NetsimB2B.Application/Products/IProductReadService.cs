namespace NetsimB2B.Application.Products;

public interface IProductReadService
{
    Task<IReadOnlyList<ProductListItem>> SearchAsync(
        long cariNo,
        string? search,
        string? category,
        string? brand,
        bool inStockOnly,
        string? sort,
        int page,
        int pageSize,
        CancellationToken cancellationToken);

    Task<ProductListItem?> GetAsync(
        long cariNo,
        long id,
        CancellationToken cancellationToken);
}
