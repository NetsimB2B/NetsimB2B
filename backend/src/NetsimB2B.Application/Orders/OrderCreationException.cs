namespace NetsimB2B.Application.Orders;

// Kullanıcı hatası (boş sepet, yetersiz stok, kredi limiti aşımı) — 400 olarak dönülür,
// sunucu hatasıyla (500) karıştırılmaması için InvalidOperationException'dan ayrı bir tip.
public sealed class OrderCreationException(string message) : Exception(message);
