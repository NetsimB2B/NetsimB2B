namespace NetsimB2B.Application.Cart;

public sealed record CartLineItem(long StokNo, decimal Quantity, decimal? UnitPrice, string? QuoteId);
