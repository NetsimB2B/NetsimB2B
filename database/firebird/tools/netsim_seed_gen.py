"""Generates deterministic, realistic Turkish demo data for the netsim-dev subset.

Output: database/firebird/netsim-dev/V001__netsim_dev_seed.sql

Design:
  - Only columns with real business meaning are supplied by hand, per row,
    as a dict. Every NOT NULL column NOT present in that dict is filled
    automatically with a type-appropriate neutral value (see `neutral_default`).
  - Guard: any hand-supplied column name that does not exist on the table
    raises KeyError immediately (no silently-invented columns).
  - random.seed(SEED) keeps output byte-identical across runs.

CARI_NO 1001/1002/1003 are chosen to match frontend/src/mocks/portalData.ts
and frontend/src/features/company-context/store.ts (activeCariNo default).
"""
from __future__ import annotations

import random
from pathlib import Path

from netsim_ddl_gen import quote_ident
from netsim_schema_parser import Field, NetsimObject, parse_objects

SCHEMA_DOC = Path(__file__).resolve().parents[3] / "docs" / "04-data" / "Netsim-Veritabani-Semasi.md"
OUTPUT_PATH = Path(__file__).resolve().parents[1] / "netsim-dev" / "V001__netsim_dev_seed.sql"
SEED = 42

TABLES_NEEDED = [
    "NS_FIRMALAR", "NS_CARIKART", "NS_CARIISLM", "NS_CARIKALI", "NS_STOKMARK",
    "NS_STOKURHA", "NS_BIRIMLER", "NS_STOKKART", "NS_STOKBIRI", "NS_STOKYERI",
    "NS_STOKKADE", "NS_FIYALIST", "NS_FIYADETA", "NS_ALSAASIL", "NS_ALSADETA",
    "NS_STOKASIL",
]

# ⚠️ VARSAYIM — Netsim'den doğrulanacak: gerçek işlem kodu değerlerini bilmiyoruz.
ISLEM_KODU = {"TEKLIF": "TEKLIF", "SIPARIS": "SIPARIS", "FATURA": "FATURA"}
ISLEM_ADI = {"TEKLIF": "Satış Teklifi", "SIPARIS": "Satış Siparişi", "FATURA": "Satış Faturası"}
# ⚠️ VARSAYIM: CARIISLM.ISLEM_KODU için cari hareket türü kodları — gerçek Netsim
# kurulumunda farklı olabilir (bkz. NS_ALSAASIL.ISLEM_KODU'ndaki aynı gerekçe).
CARI_ISLEM_KODU = {
    "Fatura": "FATURA", "Tahsilat": "TAHSILAT", "İade": "IADE",
    "Dekont": "DEKONT", "Çek": "CEK",
}
# ⚠️ VARSAYIM: satış yönünü ifade eden kod (1 = satış/çıkış).
ISLEM_YONU_SATIS = 1
# ⚠️ VARSAYIM: KDV oranı ve fiyat türü kodu — gerçek FTKDVORAN / FTFIYATTURU domain değerleri doğrulanmadı.
KDV_ORANI_PCT = 20
FIYAT_TURU_SATIS = "SATIS"


# ---------------------------------------------------------------------------
# Generic SQL rendering with NOT-NULL autofill + unknown-column guard
# ---------------------------------------------------------------------------

def sql_literal(value) -> str:
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, (int, float)):
        return repr(value)
    text = str(value).replace("'", "''")
    return f"'{text}'"


def neutral_default(f: Field):
    if f.sql_type in ("INTEGER", "BIGINT", "SMALLINT"):
        return 0
    if f.sql_type == "DOUBLE":
        return 0
    if f.sql_type in ("VARCHAR", "CHAR"):
        return ""
    if f.sql_type == "TIMESTAMP":
        return "2026-01-01 00:00:00"
    if f.sql_type == "DATE":
        return "2026-01-01"
    if f.sql_type == "TIME":
        return "00:00:00"
    if f.sql_type == "BOOLEAN":
        return False
    if f.sql_type == "BLOB(TEXT)":
        return ""
    raise NotImplementedError(
        f"{f.name}: NOT NULL {f.sql_type} için otomatik nötr değer tanımlı değil, elle verin."
    )


def render_insert(obj: NetsimObject, row: dict) -> str:
    fields_by_name = {f.name: f for f in obj.fields}
    unknown = set(row) - set(fields_by_name)
    if unknown:
        raise KeyError(f"{obj.name}: şemada olmayan kolon(lar) verildi: {sorted(unknown)}")

    columns: list[str] = []
    values: list[str] = []
    for f in obj.fields:
        if f.name in row:
            columns.append(f.name)
            values.append(sql_literal(row[f.name]))
        elif not f.nullable:
            columns.append(f.name)
            values.append(sql_literal(neutral_default(f)))
    col_sql = ", ".join(quote_ident(c) for c in columns)
    val_sql = ", ".join(values)
    return f"INSERT INTO {obj.name} ({col_sql}) VALUES ({val_sql});"


def render_table_rows(obj: NetsimObject, rows: list[dict], comment: str) -> str:
    lines = [f"-- {obj.name}: {comment}"]
    for row in rows:
        lines.append(render_insert(obj, row))
    lines.append("")
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Demo data
# ---------------------------------------------------------------------------

