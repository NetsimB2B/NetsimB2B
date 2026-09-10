using NetsimB2B.Application.Abstractions.Security;
using NetsimB2B.Application.Orders;

namespace NetsimB2B.Api.Endpoints;

public static class OrderEndpoints
{
    public static IEndpointRouteBuilder MapOrderEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/orders").WithTags("Orders").RequireAuthorization();

        group.MapGet("/", async (
            ICurrentCompanyContext companyContext,
            IOrderReadService orders,
            CancellationToken cancellationToken) =>
        {
            var result = await orders.GetForCariAsync(companyContext.CariNo, cancellationToken);
            return Results.Ok(result);
        });

        return endpoints;
    }
}
