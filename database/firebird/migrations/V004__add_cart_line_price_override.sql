/* Yalnızca B2B veritabanında çalıştırın (bkz. V001__create_b2b_schema.sql notu). */

/* Teklif kabulünde sepete aktarılan anlaşmalı birim fiyatı (KDV hariç) ve kaynak teklif
   referansını saklamak için. Ürün fiyatı normalde sepette YENİDEN hesaplanır (bkz.
   docs/03-modules/ürünler.md madde 28) — bu iki alan yalnızca teklif kaynaklı satırlarda
   dolu olur, genel ürün ekleme akışında NULL kalır. */
ALTER TABLE B2B_CART_LINES ADD UNIT_PRICE DECIMAL(18, 4);
ALTER TABLE B2B_CART_LINES ADD QUOTE_ID VARCHAR(24);
