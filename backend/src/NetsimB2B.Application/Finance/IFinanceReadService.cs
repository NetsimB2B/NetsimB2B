namespace NetsimB2B.Application.Finance;

public interface IFinanceReadService
{
    Task<IReadOnlyList<AccountFinanceSummary>> GetAccountsAsync(
        IReadOnlyCollection<long> cariNos, CancellationToken cancellationToken);

    Task<IReadOnlyList<CariTransactionSummary>> GetTransactionsAsync(
        long cariNo, CancellationToken cancellationToken);
}