BRANDS = [
    (1, "VOLTIX", "Voltix"),
    (2, "AQUAPRO", "AquaPro"),
    (3, "DRIVEMAX", "DriveMax"),
    (4, "SENSE", "Sense"),
    (5, "ROTA", "Rota"),
    (6, "FLOWPRO", "FlowPro"),
    (7, "ENERCAB", "Enercab"),
    (8, "PANELPRO", "PanelPro"),
    (9, "HYDRA", "Hydra"),
    (10, "ISOTEK", "İzoTek"),
]
BRAND_NO = {kod: no for no, kod, _ in BRANDS}

CATEGORIES = [
    (1, "MOTORLAR", "Motorlar"),
    (2, "POMPALAR", "Pompalar"),
    (3, "REDUKTORLER", "Redüktörler"),
    (4, "OTOMASYON", "Otomasyon"),
    (5, "RULMANLAR", "Rulmanlar"),
    (6, "VANALAR", "Vanalar"),
    (7, "ELEKTRIK", "Elektrik"),
    (8, "HIDROLIK", "Hidrolik"),
]
CATEGORY_NO = {kod: no for no, kod, _ in CATEGORIES}

UNITS = [
    (1, "AD", "Adet", "STANDART"),
    (2, "MT", "Metre", "STANDART"),
    (3, "KG", "Kilogram", "STANDART"),
    (4, "LT", "Litre", "STANDART"),
    (5, "KT", "Kutu", "STANDART"),
    (6, "TK", "Takım", "STANDART"),
]

WAREHOUSES = [
    (1, "DEPO-IST", "İstanbul Merkez Depo"),
    (2, "DEPO-BRS", "Bursa Depo"),
]

# 12 ürün doğrudan frontend/src/mocks/portalData.ts ile birebir eşleşir
# (STOK_KODU, STOK_ADI, marka, kategori, birim, fiyat, toplam stok).
BASE_PRODUCTS = [
    (1, "MTR-001", "Trifaze Elektrik Motoru 2.2 kW", "MOTORLAR", "VOLTIX", "AD", 12_450, 125,
     "Yüksek verimli, IP55 koruma sınıflı endüstriyel motor."),
    (2, "MTR-002", "Trifaze Elektrik Motoru 4 kW", "MOTORLAR", "VOLTIX", "AD", 18_900, 34,
     "Ağır çalışma koşullarına uygun 1500 devir motor."),
    (3, "PMP-010", "Paslanmaz Santrifüj Pompa", "POMPALAR", "AQUAPRO", "AD", 28_750, 8,
     "Gıda ve kimya uygulamaları için paslanmaz gövdeli pompa."),
    (4, "RDM-025", "Sonsuz Vidalı Redüktör", "REDUKTORLER", "DRIVEMAX", "AD", 9_680, 52,
     "Kompakt gövde, yüksek çevrim oranı ve sessiz çalışma."),
    (5, "SNS-100", "Endüktif Yaklaşım Sensörü", "OTOMASYON", "SENSE", "AD", 1_245, 240,
     "M18 gövde, 8 mm algılama mesafesi, PNP çıkış."),
    (6, "DRV-220", "Motor Sürücü 2.2 kW", "OTOMASYON", "DRIVEMAX", "AD", 14_320, 19,
     "Vektör kontrollü kompakt hız kontrol cihazı."),
    (7, "BRG-6205", "Rulman 6205 2RS", "RULMANLAR", "ROTA", "AD", 385, 520,
     "Çift tarafı keçeli, uzun ömürlü sabit bilyalı rulman."),
    (8, "VLV-050", "Paslanmaz Küresel Vana 2 inç", "VANALAR", "FLOWPRO", "AD", 3_940, 0,
     "Tam geçişli, üç parçalı paslanmaz küresel vana."),
    (9, "CBL-4X4", "Kumanda Kablosu 4x4 mm²", "ELEKTRIK", "ENERCAB", "MT", 142.5, 2_400,
     "Esnek bakır iletkenli endüstriyel kumanda kablosu."),
    (10, "PNL-060", "Elektrik Panosu 60x80", "ELEKTRIK", "PANELPRO", "AD", 6_750, 11,
     "IP65 korumalı, montaj plakalı metal pano."),
    (11, "FLT-025", "Hat Tipi Basınç Filtresi", "HIDROLIK", "HYDRA", "AD", 5_480, 26,
     "25 mikron filtreleme, 250 bar çalışma basıncı."),
    (12, "CYL-080", "Hidrolik Silindir 80/45", "HIDROLIK", "HYDRA", "AD", 16_850, 6,
     "Çift etkili, honlanmış borulu standart hidrolik silindir."),
]

EXTRA_NAME_TEMPLATES = {
    "MOTORLAR": ("Trifaze Elektrik Motoru", ["0.75 kW", "1.5 kW", "5.5 kW", "7.5 kW", "11 kW"]),
    "POMPALAR": ("Santrifüj Pompa", ["Tek Kademeli", "Çok Kademeli", "Dalgıç Tip", "Bulanık Su Tipi"]),
    "REDUKTORLER": ("Redüktör", ["Helisel Tip", "Paralel Şaft", "Açılı Tip"]),
    "OTOMASYON": ("Otomasyon Bileşeni", ["Fotosel Sensör", "PLC Genişleme Modülü", "Buton Kutusu", "Acil Stop Şalteri"]),
    "RULMANLAR": ("Rulman", ["6206 2RS", "6305 ZZ", "6308 2RS", "Konik Makara"]),
    "VANALAR": ("Vana", ["Çek Vana 1 inç", "Kelebek Vana 3 inç", "Çamur Vanası 2 inç", "Basınç Düşürücü Vana"]),
    "ELEKTRIK": ("Elektrik Malzemesi", ["Kontaktör 25A", "Termik Röle 16A", "Otomat Sigorta 32A", "Kablo Kanalı 40x60"]),
    "HIDROLIK": ("Hidrolik Ekipman", ["Dişli Pompa", "Yön Kontrol Valfi", "Hortum Seti 3/4", "Hidrolik Depo 100L"]),
}

