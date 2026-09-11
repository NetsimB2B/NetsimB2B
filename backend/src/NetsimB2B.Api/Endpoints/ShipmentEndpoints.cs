using NetsimB2B.Application.Abstractions.Security;
using NetsimB2B.Application.Shipments;

namespace NetsimB2B.Api.Endpoints;

public static class ShipmentEndpoints
{
    public static IEndpointRouteBuilder MapShipmentEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/shipments").WithTags("Shipments").RequireAuthorization();

        group.MapGet("/", async (
            ICurrentCompanyContext companyContext,
            IShipmentReadService shipments,
            CancellationToken cancellationToken) =>
        {
            var result = await shipments.GetForCariAsync(companyContext.CariNo, cancellationToken);
            return Results.Ok(result);
        });

        return endpoints;
    }
}
