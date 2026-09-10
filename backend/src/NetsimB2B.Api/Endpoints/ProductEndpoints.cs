using NetsimB2B.Application.Abstractions.Security;
using NetsimB2B.Application.Products;

namespace NetsimB2B.Api.Endpoints;

public static class ProductEndpoints
{
    public static IEndpointRouteBuilder MapProductEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/products").WithTags("Products").RequireAuthorization();

        group.MapGet("/", async (
            string? search,
            string? category,
            string? brand,
            bool? inStock,
            string? sort,
            int? page,
            int? pageSize,
            ICurrentCompanyContext companyContext,
            IProductReadService products,
            CancellationToken cancellationToken) =>
        {
            var result = await products.SearchAsync(
                companyContext.CariNo,
                search,
                category,
                brand,
                inStock ?? false,
                sort,
                Math.Max(page ?? 1, 1),
                Math.Clamp(pageSize ?? 24, 1, 500),
                cancellationToken);

            return Results.Ok(result);
        });

        group.MapGet("/{id:long}", async (
            long id,
            ICurrentCompanyContext companyContext,
            IProductReadService products,
            CancellationToken cancellationToken) =>
        {
            var product = await products.GetAsync(companyContext.CariNo, id, cancellationToken);
            return product is null ? Results.NotFound() : Results.Ok(product);
        });

        return endpoints;
    }
}

