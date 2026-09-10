-- Yalnızca netsim-dev mock veritabanında çalıştırın (bkz. netsim-dev/README.md).
--
-- V001 seed'i NS_ALSAASIL/NS_ALSADETA'yı yalnızca zorunlu/temel alanlarla doldurmuştu.
-- Teklifler ekranını (frontend/src/features/quotes) veritabanına bağlarken şu alanların
-- GERÇEKTEN şemada var olduğu ama seed'de boş bırakıldığı görüldü: REFERANS_NO, ACIKLAMA
-- (teklif başlığı için kullanılabilir — ALSAASIL'de ayrı bir "başlık" alanı yok),
-- YETKILI_ADI, ODEME_BILGISI, DT_NAKLIYE_SEKLI, ACIKLAMA_TEXT (uzun not) ve
-- ALSADETA.TANIMLI_LISTE_FIYATI (indirim öncesi liste fiyatı). Bu script bu alanları,
-- eski frontend mock'undaki (mocks/portalData.ts) karşılık gelen değerlerle dolduruyor —
-- veri uydurulmuyor, yalnızca önceden boş bırakılmış gerçek kolonlar dolduruluyor.

UPDATE NS_ALSAASIL SET
    REFERANS_NO = 'RFQ-2026-0087',
    ACIKLAMA = 'Motor ve sürücü paketi',
    YETKILI_ADI = 'Selin Yılmaz',
    ODEME_BILGISI = '30 Gün Vadeli',
    DT_NAKLIYE_SEKLI = 'Stoktan 2-3 iş günü',
    ACIKLAMA_TEXT = 'Fiyatlara KDV dahil değildir. Sevkiyat tek parti olarak planlanmıştır.'
WHERE ALISSATIS_NO = 1;

UPDATE NS_ALSAASIL SET
    REFERANS_NO = 'RFQ-2026-0061',
    ACIKLAMA = 'Bakım dönemi rulmanları',
    YETKILI_ADI = 'Selin Yılmaz',
    ODEME_BILGISI = 'Havale / EFT',
    DT_NAKLIYE_SEKLI = 'Stoktan 1-2 iş günü',
    ACIKLAMA_TEXT = 'Toplu alım fiyatıdır.'
WHERE ALISSATIS_NO = 2;

UPDATE NS_ALSAASIL SET
    REFERANS_NO = 'RFQ-2026-0129',
    ACIKLAMA = 'Pompa yenileme teklifi',
    YETKILI_ADI = 'Emre Kaya',
    ODEME_BILGISI = 'Peşin',
    DT_NAKLIYE_SEKLI = '3-5 iş günü'
WHERE ALISSATIS_NO = 3;

UPDATE NS_ALSADETA SET TANIMLI_LISTE_FIYATI = 12450.0 WHERE ALISSATIS_DETAY_NO = 1;
UPDATE NS_ALSADETA SET TANIMLI_LISTE_FIYATI = 14320.0 WHERE ALISSATIS_DETAY_NO = 2;
UPDATE NS_ALSADETA SET TANIMLI_LISTE_FIYATI = 385.0   WHERE ALISSATIS_DETAY_NO = 3;
UPDATE NS_ALSADETA SET TANIMLI_LISTE_FIYATI = 30475.0 WHERE ALISSATIS_DETAY_NO = 4;

-- NOT: netsim_seed_gen.py bu alanları henüz üretmiyor (yalnızca bu script ile dolduruldu) —
-- veritabanı sıfırdan kurulursa bu script V001'den sonra tekrar çalıştırılmalıdır. İleride
-- generator'a eklenmesi düşünülebilir.
