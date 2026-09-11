"""Generates Firebird 5 DDL for a B2B-relevant subset of the Netsim schema.

Reads docs/04-data/Netsim-Veritabani-Semasi.md (via netsim_schema_parser,
streamed - never loaded whole into memory as one string) and emits:

  database/firebird/netsim-dev/V000__netsim_dev_subset.sql

containing:
  1. CREATE TABLE for each NS_-prefixed physical table in TABLES, with a
     "-- neden gerekli" comment explaining why the B2B backend needs it.
  2. Compatibility views (`CREATE VIEW STOKKART AS SELECT * FROM NS_STOKKART`)
     for the subset of tables the existing backend code queries by the
     "friendly" (non-NS_) name — see COMPAT_VIEWS.

This is a dev-only structural mock. It does not reproduce real Netsim view
definitions, triggers, or procedures — see netsim-dev/README.md.
"""
from __future__ import annotations

from pathlib import Path

from netsim_schema_parser import Field, NetsimObject, parse_objects

SCHEMA_DOC = Path(__file__).resolve().parents[3] / "docs" / "04-data" / "Netsim-Veritabani-Semasi.md"
OUTPUT_PATH = Path(__file__).resolve().parents[1] / "netsim-dev" / "V000__netsim_dev_subset.sql"

# Table -> why the B2B backend needs it.
TABLES: dict[str, str] = {
    "NS_FIRMALAR": "Firma bilgisi; fatura/teklif başlıklarında ve tenant ayrımında kullanılır.",
    "NS_CARIKART": "Bayi/müşteri cari kartı; portal oturumu bir CARI_NO'ya bağlanır (company-context).",
    "NS_CARIISLM": "Cari hareket/bakiye geçmişi; cari ekstresi ve borç/alacak özetleri için gerekir.",
    "NS_CARIKALI": "Cari kredi limiti (BLOKE_MAX/TOPLAM_RISK); Finans ekranındaki kullanılabilir limit için gerekir — CARIKART'ta limit alanı yok.",
    "NS_STOKKART": "Ürün ana kartı; ürün listeleme/arama (NetsimProductReadService) STOKKART view'ı üzerinden buna bağlanır.",
    "NS_STOKKADE": "Depo bazlı stok miktarı; 'stokta var/yok' göstergesi ve miktar sorguları burada.",
    "NS_STOKBIRI": "Stok birim tanımı (BIRIM, katsayı); ürün kartında NS_STOKKART'ta olmayan BIRIM burada saklanır.",
    "NS_STOKBARK": "Barkod tanımı; barkod ile ürün arama senaryoları için gerekir.",
    "NS_STOKMARK": "Marka tanımı; ürün filtreleme ve kart üstü marka adı için gerekir.",
    "NS_STOKGRUP": "Stok grubu; kategori/filtre ağacı için gerekir.",
    "NS_STOKURHA": "Ürün hattı tanımı; ürün filtreleme için gerekir.",
    "NS_STOKTIPI": "Stok tipi tanımı; STOK_TIP_NO/STOK_TIP_ADI çözümlemesi için gerekir.",
    "NS_STOKYERI": "Depo/stok yeri tanımı; STOKKADE.STOK_YERI_NO çözümlemesi için gerekir.",
    "NS_STOKLIMT": "Stok limit sınıfı; müşteriye özel min/max sipariş kısıtları için gerekir.",
    "NS_BIRIMLER": "Genel birim kataloğu (adet, kg, mt...); birim adı çözümlemesi için gerekir.",
    "NS_STOKASIL": "Stok hareket başlığı; stok kartı üzerindeki işlem geçmişi için gerekir.",
    "NS_STOKISLM": "Stok hareket satırı; giriş/çıkış hareketleri detayında gerekir.",
    "NS_ALSAASIL": "Alış/satış belge başlığı; teklif/sipariş/fatura listeleri için gerekir.",
    "NS_ALSADETA": "Alış/satış belge satırı; sipariş/fatura kalemleri için gerekir.",
    "NS_ALSAINDI": "Belge bazlı indirim satırı; sipariş toplamındaki indirim kalemleri için gerekir.",
    "NS_ALSALINK": "Belgeler arası bağlantı (teklif->sipariş->fatura zinciri) için gerekir.",
    "NS_ALSATESL": "Teslimat/sevkiyat bilgisi; sipariş durumu ve teslimat takibi için gerekir.",
    "NS_FIYALIST": "Fiyat listesi başlığı; cari bazlı fiyat listesi seçimi için gerekir.",
    "NS_FIYADETA": "Fiyat listesi satırı (LISTE_FIYATI); ürün fiyatlandırma motoru için gerekir.",
    "NS_INDIKART": "İndirim kartı; kademeli/cari bazlı indirim kuralları için gerekir.",
    "NS_KAMPANYA": "Kampanya tanımı; NS_FIYADETA.KAMPANYA_NO çözümlemesi için gerekir.",
}

