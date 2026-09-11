namespace NetsimB2B.Application.Shipments;

public sealed record ShipmentSummary(
    string Id,
    long CariNo,
    string? OrderId,
    DateTime Date,
    string Status,
    string? Carrier,
    string? TrackingNo,
    DateTime EstimatedDelivery,
    DateTime? DeliveredAt,
    string? Origin,
    string? Destination,
    string? VehiclePlate,
    string? DriverName,
    IReadOnlyList<ShipmentEvent> Events);