CATEGORY_UNIT = {
    "MOTORLAR": "AD", "POMPALAR": "AD", "REDUKTORLER": "AD", "OTOMASYON": "AD",
    "RULMANLAR": "AD", "VANALAR": "AD", "ELEKTRIK": "AD", "HIDROLIK": "AD",
}
CATEGORY_BRANDS = {
    "MOTORLAR": ["VOLTIX", "DRIVEMAX"], "POMPALAR": ["AQUAPRO", "HYDRA"],
    "REDUKTORLER": ["DRIVEMAX"], "OTOMASYON": ["SENSE", "DRIVEMAX"],
    "RULMANLAR": ["ROTA"], "VANALAR": ["FLOWPRO"],
    "ELEKTRIK": ["ENERCAB", "PANELPRO", "ISOTEK"], "HIDROLIK": ["HYDRA"],
}


def build_products(count: int) -> list[dict]:
    products = []
    for stok_no, kodu, adi, kategori, marka, birim, fiyat, stok_toplam, aciklama in BASE_PRODUCTS:
        products.append({
            "stok_no": stok_no, "kodu": kodu, "adi": adi, "kategori": kategori,
            "marka": marka, "birim": birim, "fiyat": fiyat, "stok_toplam": stok_toplam,
            "aciklama": aciklama,
        })
    rng = random.Random(SEED)
    categories_cycle = list(EXTRA_NAME_TEMPLATES)
    next_no = len(BASE_PRODUCTS) + 1
    seq = {cat: 1 for cat in categories_cycle}
    while len(products) < count:
        cat = categories_cycle[(next_no - len(BASE_PRODUCTS) - 1) % len(categories_cycle)]
        base_name, variants = EXTRA_NAME_TEMPLATES[cat]
        variant = variants[seq[cat] % len(variants)]
        seq[cat] += 1
        kodu = f"{cat[:3]}-{100 + seq[cat]:03d}"
        adi = f"{base_name} {variant}"
        marka = rng.choice(CATEGORY_BRANDS[cat])
        birim = CATEGORY_UNIT[cat]
        fiyat = round(rng.uniform(250, 22_000), 2)
        stok_toplam = 0 if rng.random() < 0.12 else rng.randint(1, 400)
        products.append({
            "stok_no": next_no, "kodu": kodu, "adi": adi, "kategori": cat,
            "marka": marka, "birim": birim, "fiyat": fiyat, "stok_toplam": stok_toplam,
            "aciklama": f"{adi} — Netsim B2B geliştirme ortamı için üretilmiş demo ürün kaydı.",
        })
        next_no += 1
    return products


PRODUCTS = build_products(50)

BAYILER = [
    {"cari_no": 1001, "cari_kodu": "CR-1001", "cari_adi": "Örnek Bayi A.Ş.", "email": "info@ornekbayi-dev.local",
     "fiyat_carpani": 1.00, "fiyat_no": 1},
    {"cari_no": 1002, "cari_kodu": "CR-1002", "cari_adi": "Marmara Endüstri Ltd.", "email": "info@marmaraendustri-dev.local",
     "fiyat_carpani": 0.95, "fiyat_no": 2},
    {"cari_no": 1003, "cari_kodu": "CR-1003", "cari_adi": "Ege Sanayi Malzemeleri Ltd. Şti.", "email": "info@egesanayi-dev.local",
     "fiyat_carpani": 1.05, "fiyat_no": 3},
]


def gen_firmalar_rows() -> list[dict]:
    return [{
        "FIRMA_NO": 1, "FIRMA_KODU": "NETSIM", "FIRMA_ADI": "Netsim Endüstriyel Ürünler A.Ş.",
        "FIRMA_RESMI_UNVANI": "Netsim Endüstriyel Ürünler Anonim Şirketi", "FIRMA_KISA_ADI": "Netsim",
        "MUKELLEF_TIPI": "TUZEL", "EMAIL": "info@netsim-b2b-dev.local",
        "VERGI_DAIRESI": "Kadıköy", "VERGI_NO": "1234567890", "KAYIT_DURUMU": "A",
    }]


# Sevkiyat taşıyıcısı da Netsim'de bir cari kayıttır (STOKASIL.SEVK_NAKLIYECI_FIRMA_NO
# CARIKART'a referans verir) — bayilerden ayırt etmek için MUHASEBE_CARI_TURU='TEDARIKCI'
# kullanıldı (⚠️ VARSAYIM, gerçek domain değeri doğrulanmadı). Bkz. gen_stokasil_rows.
TASIYICI_CARI_NO = 9001

