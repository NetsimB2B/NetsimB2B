namespace NetsimB2B.Application.Quotes;

public sealed record QuoteSummary(
    string Id,
    string? Reference,
    string Title,
    long CariNo,
    DateTime CreatedAt,
    DateTime ValidUntil,
    string Status,
    string? SalesRepresentative,
    string? PaymentTerm,
    string? DeliveryTerm,
    string? Note,
    double Total,
    IReadOnlyList<QuoteLineItem> Lines);
