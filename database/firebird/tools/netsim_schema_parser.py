"""Parses docs/04-data/Netsim-Veritabani-Semasi.md object entries.

Streams the file line-by-line (it is ~9.4 MB / 134k lines) and extracts,
for a requested set of object names, the declared type, primary key and
field list. Used by netsim_ddl_gen.py and netsim_seed_gen.py so both tools
share one source of truth for column metadata.

Doc format (validated against NS_STOKKART / STOKKART):
    #### NS_STOKKART
    - Tur: **Fiziksel tablo**.
    - Kaynak aile: `STOKKART`.
    - Alan sayisi: 143.
    - Birincil anahtar: `STOK_NO`.

    ##### Alanlar

    | Sira | Alan | Tur | Boyut | Olcek | NULL olabilir | PK | Domain | Varsayilan |
    | --- | --- | --- | --- | --- | --- | --- | --- | --- |
    | 1 | `STOK_NO` | `INTEGER` | -- | 0 | Hayir | Evet | `FTSTOK_NO` | -- |
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path

HEADER_RE = re.compile(r"^#### ([A-Z0-9_]+)\s*$")
TYPE_RE = re.compile(r"^- T[uü]r: \*\*(.+?)\*\*\.\s*$")
PK_RE = re.compile(r"^- Birincil anahtar: (.+?)\.\s*$")
FIELDS_HEADING_RE = re.compile(r"^##### Alanlar\s*$")
SECTION_HEADING_RE = re.compile(r"^#####? ")
FIELD_ROW_RE = re.compile(
    r"^\|\s*(\d+)\s*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(Evet|Hay[ıi]r)\s*\|\s*(Evet|Hay[ıi]r)\s*\|\s*(?:`([^`]+)`|—|-)\s*\|\s*(?:`([^`]+)`|—|-)\s*\|\s*$"
)
BACKTICK_RE = re.compile(r"`([^`]+)`")


@dataclass
class Field:
    order: int
    name: str
    sql_type: str
    size: str
    scale: str
    nullable: bool
    is_pk: bool
    domain: str | None
    default: str | None


@dataclass
class NetsimObject:
    name: str
    kind: str  # "Fiziksel tablo" or "Görünüm"
    primary_key: list[str] = field(default_factory=list)
    fields: list[Field] = field(default_factory=list)


def _extract_pk(raw: str) -> list[str]:
    raw = raw.strip()
    if raw.startswith("Kaynakta yok"):
        return []
    return BACKTICK_RE.findall(raw)


def parse_objects(md_path: str | Path, wanted_names: set[str]) -> dict[str, NetsimObject]:
    """Streams the schema doc and returns metadata for objects in wanted_names.

    Only exact `#### NAME` headers are matched (the doc also uses `#### NAME`
    for both physical tables and views under different anchors, so callers
    that want a table specifically should pass the NS_-prefixed name).
    """
    results: dict[str, NetsimObject] = {}
    remaining = set(wanted_names)
    current: NetsimObject | None = None
    in_fields_table = False
    seen_header_separator = False

    with open(md_path, encoding="utf-8") as f:
        for line in f:
            line = line.rstrip("\n")

            header_match = HEADER_RE.match(line)
            if header_match:
                # closing out any previous capture
                if current is not None and current.name in wanted_names:
                    results[current.name] = current
                    remaining.discard(current.name)
                if not remaining:
                    return results
                name = header_match.group(1)
                current = NetsimObject(name=name, kind="") if name in wanted_names else None
                in_fields_table = False
                seen_header_separator = False
                continue

            if current is None:
                continue

            type_match = TYPE_RE.match(line)
            if type_match:
                current.kind = type_match.group(1)
                continue

            pk_match = PK_RE.match(line)
            if pk_match:
                current.primary_key = _extract_pk(pk_match.group(1))
                continue

            if FIELDS_HEADING_RE.match(line):
                in_fields_table = True
                seen_header_separator = False
                continue

            if in_fields_table:
                if SECTION_HEADING_RE.match(line) and not FIELDS_HEADING_RE.match(line):
                    in_fields_table = False
                    continue
                if not line.startswith("|"):
                    continue
                if not seen_header_separator:
                    # first row after heading is the `| Sira | Alan | ... |` header,
                    # second is the `| --- | --- | ... |` separator.
                    if set(line.replace("|", "").strip()) <= {"-", " "}:
                        seen_header_separator = True
                    continue
                row = FIELD_ROW_RE.match(line)
                if row is None:
                    continue
                order, fname, ftype, size, scale, nullable_raw, pk_raw, domain, default = row.groups()
                current.fields.append(
                    Field(
                        order=int(order),
                        name=fname,
                        sql_type=ftype,
                        size=size,
                        scale=scale,
                        nullable=nullable_raw.startswith("Evet"),
                        is_pk=pk_raw.startswith("Evet"),
                        domain=domain,
                        default=None if default in (None, "—", "-") else default,
                    )
                )

    if current is not None and current.name in wanted_names:
        results[current.name] = current

    return results


if __name__ == "__main__":
    import sys

    doc = sys.argv[1] if len(sys.argv) > 1 else "docs/04-data/Netsim-Veritabani-Semasi.md"
    names = set(sys.argv[2:]) or {"NS_STOKKART"}
    objs = parse_objects(doc, names)
    for name in names:
        obj = objs.get(name)
        if obj is None:
            print(f"{name}: NOT FOUND")
            continue
        print(f"{obj.name}: kind={obj.kind} pk={obj.primary_key} fields={len(obj.fields)}")
        for f_ in obj.fields[:5]:
            print("   ", f_)
