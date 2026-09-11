namespace NetsimB2B.Application.Invoices;

public sealed record InvoiceSummary(
    string Id,
    long CariNo,
    DateTime CreatedAt,
    DateTime DueDate,
    string Status,
    string? OrderId,
    string? PaymentTerm,
    string? Description,
    double Total,
    double TaxExcluded,
    double TaxAmount,
    double PaidAmount,
    double RemainingAmount,
    string Currency,
    IReadOnlyList<InvoiceLineItem> Lines);
