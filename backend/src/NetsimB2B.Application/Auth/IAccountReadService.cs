namespace NetsimB2B.Application.Auth;

public interface IAccountReadService
{
    /// <summary>Netsim CARIKART'tan verilen CARI_NO'ların kodu/adını döner.</summary>
    Task<IReadOnlyList<(long CariNo, string CariKodu, string CariAdi)>> GetByCariNosAsync(
        IReadOnlyCollection<long> cariNos, CancellationToken cancellationToken);
}
