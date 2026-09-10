namespace NetsimB2B.Application.Quotes;

public interface IQuoteReadService
{
    Task<IReadOnlyList<QuoteSummary>> GetForCariAsync(long cariNo, CancellationToken cancellationToken);
}
