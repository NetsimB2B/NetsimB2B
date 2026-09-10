namespace NetsimB2B.Application.Orders;

public sealed record OrderSummary(
    string Id,
    long CariNo,
    DateTime CreatedAt,
    string Status,
    string? CustomerOrderNo,
    DateTime ExpectedDeliveryDate,
    string? SalesRepresentative,
    string? ShippingMethod,
    string? PaymentMethod,
    string? Note,
    string? QuoteId,
    double Total,
    IReadOnlyList<OrderLineItem> Lines);
