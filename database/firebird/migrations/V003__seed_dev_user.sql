/* Yalnızca B2B veritabanında çalıştırın. Geliştirme/demo kullanıcısı.
   Şifre: Netsim123! (frontend'in eski mock kimlik bilgisiyle aynı).
   Hash, gerçek Pbkdf2PasswordHasher implementasyonu ile üretildi (bkz.
   backend/src/NetsimB2B.Infrastructure/Security/Pbkdf2PasswordHasher.cs). */

INSERT INTO B2B_USERS (ID, EMAIL, DISPLAY_NAME, IS_ACTIVE, PASSWORD_HASH)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'demo@netsim.com',
    'Demo Bayi Kullanıcısı',
    TRUE,
    '100000.sopd/mkjcivcx/T1XO9g8A==.CteSrgfz4LhGgX4oXaBATIqOOsJEgk99X3XXLMfilDg='
);

INSERT INTO B2B_USER_CARI_ACCESS (USER_ID, CARI_NO, IS_DEFAULT)
VALUES ('11111111-1111-1111-1111-111111111111', 1001, TRUE);

INSERT INTO B2B_USER_CARI_ACCESS (USER_ID, CARI_NO, IS_DEFAULT)
VALUES ('11111111-1111-1111-1111-111111111111', 1002, FALSE);
