using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using NetsimB2B.Api.Security;
using NetsimB2B.Application.Auth;
using AppAuthenticationService = NetsimB2B.Application.Auth.AuthenticationService;

namespace NetsimB2B.Api.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/auth").WithTags("Auth");

        group.MapPost("/login", async (
            LoginRequest request,
            HttpContext httpContext,
            AppAuthenticationService authenticationService,
            CancellationToken cancellationToken) =>
        {
            var session = await authenticationService.AuthenticateAsync(request.Email, request.Password, cancellationToken);
            if (session is null)
            {
                return Results.Unauthorized();
            }

            await SignInAsync(httpContext, session);
            return Results.Ok(session);
        });

        group.MapPost("/logout", async (HttpContext httpContext) =>
        {
            await httpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Results.NoContent();
        });

        group.MapGet("/me", async (
            HttpContext httpContext,
            AppAuthenticationService authenticationService,
            CancellationToken cancellationToken) =>
        {
            var userId = Guid.Parse(httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var session = await authenticationService.GetSessionAsync(userId, cancellationToken);
            if (session is null)
            {
                await httpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                return Results.Unauthorized();
            }

            return Results.Ok(session);
        }).RequireAuthorization();

        return endpoints;
    }

    private static async Task SignInAsync(HttpContext httpContext, UserSessionInfo session)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, session.User.Id.ToString()),
            new(ClaimTypes.Email, session.User.Email),
            new(ClaimTypes.Name, session.User.DisplayName),
            new(CariClaimTypes.DefaultCariNo, session.DefaultCariNo.ToString()),
        };
        claims.AddRange(session.Accounts.Select(a => new Claim(CariClaimTypes.CariNo, a.CariNo.ToString())));

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        await httpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
    }
}

public sealed record LoginRequest(string Email, string Password);
