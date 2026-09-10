namespace NetsimB2B.Application.Orders;

public sealed record OrderLineItem(long ProductId, double Quantity, double UnitPrice);
