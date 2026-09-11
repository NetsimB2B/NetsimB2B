namespace NetsimB2B.Application.Abstractions.Security;

public interface ICurrentCompanyContext
{
    long CariNo { get; }

    /// <summary>Kullanıcının oturum claim'lerinde yer alan tüm CARI_NO'lar (yalnızca aktif olan değil).</summary>
    IReadOnlyCollection<long> AllowedCariNos { get; }
}

