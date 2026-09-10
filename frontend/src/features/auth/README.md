# Auth

Giriş, çıkış ve oturum kontrolü backend'in `POST /api/auth/login`, `POST /api/auth/logout`,
`GET /api/auth/me` uçlarına bağlıdır (bkz. `authApi.ts`).

Oturum **HttpOnly cookie** ile tutulur (backend'de ASP.NET Core Cookie Authentication).
Frontend hiçbir kimlik bilgisini (token, şifre) `localStorage`/`sessionStorage`'a yazmaz —
tarayıcı cookie'yi otomatik yönetir, `httpClient.ts`'teki `apiRequest` her istekte
`credentials: "include"` gönderir. Oturum durumu react-query'nin `["auth","me"]` cache'inde
tutulur (in-memory, sayfa yenilendiğinde `RequireAuth`/`AppShell` tekrar `GET /api/auth/me`
ile rehydrate eder).
