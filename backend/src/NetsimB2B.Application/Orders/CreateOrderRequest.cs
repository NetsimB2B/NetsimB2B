namespace NetsimB2B.Application.Orders;

public sealed record CreateOrderRequest(string? DeliveryAddress, string? PaymentMethod, string? ShippingMethod, string? Note);