CARRIERS = [
    {"cari_no": TASIYICI_CARI_NO, "cari_kodu": "CR-9001-LOJ", "cari_adi": "Netsim Lojistik",
     "email": "info@netsim-lojistik-dev.local"},
]


def gen_carikart_rows() -> list[dict]:
    rows = []
    for b in BAYILER:
        rows.append({
            "CARI_NO": b["cari_no"], "CARI_KODU": b["cari_kodu"], "CARI_ADI": b["cari_adi"],
            "MUHASEBE_CARI_TURU": "BAYI", "BLOKE": "H", "KAYIT_DURUMU": "A",
            "KREDILI_ISLEM": "E", "EMAIL": b["email"], "VERGI_DAIRESI": "Merkez",
            "VERGI_NO": str(1_000_000_000 + b["cari_no"]), "BAYI_TURU": "BAYI",
        })
    for c in CARRIERS:
        rows.append({
            "CARI_NO": c["cari_no"], "CARI_KODU": c["cari_kodu"], "CARI_ADI": c["cari_adi"],
            "MUHASEBE_CARI_TURU": "TEDARIKCI", "BLOKE": "H", "KAYIT_DURUMU": "A",
            "KREDILI_ISLEM": "H", "EMAIL": c["email"], "VERGI_DAIRESI": "Merkez",
            "VERGI_NO": str(1_000_000_000 + c["cari_no"]),
        })
    return rows


# Cari hareket/ekstre: eski frontend mock'undaki (mocks/portalData.ts ->
# accountTransactions) değerlerle birebir aynı — bkz. netsim-dev/README.md
# V004 notundaki aynı yaklaşım (Faturalar). REFERANS_ALISSATIS_NO, DOCUMENTS
# listesindeki karşılık gelen FATURA kaydına işaret eder (kaynağı olmayanlar
# NULL bırakılır — "B2B-2026-0988" ve "FTR-2026-1490" gibi mock'ta var ama
# netsim-dev'de karşılığı olmayan kayıtlarla aynı durum).
CARI_HAREKETLER = [
    {"no": 1, "cari_no": 1001, "tarih": "2026-09-08", "vade": "2026-10-08",
     "belge_no": "FTR-2026-1482", "tur": "Fatura", "borc": 54_060, "alacak": 0,
     "bakiye": 184_250, "durum": "Açık",
     "aciklama": "Satış faturası · Motor ve rulman · B2B-2026-1002", "referans_alissatis_no": 7},
    {"no": 2, "cari_no": 1001, "tarih": "2026-09-02", "vade": None,
     "belge_no": "THS-2026-0841", "tur": "Tahsilat", "borc": 0, "alacak": 50_000,
     "bakiye": 130_190, "durum": "Kapalı", "aciklama": "Havale tahsilatı · Garanti BBVA"},
    {"no": 3, "cari_no": 1001, "tarih": "2026-08-24", "vade": "2026-09-07",
     "belge_no": "FTR-2026-1431", "tur": "Fatura", "borc": 23_100, "alacak": 0,
     "bakiye": 180_190, "durum": "Vadesi Geçti",
     "aciklama": "Satış faturası · Bakım malzemeleri · B2B-2026-0988", "referans_alissatis_no": 8},
    {"no": 4, "cari_no": 1001, "tarih": "2026-08-18", "vade": None,
     "belge_no": "THS-2026-0795", "tur": "Tahsilat", "borc": 0, "alacak": 10_000,
     "bakiye": 157_090, "durum": "Kısmi", "aciklama": "Kısmi tahsilat · FTR-2026-1431",
     "referans_alissatis_no": 8},
    {"no": 5, "cari_no": 1001, "tarih": "2026-09-04", "vade": "2026-10-04",
     "belge_no": "FTR-2026-1398", "tur": "Fatura", "borc": 23_232, "alacak": 0,
     "bakiye": 167_090, "durum": "Kapalı",
     "aciklama": "Satış faturası · Redüktör · B2B-2026-1001", "referans_alissatis_no": 9},
    {"no": 6, "cari_no": 1001, "tarih": "2026-09-05", "vade": None,
     "belge_no": "THS-2026-0750", "tur": "Tahsilat", "borc": 0, "alacak": 23_232,
     "bakiye": 143_858, "durum": "Kapalı", "aciklama": "Havale tahsilatı · FTR-2026-1398",
     "referans_alissatis_no": 9},
    {"no": 7, "cari_no": 1001, "tarih": "2026-08-05", "vade": None,
     "belge_no": "DKN-2026-0122", "tur": "Dekont", "borc": 850, "alacak": 0,
     "bakiye": 167_090, "durum": "Kapalı", "aciklama": "Kur farkı düzeltme dekontu"},
    {"no": 8, "cari_no": 1001, "tarih": "2026-07-28", "vade": None,
     "belge_no": "IADE-2026-0041", "tur": "İade", "borc": 0, "alacak": 4_200,
     "bakiye": 166_240, "durum": "Kapalı", "aciklama": "Ürün iade alacak fişi"},
    {"no": 9, "cari_no": 1002, "tarih": "2026-09-07", "vade": "2026-10-07",
     "belge_no": "FTR-2026-1520", "tur": "Fatura", "borc": 36_570, "alacak": 0,
     "bakiye": 92_800, "durum": "Açık",
     "aciklama": "Satış faturası · Pompa yenileme · B2B-2026-2001", "referans_alissatis_no": 10},
    {"no": 10, "cari_no": 1002, "tarih": "2026-09-01", "vade": None,
     "belge_no": "THS-2026-0812", "tur": "Tahsilat", "borc": 0, "alacak": 20_000,
     "bakiye": 56_230, "durum": "Kapalı", "aciklama": "Havale tahsilatı · İş Bankası"},
    {"no": 11, "cari_no": 1002, "tarih": "2026-08-20", "vade": "2026-09-04",
     "belge_no": "FTR-2026-1490", "tur": "Fatura", "borc": 14_350, "alacak": 0,
     "bakiye": 76_230, "durum": "Vadesi Geçti", "aciklama": "Satış faturası · Hidrolik parçalar"},
    {"no": 12, "cari_no": 1002, "tarih": "2026-08-10", "vade": None,
     "belge_no": "CEK-2026-0088", "tur": "Çek", "borc": 0, "alacak": 25_000,
     "bakiye": 61_880, "durum": "Kapalı", "aciklama": "Müşteri çeki tahsilatı"},
]


