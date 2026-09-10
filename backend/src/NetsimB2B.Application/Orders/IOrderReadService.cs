namespace NetsimB2B.Application.Orders;

public interface IOrderReadService
{
    Task<IReadOnlyList<OrderSummary>> GetForCariAsync(long cariNo, CancellationToken cancellationToken);
}
