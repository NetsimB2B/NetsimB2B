namespace NetsimB2B.Application.Orders;

public interface IOrderWriteService
{
    // Sepeti (B2B_CARTS) sunucu tarafında okur, doğrular (fiyat/stok/kredi limiti) ve
    // ALSAASIL/ALSADETA'ya yazar; başarılı olursa sepeti temizler. Geçersiz durumlarda
    // OrderCreationException fırlatır.
    Task<OrderSummary> CreateFromCartAsync(
        Guid userId, long cariNo, CreateOrderRequest request, CancellationToken cancellationToken);
}
