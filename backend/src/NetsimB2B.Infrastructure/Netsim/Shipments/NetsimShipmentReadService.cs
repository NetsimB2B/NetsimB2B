using Dapper;
using NetsimB2B.Application.Abstractions.Data;
using NetsimB2B.Application.Shipments;

namespace NetsimB2B.Infrastructure.Netsim.Shipments;

internal sealed class NetsimShipmentReadService(INetsimConnectionFactory connectionFactory) : IShipmentReadService
{
    // STOKASIL genel bir stok hareket başlığı (üretim, transfer, sayım gibi başka hareket
    // türlerini de tutabilir) — ⚠️ VARSAYIM: müşteriye sevkiyatı ISLEM_KODU='SEVKIYAT' işaretliyor,
    // gerçek Netsim'de doğrulanmadı (bkz. netsim_seed_gen.py → gen_stokasil_rows).
    // KARGO_REFERANS_NO kargo takip no için kullanıldı (TAKIP_NO'dan farklı — o daha genel/dahili
    // bir alan gibi duruyor, ALSAASIL'de de var ama hiç kullanılmadı).
    // SEVK_NAKLIYECI_FIRMA_NO CARIKART'a referans veriyor (taşıyıcı da bir cari kaydı) — NULL ise
    // (örn. müşterinin kendi aracı) taşıyıcı adı gösterilmiyor, uydurulmuyor.
    // EstimatedDelivery için ayrı bir alan yok — bağlı siparişin (Siparişlerim'de zaten kullanılan)
    // VADE_TARIHI'sine düşülüyor, sipariş bulunamazsa STOKASIL.TARIH'e (COALESCE).
    // packageCount/totalWeight (mock'taki paket adedi/toplam ağırlık) için doğrulanmış bir alan
    // bulunamadı — KARGO_TOPLAM_DESI hacimsel bir birim (kg değil), yanlış etiketlemektense hiç
    // taşınmadı (Faturalar'daki eInvoiceUuid ile aynı gerekçe).
    private const string HeaderSql = """
        SELECT
            S.BELGE_NO AS Id,
            CAST(S.CARI_NO AS BIGINT) AS CariNo,
            O.BELGE_NO AS OrderId,
            S.TARIH AS "Date",
            S.DURUM AS Status,
            CR.CARI_ADI AS Carrier,
            S.KARGO_REFERANS_NO AS TrackingNo,
            COALESCE(CAST(O.VADE_TARIHI AS TIMESTAMP), S.TARIH) AS EstimatedDelivery,
            CASE WHEN S.DURUM = 'Teslim Edildi' THEN S.DURUM_TARIHI END AS DeliveredAt,
            WH.STOK_YERI_ADI AS Origin,
            DEST.CARI_ADI AS Destination,
            S.ARAC_PLAKA AS VehiclePlate,
            S.ARAC_SOFOR AS DriverName
        FROM STOKASIL S
        LEFT JOIN ALSAASIL O ON O.ALISSATIS_NO = S.ALISSATIS_NO AND O.ISLEM_KODU = 'SIPARIS'
        LEFT JOIN CARIKART CR ON CR.CARI_NO = S.SEVK_NAKLIYECI_FIRMA_NO
        LEFT JOIN STOKYERI WH ON WH.STOK_YERI_NO = S.CIKIS_STOK_YERI_NO
        LEFT JOIN CARIKART DEST ON DEST.CARI_NO = S.CARI_NO
        WHERE S.ISLEM_KODU = 'SEVKIYAT'
            AND S.CARI_NO = @CariNo
            AND (S.KAYIT_DURUMU IS NULL OR S.KAYIT_DURUMU <> 'S')
        ORDER BY S.TARIH DESC
        """;

    public async Task<IReadOnlyList<ShipmentSummary>> GetForCariAsync(long cariNo, CancellationToken cancellationToken)
    {
        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);
        var headers = await connection.QueryAsync<HeaderRow>(new CommandDefinition(
            HeaderSql, new { CariNo = cariNo }, cancellationToken: cancellationToken));

        return headers.Select(ToSummary).ToList();
    }

    // Ayrı bir sevkiyat olay/geçmiş tablosu yok (bkz. sınıf başındaki VARSAYIM notu) — bu yüzden
    // mock'taki 4-5 adımlı ayrıntılı zaman çizelgesi yerine, STOKASIL'in gerçek alanlarından
    // (TARIH/DURUM/DURUM_TARIHI) türetilen 2-3 adımlı sade bir çizelge kuruluyor.
    private static ShipmentSummary ToSummary(HeaderRow header)
    {
        var events = new List<ShipmentEvent> { new("Sevkiyat oluşturuldu", header.Date, header.Origin, true) };

        if (header.Status is "Yolda" or "Teslim Edildi")
        {
            events.Add(new ShipmentEvent("Yolda", header.Date, null, true));
        }

        events.Add(header.DeliveredAt is { } deliveredAt
            ? new ShipmentEvent("Teslim edildi", deliveredAt, header.Destination, true)
            : new ShipmentEvent("Planlanan teslimat", header.EstimatedDelivery, header.Destination, false));

        return new ShipmentSummary(
            header.Id,
            header.CariNo,
            header.OrderId,
            header.Date,
            header.Status ?? "Hazırlanıyor",
            header.Carrier,
            header.TrackingNo,
            header.EstimatedDelivery,
            header.DeliveredAt,
            header.Origin,
            header.Destination,
            header.VehiclePlate,
            header.DriverName,
            events);
    }

    private sealed record HeaderRow(
        string Id,
        long CariNo,
        string? OrderId,
        DateTime Date,
        string? Status,
        string? Carrier,
        string? TrackingNo,
        DateTime EstimatedDelivery,
        DateTime? DeliveredAt,
        string? Origin,
        string? Destination,
        string? VehiclePlate,
        string? DriverName);
}