def gen_cariislm_rows() -> list[dict]:
    rows = []
    for h in CARI_HAREKETLER:
        row = {
            "CARI_ISLEM_NO": h["no"], "CARI_NO": h["cari_no"], "TARIH": f"{h['tarih']} 00:00:00",
            "BELGE_NO": h["belge_no"], "ISLEM_KODU": CARI_ISLEM_KODU[h["tur"]],
            "ISLEM_ADI": h["tur"], "BORC": float(h["borc"]), "ALACAK": float(h["alacak"]),
            "BAKIYE": float(h["bakiye"]), "GENEL_BAKIYE": float(h["bakiye"]),
            "DURUM": h["durum"], "ACIKLAMA": h["aciklama"], "DOVIZ_BIRIMI": "TRY",
            "KAYIT_DURUMU": "A",
        }
        if h["vade"]:
            row["VADE_TARIHI"] = h["vade"]
        if h.get("referans_alissatis_no"):
            row["REFERANS_ALISSATIS_NO"] = h["referans_alissatis_no"]
        rows.append(row)
    return rows


# Kredi limiti: BLOKE_MAX (tavan) - TOPLAM_RISK (güncel bakiye) = kullanılabilir limit.
# Değerler eski frontend mock'undaki (mocks/portalData.ts -> accounts) balance/
# availableCredit ile tutarlı (limit = balance + availableCredit). CARI_NO 1003 için
# mock'ta karşılık yoktu (bkz. netsim-dev/README.md) — FIYALIST'teki 3. bayi fiyat
# çarpanıyla aynı gerekçeyle makul bir profil verildi, gerçek bir kaynağı yok.
# ⚠️ VARSAYIM: LIMIT_TURU domain değeri doğrulanmadı, "GENEL" kullanıldı.
CARI_LIMITLER = [
    {"cari_no": 1001, "bloke_max": 500_000, "toplam_risk": 184_250},
    {"cari_no": 1002, "bloke_max": 200_000, "toplam_risk": 92_800},
    {"cari_no": 1003, "bloke_max": 350_000, "toplam_risk": 0},
]


def gen_carikali_rows() -> list[dict]:
    return [{
        "CARI_KART_LIMIT_NO": i, "CARI_NO": c["cari_no"], "FIRMA_NO": 1,
        "LIMIT_TURU": "GENEL", "BLOKE_MAX": float(c["bloke_max"]),
        "TOPLAM_RISK": float(c["toplam_risk"]), "TOPLAM": float(c["toplam_risk"]),
        "GUNCELLEME_TARIHI": "2026-09-08 00:00:00",
    } for i, c in enumerate(CARI_LIMITLER, start=1)]


def gen_stokmark_rows() -> list[dict]:
    return [{"MARKA_NO": no, "MARKA_KODU": kod, "MARKA_ADI": adi, "KAYIT_DURUMU": "A", "WEB_AKTIF": "E"}
            for no, kod, adi in BRANDS]


def gen_stokurha_rows() -> list[dict]:
    return [{"URUN_HATTI_NO": no, "URUN_HATTI_KODU": kod, "URUN_HATTI_ADI": adi, "KAYIT_DURUMU": "A"}
            for no, kod, adi in CATEGORIES]


def gen_birimler_rows() -> list[dict]:
    return [{"BIRIM_NO": no, "SINIFI": sinifi, "SIRA_NO": no, "BIRIM_ADI": adi, "BIRIM": kod,
             "BIRIMX": 1.0, "KAYIT_DURUMU": "A"}
            for no, kod, adi, sinifi in UNITS]


def gen_stokbiri_rows() -> list[dict]:
    # ⚠️ VARSAYIM: SIRA_NO=1 "ana/birincil birim" satırını işaret ediyor.
    # NetsimProductReadService bu satırı STOK_NO + SIRA_NO=1 ile bulur (Netsim'de doğrulanmalı).
    return [{
        "STOK_BIRIM_NO": p["stok_no"], "STOK_NO": p["stok_no"], "SIRA_NO": 1,
        "BIRIM": p["birim"], "BIRIMX": 1.0, "KAYIT_DURUMU": "A",
    } for p in PRODUCTS]


