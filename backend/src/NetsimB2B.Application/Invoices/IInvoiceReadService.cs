namespace NetsimB2B.Application.Invoices;

public interface IInvoiceReadService
{
    Task<IReadOnlyList<InvoiceSummary>> GetForCariAsync(long cariNo, CancellationToken cancellationToken);
}
