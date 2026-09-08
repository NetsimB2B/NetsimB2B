# Netsim Table Map

<!--
Bu dosya B2B projesinde kullanılan Netsim tablolarının merkezi kataloğudur.

Amaç:
Her modül içinde tekrar tekrar tablo açıklaması yapmak yerine tek bir teknik referans oluşturmak.

Her tablo şu formatla belgelenebilir:

---

## TABLE_NAME

### Amaç
Tablonun Netsim içerisindeki fonksiyonu.

### Ana Primary/Identity Alan
Örneğin:
CARI_NO
STOK_NO
ALISSATIS_NO

### Önemli Alanlar
B2B projesinin kullandığı kolonlar.

### B2B'de Kullanıldığı Modüller
Örneğin:
Dashboard
Products
Orders

### İlişkiler
Hangi tablolarla hangi alan üzerinden ilişki kuruluyor?

### Read / Write
B2B bu tabloyu:
- yalnızca okuyor mu?
- kontrollü yazıyor mu?
- Netsim servis üzerinden mi değiştiriyor?

### Açık Sorular
Henüz anlamı kesinleşmeyen alanlar.

---

Başlangıçta belgelenmesi gereken tablolar:

## CARIKART

Cari master.

Önemli aday alanlar:
- CARI_NO
- CARI_KODU
- CARI_ADI
- BLOKE
- CARI_LIMIT_GRUP_NO
- BAYI_TURU
- ODEME_NO
- TAHSILAT_NO
- KREDILI_ISLEM
- EMAIL
- SEVKIYAT_SECENEGI
vb.

## CARIISLM

Cari hareketler.

Aday alanlar:
- CARI_ISLEM_NO
- CARI_NO
- BORC
- ALACAK
- BAKIYE
- BAKIYE_CUR
- GENEL_BAKIYE
- VADE_TARIHI
- KAPANDI
- KAPANMA
- RISK_CARPANI

## STOKKART

Ürün/stok master.

Aday alanlar:
- STOK_NO
- STOK_KODU
- STOK_ADI
- STOK_TIP_NO
- STOK_TIP_ADI
- MARKA_NO
- URUN_HATTI_NO
- WEB_AKTIF
- SATILABILIRLIK
- BLOKE
- VARYANT_ZORUNLU
- RESIM
- ACIKLAMA_HTML

## ALSAASIL

Alış/satış işlem header.

B2B'de:
- Teklif
- Sipariş
- Fatura
gibi belgelerde kullanılabilir.

## ALSADETA

Alış/satış işlem satırları.

## STOKASIL

Stok işlem/sevkiyat header.

## STOKISLM

Stok hareket satırları.

Yeni tablo keşfedildikçe bu dosyaya eklenmelidir.

Önemli:
Tablo ismi tahmin edilerek eklenmemelidir.
Gerçek Firebird şeması veya Netsim dokümantasyonu ile doğrulanmalıdır.
-->