def gen_stokyeri_rows() -> list[dict]:
    return [{"STOK_YERI_NO": no, "STOK_YERI_KODU": kod, "STOK_YERI_ADI": adi, "SINIFI": "DEPO", "KAYIT_DURUMU": "A"}
            for no, kod, adi in WAREHOUSES]


def gen_stokkart_rows() -> list[dict]:
    rows = []
    for p in PRODUCTS:
        rows.append({
            "STOK_NO": p["stok_no"], "STOK_KODU": p["kodu"], "STOK_ADI": p["adi"],
            "STOK_ADI_GENEL": p["adi"], "STOK_TIP_ADI": "Ticari Mal", "MUHASEBE_STOK_TURU": "TICARI_MAL",
            "MARKA_NO": BRAND_NO[p["marka"]], "URUN_HATTI_NO": CATEGORY_NO[p["kategori"]],
            "WEB_AKTIF": "E", "BLOKE": "H", "KAYIT_DURUMU": "A",
            "ACIKLAMA_HTML": f"<p>{p['aciklama']}</p>", "VARYANT_ZORUNLU": "H", "SATILABILIRLIK": "E",
            "BIRIM1": p["birim"],
        })
    return rows


def gen_stokkade_rows() -> list[dict]:
    rows = []
    detay_no = 1
    rng = random.Random(SEED + 1)
    for p in PRODUCTS:
        toplam = p["stok_toplam"]
        if toplam == 0:
            split = (0, 0)
        else:
            ist_share = rng.uniform(0.55, 1.0)
            ist_qty = round(toplam * ist_share)
            split = (ist_qty, toplam - ist_qty)
        for stok_yeri_no, miktar in zip((1, 2), split):
            rows.append({
                "STOK_DETAY_NO": detay_no, "STOK_NO": p["stok_no"], "STOK_ADI": p["adi"],
                "BIRIM": p["birim"], "MIKTAR": float(miktar), "STOK_YERI_NO": stok_yeri_no,
                "STOK_TIP_ADI": "Ticari Mal",
            })
            detay_no += 1
    return rows


def gen_fiyalist_rows() -> list[dict]:
    rows = []
    for b in BAYILER:
        rows.append({
            "FIYAT_NO": b["fiyat_no"], "FIYAT_KODU": f"FL-{b['cari_no']}",
            "FIYAT_ADI": f"{b['cari_adi']} Fiyat Listesi", "GRUBU": "BAYI",
            "BASLAMA_TARIHI": "2026-01-01 00:00:00", "KAYIT_DURUMU": "A",
            "CARI_KODU": b["cari_kodu"], "DOVIZ_BIRIMI": "TRY", "ONCELIK": 10,
        })
    return rows


def gen_fiyadeta_rows() -> list[dict]:
    rows = []
    detay_no = 1
    for b in BAYILER:
        for p in PRODUCTS:
            rows.append({
                "FIYAT_DETAY_NO": detay_no, "FIYAT_NO": b["fiyat_no"], "STOK_NO": p["stok_no"],
                "BIRIM": p["birim"], "LISTE_FIYATI": round(p["fiyat"] * b["fiyat_carpani"], 2),
                "DOVIZ_BIRIMI": "TRY", "CARI_KODU": b["cari_kodu"], "TURU": FIYAT_TURU_SATIS,
                "KDV": str(KDV_ORANI_PCT), "ONCELIK": 10, "KAYIT_DURUMU": "A",
            })
            detay_no += 1
    return rows


# Teklif/sipariş/fatura: frontend/src/mocks/portalData.ts ile birebir tutarlı.
DOCUMENTS = [
    {"tur": "TEKLIF", "no": 1, "cari_no": 1001, "belge_no": "TKL-2026-0142", "tarih": "2026-09-05",
     "vade": "2026-09-30",
     "lines": [(1, 5, 12_000.0), (6, 5, 13_480.0)]},
    {"tur": "TEKLIF", "no": 2, "cari_no": 1001, "belge_no": "TKL-2026-0118", "tarih": "2026-08-18",
     "vade": "2026-08-31",
     "lines": [(7, 100, 365.0)]},
    {"tur": "TEKLIF", "no": 3, "cari_no": 1002, "belge_no": "TKL-2026-0204", "tarih": "2026-09-07",
     "vade": "2026-10-15",
     "lines": [(3, 2, 29_450.0)]},
    {"tur": "SIPARIS", "no": 4, "cari_no": 1001, "belge_no": "B2B-2026-1002", "tarih": "2026-09-08",
     "vade": "2026-09-11",
     "lines": [(1, 3, 12_450.0), (7, 20, 385.0)]},
    {"tur": "SIPARIS", "no": 5, "cari_no": 1001, "belge_no": "B2B-2026-1001", "tarih": "2026-09-04",
     "vade": "2026-09-07",
     "lines": [(4, 2, 9_680.0)]},
    {"tur": "SIPARIS", "no": 6, "cari_no": 1002, "belge_no": "B2B-2026-2001", "tarih": "2026-09-06",
     "vade": "2026-09-12",
     "lines": [(3, 1, 30_475.0)]},
    {"tur": "FATURA", "no": 7, "cari_no": 1001, "belge_no": "FTR-2026-1482", "tarih": "2026-09-05",
     "vade": "2026-10-05",
     "lines": [(1, 3, 12_450.0), (7, 20, 385.0)]},
    {"tur": "FATURA", "no": 8, "cari_no": 1001, "belge_no": "FTR-2026-1431", "tarih": "2026-08-24",
     "vade": "2026-09-07",
     "lines": [(2, 1, 23_958.33)]},
    {"tur": "FATURA", "no": 9, "cari_no": 1001, "belge_no": "FTR-2026-1398", "tarih": "2026-08-12",
     "vade": "2026-09-11",
     "lines": [(4, 2, 9_680.0)]},
    {"tur": "FATURA", "no": 10, "cari_no": 1002, "belge_no": "FTR-2026-1520", "tarih": "2026-09-07",
     "vade": "2026-10-07",
     "lines": [(3, 1, 30_475.0)]},
]


