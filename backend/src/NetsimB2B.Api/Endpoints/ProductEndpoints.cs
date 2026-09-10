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
            int? page,
            int? pageSize,
            ICurrentCompanyContext companyContext,
            IProductReadService products,
            CancellationToken cancellationToken) =>
        {
            var result = await products.SearchAsync(
                companyContext.CariNo,
                search,
                Math.Max(page ?? 1, 1),
                Math.Clamp(pageSize ?? 24, 1, 100),
                cancellationToken);

            return Results.Ok(result);
        });

        return endpoints;
    }
}

