using NetsimB2B.Application.Abstractions.Security;
using NetsimB2B.Application.Finance;

namespace NetsimB2B.Api.Endpoints;

public static class FinanceEndpoints
{
    public static IEndpointRouteBuilder MapFinanceEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/finance").WithTags("Finance").RequireAuthorization();

        // Aktif firma seçicisi (AppShell) ve hesap listesi tüm erişilebilir carileri gösterir,
        // tek bir aktif cariyi değil — bkz. ICurrentCompanyContext.AllowedCariNos.
        group.MapGet("/accounts", async (
            ICurrentCompanyContext companyContext,
            IFinanceReadService finance,
            CancellationToken cancellationToken) =>
        {
            var result = await finance.GetAccountsAsync(companyContext.AllowedCariNos, cancellationToken);
            return Results.Ok(result);
        });

        group.MapGet("/transactions", async (
            ICurrentCompanyContext companyContext,
            IFinanceReadService finance,
            CancellationToken cancellationToken) =>
        {
            var result = await finance.GetTransactionsAsync(companyContext.CariNo, cancellationToken);
            return Results.Ok(result);
        });

        return endpoints;
    }
}
