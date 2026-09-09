# Netsim Adapter

Netsim'e özgü tablo, kolon, işlem kodu ve SQL burada tutulur. `Products` örneğindeki kolon adları keşif amaçlıdır ve gerçek kurulumdaki `NETSIM_TABLE_MAP.md` tamamlanmadan üretimde kullanılmamalıdır.

Her ticari modül için ayrı adapter klasörü açın:

- `Products`: stok kartı, fiyat, varyant, satılabilir stok
- `Orders`: alınan sipariş başlık/detay ve durum eşleme
- `Quotes`: verilen teklif başlık/detay ve durum eşleme
- `Finance`: cari bakiye, açık/vadesi geçmiş hareketler
- `Logistics`: sevkiyat, irsaliye ve fatura ilişkileri

