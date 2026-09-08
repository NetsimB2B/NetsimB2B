# User Types

<!--
Bu dosya sistemde bulunacak kullanıcı türlerini, rollerini ve erişim seviyelerini tanımlar.

## Kullanıcı Modeli

Öncelikle şu sorular cevaplanmalıdır:

- Kullanıcı bir cariye mi bağlıdır?
- Bir kullanıcı birden fazla cariye bağlı olabilir mi?
- Bir kullanıcı birden fazla firmayı görebilir mi?
- Kullanıcı Netsim Nuke kullanıcısı ile eşleşecek mi?
- B2B'nin kendi kullanıcı sistemi olacak mı?

## Kullanıcı Tipleri

Her rol aşağıdaki yapıyla tanımlanabilir.

### Bayi Kullanıcısı

Amaç:
Standart B2B işlemlerini gerçekleştirmek.

Görebildiği modüller:
- Products
- Cart
- Orders
- Quotes
vb.

Yapabildiği işlemler:
- Sipariş oluşturma
- Teklif görüntüleme
- Cari hesap görüntüleme

Veri sınırı:
- Yalnızca bağlı olduğu cari.

### Bayi Yöneticisi

Standart kullanıcıya ek olarak:
- Firma kullanıcılarını yönetebilir mi?
- Siparişleri onaylayabilir mi?
vb.

### Finans Kullanıcısı

Örneğin:
- Cari ekstre
- Fatura
- Ödeme

görebilir fakat sipariş oluşturamayabilir.

### Satış Temsilcisi

Birden fazla cariye erişebilir.

### Firma Admin

B2B ayarlarını yönetebilir.

## Role-Permission Matrisi

İleride tablo şeklinde:

| Permission | Bayi | Bayi Admin | Finans | Admin |
| ... |

## Netsim Eşleşmeleri

Örneğin:
- CARI_NO
- NUKE_USER_NO
- PERSONEL_NO

## Firma Değiştirme

Bir kullanıcı birden fazla firmaya bağlıysa çalışma mantığı burada açıklanmalıdır.

## Güvenlik Kuralları

Frontend'de bir menüyü gizlemek tek başına yetkilendirme değildir.
Backend mutlaka rol ve cari kontrolü yapmalıdır.
-->