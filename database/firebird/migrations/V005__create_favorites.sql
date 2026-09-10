/* Yalnızca B2B veritabanında çalıştırın (bkz. V001__create_b2b_schema.sql notu). */

/* Favoriler kullanıcı bazlı B2B verisidir (bkz. docs/03-modules/ürünler.md madde 25:
   User + Product = Favorite) — sepetin aksine cari/firma bazlı DEĞİLDİR: kullanıcı firma
   değiştirse de favori listesi aynı kalır, yalnızca ürünün aktif firmada satılabilirliği
   ayrıca kontrol edilir (bkz. aynı doküman madde 55). */
CREATE TABLE B2B_FAVORITES (
    USER_ID CHAR(36) NOT NULL,
    STOK_NO BIGINT NOT NULL,
    CREATED_AT TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT PK_B2B_FAVORITES PRIMARY KEY (USER_ID, STOK_NO),
    CONSTRAINT FK_B2B_FAVORITES_USER FOREIGN KEY (USER_ID) REFERENCES B2B_USERS (ID)
);
