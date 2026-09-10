using System.Security.Claims;
using NetsimB2B.Application.Favorites;

namespace NetsimB2B.Api.Endpoints;

public static class FavoriteEndpoints
{
    public static IEndpointRouteBuilder MapFavoriteEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/favorites").WithTags("Favorites").RequireAuthorization();

        group.MapGet("/", async (
            HttpContext httpContext,
            IFavoriteStore favoriteStore,
            CancellationToken cancellationToken) =>
        {
            var stokNos = await favoriteStore.GetStokNosAsync(CurrentUserId(httpContext), cancellationToken);
            return Results.Ok(stokNos);
        });

        group.MapPost("/{stokNo:long}", async (
            long stokNo,
            HttpContext httpContext,
            IFavoriteStore favoriteStore,
            CancellationToken cancellationToken) =>
        {
            await favoriteStore.AddAsync(CurrentUserId(httpContext), stokNo, cancellationToken);
            return Results.NoContent();
        });

        group.MapDelete("/{stokNo:long}", async (
            long stokNo,
            HttpContext httpContext,
            IFavoriteStore favoriteStore,
            CancellationToken cancellationToken) =>
        {
            await favoriteStore.RemoveAsync(CurrentUserId(httpContext), stokNo, cancellationToken);
            return Results.NoContent();
        });

        return endpoints;
    }

    private static Guid CurrentUserId(HttpContext httpContext) =>
        Guid.Parse(httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)!);
}
