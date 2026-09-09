using NetsimB2B.Application.Products;

namespace NetsimB2B.Api.Endpoints;

public static class ProductEndpoints
{
    public static IEndpointRouteBuilder MapProductEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/products").WithTags("Products");

        group.MapGet("/", async (
            string? search,
            int? page,
            int? pageSize,
            IProductReadService products,
            CancellationToken cancellationToken) =>
        {
            // TODO: CariNo, doğrulanmış kullanıcı-firma bağlamından alınmalıdır.
            const long temporaryCariNo = 0;
            var result = await products.SearchAsync(
                temporaryCariNo,
                search,
                Math.Max(page ?? 1, 1),
                Math.Clamp(pageSize ?? 24, 1, 100),
                cancellationToken);

            return Results.Ok(result);
        });

        return endpoints;
    }
}

