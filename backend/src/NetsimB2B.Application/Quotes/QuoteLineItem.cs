namespace NetsimB2B.Application.Quotes;

public sealed record QuoteLineItem(long ProductId, double Quantity, double UnitPrice, double ListPrice);
