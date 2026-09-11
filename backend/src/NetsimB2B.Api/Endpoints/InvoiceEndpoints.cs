using NetsimB2B.Application.Abstractions.Security;
using NetsimB2B.Application.Invoices;

namespace NetsimB2B.Api.Endpoints;

public static class InvoiceEndpoints
{
    public static IEndpointRouteBuilder MapInvoiceEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/invoices").WithTags("Invoices").RequireAuthorization();

        group.MapGet("/", async (
            ICurrentCompanyContext companyContext,
            IInvoiceReadService invoices,
            CancellationToken cancellationToken) =>
        {
            var result = await invoices.GetForCariAsync(companyContext.CariNo, cancellationToken);
            return Results.Ok(result);
        });

        return endpoints;
    }
}
