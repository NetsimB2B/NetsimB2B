-- Yalnızca netsim-dev mock veritabanında çalıştırın (bkz. netsim-dev/README.md).
--
-- Faturalar ekranını veritabanına bağlarken V002/V003'teki aynı durum: ACIKLAMA,
-- ODEME_BILGISI, BAKIYE ve REFERANS_ALISSATIS_NO (faturanın kaynak siparişine bağlantısı)
-- alanları şemada var ama V001 seed'inde boş bırakılmıştı. Bu script bunları eski
-- frontend mock'undaki (mocks/portalData.ts → invoices) karşılık gelen değerlerle
-- dolduruyor. BAKIYE, GENEL_TOPLAM'dan kalan borcu temsil eder; ödeme durumu
-- (Ödendi/Açık/Vadesi Geçti) NetsimInvoiceReadService'te BAKIYE ve VADE_TARIHI'nden
-- canlı hesaplanıyor — Teklifler'deki "Geçerli"/"Süresi Doldu" durumuyla aynı yaklaşım
-- (bkz. NetsimQuoteReadService.cs).
--
-- NOT: Mock'taki "B2B-2026-0988" siparişinin netsim-dev'de karşılığı olmadığından
-- (bkz. V003 notu), o siparişe bağlı FTR-2026-1431 faturası REFERANS_ALISSATIS_NO'suz
-- kalıyor (bağlı görünümde "Manuel fatura" gibi gösterilir).
--
-- E-fatura UUID için gerçek şemada karşılık gelen bir alan bulunamadı (ALSAASIL'in tüm
-- alanları tarandı) — mock'taki eInvoiceUuid bu yüzden veritabanına taşınmadı, frontend'de
-- opsiyonel kaldı (Product.featured'ın kaldırılmasıyla aynı gerekçe — bkz.
-- docs/implementation-status.md → Hızlı Sipariş notu).

UPDATE NS_ALSAASIL SET
    ACIKLAMA = 'Motor ve rulman siparişi satış faturası',
    ODEME_BILGISI = '30 Gün Vadeli',
    BAKIYE = 54060,
    REFERANS_ALISSATIS_NO = 4
WHERE ALISSATIS_NO = 7;

UPDATE NS_ALSAASIL SET
    ACIKLAMA = 'Bakım malzemeleri satış faturası',
    ODEME_BILGISI = '14 Gün Vadeli',
    BAKIYE = 13100
WHERE ALISSATIS_NO = 8;

UPDATE NS_ALSAASIL SET
    ACIKLAMA = 'Panel siparişi satış faturası',
    ODEME_BILGISI = 'Havale / EFT',
    BAKIYE = 0,
    REFERANS_ALISSATIS_NO = 5
WHERE ALISSATIS_NO = 9;

UPDATE NS_ALSAASIL SET
    ACIKLAMA = 'Pompa yenileme satış faturası',
    ODEME_BILGISI = 'Peşin',
    BAKIYE = 36570,
    REFERANS_ALISSATIS_NO = 6
WHERE ALISSATIS_NO = 10;

-- NOT: netsim_seed_gen.py bu alanları henüz üretmiyor — veritabanı sıfırdan kurulursa
-- bu script V001'den sonra tekrar çalıştırılmalıdır (bkz. V002/V003'teki aynı not).
