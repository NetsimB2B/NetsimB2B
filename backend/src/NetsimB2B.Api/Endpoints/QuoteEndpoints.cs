using NetsimB2B.Application.Abstractions.Security;
using NetsimB2B.Application.Quotes;

namespace NetsimB2B.Api.Endpoints;

public static class QuoteEndpoints
{
    public static IEndpointRouteBuilder MapQuoteEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/quotes").WithTags("Quotes").RequireAuthorization();

        group.MapGet("/", async (
            ICurrentCompanyContext companyContext,
            IQuoteReadService quotes,
            CancellationToken cancellationToken) =>
        {
            var result = await quotes.GetForCariAsync(companyContext.CariNo, cancellationToken);
            return Results.Ok(result);
        });

        return endpoints;
    }
}
