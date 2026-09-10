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
    "NS_FIRMALAR", "NS_CARIKART", "NS_STOKMARK", "NS_STOKURHA", "NS_BIRIMLER",
    "NS_STOKKART", "NS_STOKBIRI", "NS_STOKYERI", "NS_STOKKADE", "NS_FIYALIST",
    "NS_FIYADETA", "NS_ALSAASIL", "NS_ALSADETA",
]

# ⚠️ VARSAYIM — Netsim'den doğrulanacak: gerçek işlem kodu değerlerini bilmiyoruz.
ISLEM_KODU = {"TEKLIF": "TEKLIF", "SIPARIS": "SIPARIS", "FATURA": "FATURA"}
ISLEM_ADI = {"TEKLIF": "Satış Teklifi", "SIPARIS": "Satış Siparişi", "FATURA": "Satış Faturası"}
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


def gen_carikart_rows() -> list[dict]:
    rows = []
    for b in BAYILER:
        rows.append({
            "CARI_NO": b["cari_no"], "CARI_KODU": b["cari_kodu"], "CARI_ADI": b["cari_adi"],
            "MUHASEBE_CARI_TURU": "BAYI", "BLOKE": "H", "KAYIT_DURUMU": "A",
            "KREDILI_ISLEM": "E", "EMAIL": b["email"], "VERGI_DAIRESI": "Merkez",
            "VERGI_NO": str(1_000_000_000 + b["cari_no"]), "BAYI_TURU": "BAYI",
        })
    return rows


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

    return "\n".join(parts)


if __name__ == "__main__":
    sql = generate()
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(sql, encoding="utf-8")
    print(f"Yazıldı: {OUTPUT_PATH} ({len(sql.splitlines())} satır)")