def gen_alsaasil_rows() -> list[dict]:
    rows = []
    for doc in DOCUMENTS:
        toplam_ham = sum(qty * price for _, qty, price in doc["lines"])
        toplam_kdv = round(toplam_ham * KDV_ORANI_PCT / 100, 2)
        rows.append({
            "ALISSATIS_NO": doc["no"], "ISLEM_KODU": ISLEM_KODU[doc["tur"]],
            "ISLEM_ADI": ISLEM_ADI[doc["tur"]], "ISLEM_YONU": ISLEM_YONU_SATIS,
            "CARI_NO": doc["cari_no"], "BELGE_NO": doc["belge_no"],
            "TARIH": f"{doc['tarih']} 00:00:00", "VADE_TARIHI": doc["vade"],
            "KUR_TARIHI": f"{doc['tarih']} 00:00:00",
            "TOPLAM_HAM_TUTAR": round(toplam_ham, 2), "TOPLAM_KDV_TUTARI": toplam_kdv,
            "GENEL_TOPLAM": round(toplam_ham + toplam_kdv, 2),
            "DOVIZ_BIRIMI": "TRY", "DOVIZ_KURU": 1.0, "KAYIT_DURUMU": "A",
        })
    return rows


def gen_alsadeta_rows() -> list[dict]:
    products_by_no = {p["stok_no"]: p for p in PRODUCTS}
    rows = []
    sira = 1
    detay_no = 1
    for doc in DOCUMENTS:
        for line_sira, (stok_no, qty, price) in enumerate(doc["lines"], start=1):
            p = products_by_no[stok_no]
            ham_tutar = round(qty * price, 2)
            kdv_tutari = round(ham_tutar * KDV_ORANI_PCT / 100, 2)
            rows.append({
                "ALISSATIS_DETAY_NO": detay_no, "ALISSATIS_NO": doc["no"],
                "ISLEM_KODU": ISLEM_KODU[doc["tur"]], "ISLEM_YONU": ISLEM_YONU_SATIS,
                "SIRA_NO": line_sira, "STOK_NO": stok_no, "STOK_ADI": p["adi"],
                "BIRIM": p["birim"], "BIRIMX": 1.0, "MIKTAR": float(qty),
                "BIRIM_FIYAT": price, "HAM_TUTAR": ham_tutar,
                "KDV_ORANI": float(KDV_ORANI_PCT), "KDV_TUTARI": kdv_tutari,
                "SATIR_INDIRIM_ORANI": 0.0, "DOVIZ_BIRIMI": "TRY", "DOVIZ_KURU": 1.0,
                "KAYIT_DURUMU": "A",
            })
            detay_no += 1
    return rows


# Sevkiyatlar: eski frontend mock'undaki (mocks/portalData.ts -> shipments) değerlerle
# birebir aynı — bkz. netsim-dev/README.md'deki aynı yaklaşım (Faturalar/Finans).
# STOK_ISLEMA_NO'nun ALISSATIS_NO'su (order_no), DOCUMENTS listesindeki ilgili SIPARIS
# kaydına işaret eder (self-join ile Siparişlerim'in BELGE_NO'sunu çözmek için).
# ⚠️ VARSAYIM: ISLEM_KODU='SEVKIYAT' — gerçek Netsim'de STOKASIL'in hangi ISLEM_KODU
# değeriyle "müşteriye sevkiyat" hareketini işaretlediği doğrulanmadı (STOKASIL genel bir
# stok hareket başlığı — üretim, transfer, sayım gibi başka hareket türlerini de tutuyor
# olabilir). KARGO_REFERANS_NO, TAKIP_NO yerine kargo takip numarası için kullanıldı
# (TAKIP_NO'nun ALSAASIL'de de var olan genel bir dahili takip alanı olduğu, kargo takip
# no'sundan farklı olabileceği düşünüldü — bu da doğrulanmadı).
# CIKIS_STOK_YERI_NO = 1 (İstanbul Merkez Depo) — mock'taki "Netsim İstanbul Merkez Depo"
# origin'iyle tutarlı. "Müşteri Aracı" (taşıyıcısız/kendi aracı) durumu için
# SEVK_NAKLIYECI_FIRMA_NO NULL bırakıldı — CARIKART'ta bu anlama gelen ayrı bir alan/kayıt
# yok, backend/frontend bunu "—" olarak gösteriyor (mock'taki "Müşteri Aracı" etiketi
# taşınmadı, gerçek bir kaynağı yoktu).
SHIPMENTS = [
    {"no": 1, "belge_no": "SVK-2026-0088", "order_no": 4, "cari_no": 1001,
     "tarih": "2026-09-08 13:40:00", "durum": "Yolda", "durum_tarihi": "2026-09-08 13:40:00",
     "kargo_referans_no": "NTS2609080088", "arac_plaka": "34 NTS 088", "arac_sofor": "Murat Demir",
     "tasiyici_no": TASIYICI_CARI_NO},
    {"no": 2, "belge_no": "SVK-2026-0081", "order_no": 5, "cari_no": 1001,
     "tarih": "2026-09-04 09:10:00", "durum": "Teslim Edildi", "durum_tarihi": "2026-09-04 14:28:00",
     "kargo_referans_no": "NTS2609040081", "arac_plaka": "34 BAY 142", "arac_sofor": "Ahmet Kaya",
     "tasiyici_no": None},
    {"no": 3, "belge_no": "SVK-2026-0094", "order_no": 6, "cari_no": 1002,
     "tarih": "2026-09-09 11:00:00", "durum": "Hazırlanıyor", "durum_tarihi": "2026-09-09 11:00:00",
     "kargo_referans_no": "NTS2609090094", "arac_plaka": None, "arac_sofor": None,
     "tasiyici_no": TASIYICI_CARI_NO},
]


