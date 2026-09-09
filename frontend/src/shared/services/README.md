# Frontend veri kaynağı

Portal şu anda yalnız demo amacıyla `portalService` üzerinden mock veri kullanır.
Ekranlar `mocks/` klasörünü doğrudan import etmez; React Query hook'ları servis
sözleşmesine çağrı yapar.

Gerçek backend hazır olduğunda:

1. `/api/v1/me` ve `/api/v1/me/accounts` ile oturum/firma verisini bağla.
2. `/api/v1/products`, pricing ve inventory cevaplarını `Product` modeline eşle.
3. Sepet işlemlerini `/api/v1/cart` endpoint'lerine taşı.
4. Checkout doğrulamasını `/api/v1/orders/validate` üzerinden yap.
5. Sipariş oluştururken idempotency key gönder ve `/api/v1/orders` kullan.
6. Mock `localStorage` state'ini kaldır; yalnız UI tercihlerini yerelde tut.
7. `VITE_DATA_SOURCE=api` seçeneğini ekleyip production'da mock kullanımını engelle.

Mock fiyat, stok, limit ve sipariş sonuçları ticari gerçeklik değildir.
