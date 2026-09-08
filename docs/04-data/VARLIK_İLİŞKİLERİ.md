# Entity Relationships

<!--
Bu dosya Netsim ve B2B varlıkları arasındaki ilişkilerin merkezi haritasıdır.

Amaç:
API ve SQL tasarımında hangi tablonun hangi tabloya nasıl bağlandığının kolayca görülebilmesi.

## Netsim Ana İlişkileri

Başlangıç ilişkileri:

CARIKART.CARI_NO
→ CARIISLM.CARI_NO

CARIKART.CARI_NO
→ ALSAASIL.CARI_NO

ALSAASIL.ALISSATIS_NO
→ ALSADETA.ALISSATIS_NO

ALSAASIL.ALISSATIS_NO
→ STOKASIL.ALISSATIS_NO

STOKASIL.STOK_ISLEMA_NO
→ STOKISLM.STOK_ISLEMA_NO

ALSADETA.ALISSATIS_DETAY_NO
→ STOKISLM.ALISSATIS_DETAY_NO

STOKKART.STOK_NO
→ ALSADETA.STOK_NO

STOKKART.STOK_NO
→ STOKISLM.STOK_NO

## Sipariş Yaşam Döngüsü

Mantıksal ilişki:

CARIKART
↓
ALSAASIL
↓
ALSADETA
↓
STOKISLM

ve:

ALSAASIL
↓
STOKASIL
↓
STOKISLM

Bu yapı sipariş → sevkiyat ilişkisinde kullanılacaktır.

## Teklif → Sipariş

Araştırılacak ilişkiler:

ALSAASIL.REFERANS_ALISSATIS_NO

ALSADETA.REFERANS_ALISSATIS_DETAY_NO

Tekliften sipariş dönüşümündeki gerçek davranış doğrulandıktan sonra ilişki kesinleştirilmelidir.

## B2B → Netsim İlişkileri

Örneğin:

B2B_USER.netsim_cari_no
→ CARIKART.CARI_NO

B2B_CART_ITEM.stok_no
→ STOKKART.STOK_NO

B2B_ORDER_CANCEL_REQUEST.alissatis_no
→ ALSAASIL.ALISSATIS_NO

## İlişki Güven Seviyesi

Her ilişki aşağıdaki şekilde işaretlenebilir:

✅ Confirmed
Firebird FK veya gerçek kayıtlarla doğrulandı.

🟡 Logical
Alan isimleri ve kayıtlar güçlü ilişki gösteriyor fakat FK doğrulanmadı.

🔴 Hypothesis
Henüz araştırılıyor.

## Cardinality

İleride:
1:1
1:N
N:M

ilişkiler eklenmelidir.

## Diagram

İleride Mermaid ER diagram kullanılabilir.

Örneğin:

erDiagram
  CARIKART ||--o{ ALSAASIL : has
  ALSAASIL ||--o{ ALSADETA : contains
-->