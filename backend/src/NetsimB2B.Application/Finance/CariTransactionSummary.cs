namespace NetsimB2B.Application.Finance;

public sealed record CariTransactionSummary(
    string Id,
    long CariNo,
    DateTime Date,
    DateTime? DueDate,
    string Document,
    string DocumentType,
    string? Description,
    double Debit,
    double Credit,
    double BalanceAfter,
    string Status,
    string? RelatedInvoiceId);
