# Netsim B2B

Netsim ERP verisini bayi ve kurumsal müşterilere güvenli, sade ve modern bir web arayüzüyle sunan B2B portalı için başlangıç mimarisi.

## Teknoloji tabanı

- Frontend: React 19.2, TypeScript 5.9, Vite 8
- Backend: ASP.NET Core / .NET 10 LTS
- Veritabanı: Firebird 5.0
- Veri erişimi: Firebird .NET Provider + Dapper
- Test: Vitest (frontend), xUnit (backend)

> Paketlerde patch sürümleri sabitlenmiştir. Güncellemeler kontrollü olarak Dependabot/Renovate benzeri bir araçla yapılmalıdır.

## Mimari karar

Proje, bağımsız deploy edilen bir React SPA ile katmanlı bir .NET API'den oluşur. Backend başlangıçta **modüler monolit** olarak tutulur. Netsim tablo ve kolon adları yalnızca `Infrastructure/Netsim` altında yer alır; frontend ve domain katmanı `STOKKART`, `ALSAASIL` gibi ERP adlarını bilmez.

```text
Browser -> React SPA -> ASP.NET Core API -> Netsim Adapter -> Firebird
```

## Klasörler

```text
netsim-b2b/
├── frontend/                 React uygulaması
├── backend/                  .NET çözümü ve testleri
├── database/firebird/        B2B'ye ait SQL ve yerel geliştirme notları
├── docs/                     Mimari kararlar ve referans belgeler
├── compose.yaml              Yerel Firebird ortamı
├── .env.example              Örnek ortam değişkenleri
└── .editorconfig
```

Detaylı ağaç için [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) dosyasına bakın.

## İlk çalıştırma

Gerekenler:

- Node.js 24 LTS veya Vite 8'in desteklediği güncel Node sürümü
- .NET SDK 10.0.x
- Docker Desktop (yerel Firebird için)

```bash
cp .env.example .env
docker compose up -d firebird

cd backend
dotnet restore
dotnet run --project src/NetsimB2B.Api

cd ../frontend
npm install
npm run dev
```

Frontend varsayılan olarak `http://localhost:5173`, API `http://localhost:5080` üzerinde çalışır.

## Güvenlik notu

- Gerçek Netsim bağlantı bilgilerini repoya koymayın.
- Netsim üzerinde önce salt-okunur bir veritabanı kullanıcısı oluşturun.
- Sipariş/teklif yazma işlemlerini tabloya doğrudan dağınık SQL ile yapmayın; doğrulanmış bir transaction gateway üzerinden yürütün.
- Müşteri/cari kapsamı her API sorgusunda backend tarafından uygulanmalıdır. Frontend filtresi güvenlik sınırı değildir.
