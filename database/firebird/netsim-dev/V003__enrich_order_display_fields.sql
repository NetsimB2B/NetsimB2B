-- Yalnızca netsim-dev mock veritabanında çalıştırın (bkz. netsim-dev/README.md).
--
-- Siparişlerim ekranını veritabanına bağlarken V002'dekiyle aynı durum: DURUM,
-- REFERANS_NO, YETKILI_ADI, ODEME_BILGISI, DT_NAKLIYE_SEKLI, ACIKLAMA_TEXT ve
-- REFERANS_ALISSATIS_NO (siparişin kaynak teklifine bağlantısı) alanları şemada var ama
-- V001 seed'inde boş bırakılmıştı. Bu script bunları eski frontend mock'undaki
-- (mocks/portalData.ts → seedOrders) karşılık gelen değerlerle dolduruyor.
--
-- NOT: Mock'taki "B2B-2026-0988" siparişinin netsim-dev'de karşılığı YOK (V001 seed'i
-- yalnızca 3 sipariş üretti — bkz. netsim-dev/README.md "İçerik özeti"). Bu, veriyi
-- veritabanına taşırken beklenen bir küçülmedir: kurgusal/fazladan mock kaydı, gerçek
-- kaynağı olmadığı için bağlı görünümde artık yer almıyor.

UPDATE NS_ALSAASIL SET
    DURUM = 'Sevk Edildi',
    REFERANS_NO = 'SAS-2026-184',
    YETKILI_ADI = 'Selin Yılmaz',
    ODEME_BILGISI = '30 Gün Vadeli',
    DT_NAKLIYE_SEKLI = 'Netsim Lojistik',
    ACIKLAMA_TEXT = 'Mal kabul hafta içi 09.00-16.00 arasındadır.',
    REFERANS_ALISSATIS_NO = 1
WHERE ALISSATIS_NO = 4;

UPDATE NS_ALSAASIL SET
    DURUM = 'Sevk Edildi',
    REFERANS_NO = 'SAS-2026-172',
    YETKILI_ADI = 'Selin Yılmaz',
    ODEME_BILGISI = 'Havale / EFT',
    DT_NAKLIYE_SEKLI = 'Müşteri Aracı'
WHERE ALISSATIS_NO = 5;

UPDATE NS_ALSAASIL SET
    DURUM = 'Hazırlanıyor',
    REFERANS_NO = 'PO-45871',
    YETKILI_ADI = 'Emre Kaya',
    ODEME_BILGISI = 'Peşin',
    DT_NAKLIYE_SEKLI = 'Netsim Lojistik',
    REFERANS_ALISSATIS_NO = 3
WHERE ALISSATIS_NO = 6;

-- NOT: netsim_seed_gen.py bu alanları henüz üretmiyor — veritabanı sıfırdan kurulursa
-- bu script V001'den sonra tekrar çalıştırılmalıdır (bkz. V002'deki aynı not).
