using System.Security.Claims;
using NetsimB2B.Application.Abstractions.Security;
using NetsimB2B.Application.Cart;

namespace NetsimB2B.Api.Endpoints;

public static class CartEndpoints
{
    public static IEndpointRouteBuilder MapCartEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/cart").WithTags("Cart").RequireAuthorization();

        group.MapGet("/", async (
            HttpContext httpContext,
            ICurrentCompanyContext companyContext,
            ICartStore cartStore,
            CancellationToken cancellationToken) =>
        {
            var lines = await cartStore.GetLinesAsync(CurrentUserId(httpContext), companyContext.CariNo, cancellationToken);
            return Results.Ok(lines);
        });

        group.MapPost("/lines", async (
            AddCartLineRequest request,
            HttpContext httpContext,
            ICurrentCompanyContext companyContext,
            ICartStore cartStore,
            CancellationToken cancellationToken) =>
        {
            if (request.Quantity <= 0) return Results.BadRequest(new { message = "Miktar sıfırdan büyük olmalıdır." });

            var line = await cartStore.AddLineAsync(
                CurrentUserId(httpContext),
                companyContext.CariNo,
                request.StokNo,
                request.Quantity,
                request.UnitPrice,
                request.QuoteId,
                cancellationToken);

            return Results.Ok(line);
        });

        group.MapPut("/lines/{stokNo:long}", async (
            long stokNo,
            UpdateCartLineRequest request,
            HttpContext httpContext,
            ICurrentCompanyContext companyContext,
            ICartStore cartStore,
            CancellationToken cancellationToken) =>
        {
            await cartStore.SetLineQuantityAsync(CurrentUserId(httpContext), companyContext.CariNo, stokNo, request.Quantity, cancellationToken);
            return Results.NoContent();
        });

        group.MapDelete("/lines/{stokNo:long}", async (
            long stokNo,
            HttpContext httpContext,
            ICurrentCompanyContext companyContext,
            ICartStore cartStore,
            CancellationToken cancellationToken) =>
        {
            await cartStore.RemoveLineAsync(CurrentUserId(httpContext), companyContext.CariNo, stokNo, cancellationToken);
            return Results.NoContent();
        });

        group.MapDelete("/", async (
            HttpContext httpContext,
            ICurrentCompanyContext companyContext,
            ICartStore cartStore,
            CancellationToken cancellationToken) =>
        {
            await cartStore.ClearAsync(CurrentUserId(httpContext), companyContext.CariNo, cancellationToken);
            return Results.NoContent();
        });

        return endpoints;
    }

    private static Guid CurrentUserId(HttpContext httpContext) =>
        Guid.Parse(httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}

public sealed record AddCartLineRequest(long StokNo, decimal Quantity, decimal? UnitPrice, string? QuoteId);

public sealed record UpdateCartLineRequest(decimal Quantity);
