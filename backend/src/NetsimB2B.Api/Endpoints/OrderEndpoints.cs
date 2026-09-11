using System.Security.Claims;
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

        group.MapPost("/", async (
            CreateOrderRequest request,
            HttpContext httpContext,
            ICurrentCompanyContext companyContext,
            IOrderWriteService orderWriteService,
            CancellationToken cancellationToken) =>
        {
            try
            {
                var userId = Guid.Parse(httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var order = await orderWriteService.CreateFromCartAsync(userId, companyContext.CariNo, request, cancellationToken);
                return Results.Ok(order);
            }
            catch (OrderCreationException ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }
        });

        return endpoints;
    }
}
