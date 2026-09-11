namespace NetsimB2B.Application.Shipments;

public sealed record ShipmentEvent(string Title, DateTime Date, string? Location, bool Completed);
