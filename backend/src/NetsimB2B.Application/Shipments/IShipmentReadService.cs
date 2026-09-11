namespace NetsimB2B.Application.Shipments;

public interface IShipmentReadService
{
    Task<IReadOnlyList<ShipmentSummary>> GetForCariAsync(long cariNo, CancellationToken cancellationToken);
}