def gen_stokasil_rows() -> list[dict]:
    rows = []
    for s in SHIPMENTS:
        row = {
            "STOK_ISLEMA_NO": s["no"], "ISLEM_KODU": "SEVKIYAT", "ISLEM_ADI": "Satış Sevkiyatı",
            "TARIH": s["tarih"], "ALISSATIS_NO": s["order_no"], "CARI_NO": s["cari_no"],
            "CIKIS_STOK_YERI_NO": 1, "DURUM": s["durum"], "DURUM_TARIHI": s["durum_tarihi"],
            "BELGE_NO": s["belge_no"], "KARGO_REFERANS_NO": s["kargo_referans_no"],
            "KAYIT_DURUMU": "A",
        }
        if s["arac_plaka"]:
            row["ARAC_PLAKA"] = s["arac_plaka"]
        if s["arac_sofor"]:
            row["ARAC_SOFOR"] = s["arac_sofor"]
        if s["tasiyici_no"]:
            row["SEVK_NAKLIYECI_FIRMA_NO"] = s["tasiyici_no"]
        rows.append(row)
    return rows


def generate() -> str:
    objects = parse_objects(SCHEMA_DOC, set(TABLES_NEEDED))
    missing = set(TABLES_NEEDED) - set(objects)
    if missing:
        raise RuntimeError(f"Şemada bulunamayan tablolar: {sorted(missing)}")

    parts = [
        "-- OTOMATIK ÜRETILDI: database/firebird/tools/netsim_seed_gen.py",
        "-- Deterministik demo veri (random.seed sabit). CARI_NO 1001/1002/1003",
        "-- frontend/src/mocks/portalData.ts ile eşleşir.",
        "",
    ]
    parts.append(render_table_rows(objects["NS_FIRMALAR"], gen_firmalar_rows(), "1 firma"))
    parts.append(render_table_rows(objects["NS_CARIKART"], gen_carikart_rows(), "3 bayi cari"))
    parts.append(render_table_rows(objects["NS_CARIISLM"], gen_cariislm_rows(), f"{len(CARI_HAREKETLER)} cari hareketi (ekstre)"))
    parts.append(render_table_rows(objects["NS_CARIKALI"], gen_carikali_rows(), f"{len(CARI_LIMITLER)} cari için kredi limiti"))
    parts.append(render_table_rows(objects["NS_STOKMARK"], gen_stokmark_rows(), f"{len(BRANDS)} marka"))
    parts.append(render_table_rows(objects["NS_STOKURHA"], gen_stokurha_rows(), f"{len(CATEGORIES)} ürün hattı"))
    parts.append(render_table_rows(objects["NS_BIRIMLER"], gen_birimler_rows(), f"{len(UNITS)} birim"))
    parts.append(render_table_rows(objects["NS_STOKYERI"], gen_stokyeri_rows(), f"{len(WAREHOUSES)} depo"))
    parts.append(render_table_rows(objects["NS_STOKKART"], gen_stokkart_rows(), f"{len(PRODUCTS)} ürün"))
    parts.append(render_table_rows(objects["NS_STOKBIRI"], gen_stokbiri_rows(), "ürün başına birincil birim (SIRA_NO=1)"))
    parts.append(render_table_rows(objects["NS_STOKKADE"], gen_stokkade_rows(), "depo bazlı stok miktarı"))
    parts.append(render_table_rows(objects["NS_FIYALIST"], gen_fiyalist_rows(), "bayi başına fiyat listesi"))
    parts.append(render_table_rows(objects["NS_FIYADETA"], gen_fiyadeta_rows(), "bayi başına ürün fiyatı"))
    parts.append(render_table_rows(objects["NS_ALSAASIL"], gen_alsaasil_rows(), "teklif/sipariş/fatura başlıkları"))
    parts.append(render_table_rows(objects["NS_ALSADETA"], gen_alsadeta_rows(), "teklif/sipariş/fatura satırları"))
    parts.append(render_table_rows(objects["NS_STOKASIL"], gen_stokasil_rows(), f"{len(SHIPMENTS)} sevkiyat"))

    return "\n".join(parts)


if __name__ == "__main__":
    sql = generate()
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(sql, encoding="utf-8")
    print(f"Yazıldı: {OUTPUT_PATH} ({len(sql.splitlines())} satır)")