# Friendly view name -> backing NS_ table. Existing backend SQL (e.g.
# NetsimProductReadService) queries these friendly names directly.
COMPAT_VIEWS: dict[str, str] = {
    "CARIKART": "NS_CARIKART",
    "CARIISLM": "NS_CARIISLM",
    "CARIKALI": "NS_CARIKALI",
    "STOKKART": "NS_STOKKART",
    "STOKKADE": "NS_STOKKADE",
    "STOKASIL": "NS_STOKASIL",
    "STOKISLM": "NS_STOKISLM",
    "ALSAASIL": "NS_ALSAASIL",
    "ALSADETA": "NS_ALSADETA",
    "FIYALIST": "NS_FIYALIST",
    "FIYADETA": "NS_FIYADETA",
    "STOKBIRI": "NS_STOKBIRI",
    "STOKMARK": "NS_STOKMARK",
    "STOKGRUP": "NS_STOKGRUP",
    "STOKURHA": "NS_STOKURHA",
    "STOKYERI": "NS_STOKYERI",
    "BIRIMLER": "NS_BIRIMLER",
}

# Doğrulanmış: şema dosyasında geçen ayrılmış kelimeler (kural 04-data talimatında verildi).
RESERVED_WORDS = {
    "POSITION", "VALUE", "TYPE", "SIZE", "ACTION", "START", "END", "TIME", "DATE",
    "TIMESTAMP", "USER", "ROLE", "INDEX", "KEY", "ORDER", "GROUP", "SECURITY",
    "OFFSET", "ROW", "ROWS", "BOOLEAN", "CHAR", "YEAR", "MONTH", "DAY", "HOUR",
    "MINUTE", "SECOND", "COMMENT", "SCALE", "PLAN", "CHARACTER",
}

TYPE_MAP = {
    "INTEGER": "INTEGER",
    "DOUBLE": "DOUBLE PRECISION",
    "BIGINT": "BIGINT",
    "DATE": "DATE",
    "SMALLINT": "SMALLINT",
    "BLOB(TEXT)": "BLOB SUB_TYPE TEXT",
    "BLOB": "BLOB SUB_TYPE BINARY",
    "TIME": "TIME",
    "BOOLEAN": "BOOLEAN",
    "TIMESTAMP": "TIMESTAMP",
}
SIZED_TYPES = {"VARCHAR", "CHAR"}


def quote_ident(name: str) -> str:
    return f'"{name}"' if name.upper() in RESERVED_WORDS else name


def sql_type_for(f: Field) -> str:
    if f.sql_type in SIZED_TYPES:
        return f"{f.sql_type}({int(f.size)})"
    mapped = TYPE_MAP.get(f.sql_type)
    if mapped is None:
        raise ValueError(f"Bilinmeyen tip: {f.sql_type!r} (alan {f.name})")
    return mapped


def render_table(obj: NetsimObject, reason: str) -> str:
    lines = [f"-- {obj.name}: {reason}", f"CREATE TABLE {obj.name} ("]
    col_lines = []
    for f in obj.fields:
        col = f"    {quote_ident(f.name)} {sql_type_for(f)}"
        if not f.nullable:
            col += " NOT NULL"
        col_lines.append(col)
    if obj.primary_key:
        pk_cols = ", ".join(quote_ident(c) for c in obj.primary_key)
        col_lines.append(f"    CONSTRAINT PK_{obj.name} PRIMARY KEY ({pk_cols})")
    lines.append(",\n".join(col_lines))
    lines.append(");")
    return "\n".join(lines)


def render_compat_view(view_name: str, table_name: str) -> str:
    return f"CREATE VIEW {view_name} AS SELECT * FROM {table_name};"


def generate() -> tuple[str, dict[str, NetsimObject]]:
    wanted = set(TABLES)
    objects = parse_objects(SCHEMA_DOC, wanted)
    missing = wanted - set(objects)
    if missing:
        raise RuntimeError(f"Şemada bulunamayan tablolar: {sorted(missing)}")
    for name, obj in objects.items():
        if obj.kind != "Fiziksel tablo":
            raise RuntimeError(f"{name} fiziksel tablo değil: {obj.kind!r}")
        if not obj.primary_key:
            raise RuntimeError(f"{name} için birincil anahtar bulunamadı")

    parts = [
        "-- OTOMATIK ÜRETILDI: database/firebird/tools/netsim_ddl_gen.py",
        "-- Kaynak: docs/04-data/Netsim-Veritabani-Semasi.md",
        "-- Bu, gerçek Netsim şemasının YAPISAL bir alt kümesidir (bkz. netsim-dev/README.md).",
        "-- Sadece yeni/boş bir geliştirme veritabanında çalıştırın.",
        "",
    ]
    for name in TABLES:
        parts.append(render_table(objects[name], TABLES[name]))
        parts.append("")

    parts.append("-- Uyumluluk view'ları: mevcut backend SQL'i NS_ önekini bilmeden çalışsın diye.")
    parts.append("-- Pass-through shim'lerdir; gerçek Netsim view'ları JOIN/filtre içerebilir (bkz. README).")
    for view_name, table_name in COMPAT_VIEWS.items():
        parts.append(render_compat_view(view_name, table_name))
    parts.append("")

    return "\n".join(parts), objects


if __name__ == "__main__":
    sql, _ = generate()
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(sql, encoding="utf-8")
    print(f"Yazıldı: {OUTPUT_PATH} ({len(sql.splitlines())} satır)")
