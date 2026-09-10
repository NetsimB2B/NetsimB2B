namespace NetsimB2B.Application.Cart;

public interface ICartStore
{
    Task<IReadOnlyList<CartLineItem>> GetLinesAsync(Guid userId, long cariNo, CancellationToken cancellationToken);

    // "Sepete ekle": satır zaten varsa miktarı üstüne ekler (quantity delta); unitPrice/quoteId
    // verilirse üzerine yazar (bkz. eski frontend-only davranış: options?.unitPrice ?? line.unitPrice).
    Task<CartLineItem> AddLineAsync(
        Guid userId,
        long cariNo,
        long stokNo,
        decimal quantity,
        decimal? unitPrice,
        string? quoteId,
        CancellationToken cancellationToken);

    // Miktar kontrolündeki -/+ ve elle giriş için: mutlak miktar belirler. quantity <= 0 ise satır silinir.
    Task SetLineQuantityAsync(Guid userId, long cariNo, long stokNo, decimal quantity, CancellationToken cancellationToken);

    Task RemoveLineAsync(Guid userId, long cariNo, long stokNo, CancellationToken cancellationToken);

    Task ClearAsync(Guid userId, long cariNo, CancellationToken cancellationToken);
}
