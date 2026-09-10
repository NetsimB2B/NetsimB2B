using NetsimB2B.Application.Abstractions.Security;

namespace NetsimB2B.Api.Security;

/// <summary>
/// Kullanıcının aktif CARI_NO'sunu HTTP oturum claim'lerinden çözer.
/// İstemcinin gönderdiği X-Cari-No header'ı yalnızca kullanıcının oturum
/// claim'lerinde (login sırasında B2B_USER_CARI_ACCESS'ten yazılan) yer
/// alıyorsa kabul edilir; aksi halde varsayılan cari kullanılır.
/// (bkz. proje kök README.md → Güvenlik notu: "Kullanıcının gönderdiği
/// CARI_NO'ya güvenilmez.")
/// </summary>
internal sealed class HttpContextCurrentCompanyContext(IHttpContextAccessor httpContextAccessor) : ICurrentCompanyContext
{
    private const string RequestedCariHeader = "X-Cari-No";

    public long CariNo
    {
        get
        {
            var httpContext = httpContextAccessor.HttpContext
                ?? throw new InvalidOperationException("Aktif bir HTTP isteği yok.");
            var user = httpContext.User;

            var allowed = user.Claims
                .Where(c => c.Type == CariClaimTypes.CariNo)
                .Select(c => long.Parse(c.Value))
                .ToHashSet();

            var defaultClaim = user.Claims.FirstOrDefault(c => c.Type == CariClaimTypes.DefaultCariNo)
                ?? throw new InvalidOperationException("Oturumda varsayılan cari bilgisi yok.");
            var defaultCariNo = long.Parse(defaultClaim.Value);

            if (httpContext.Request.Headers.TryGetValue(RequestedCariHeader, out var requested)
                && long.TryParse(requested, out var requestedCariNo)
                && allowed.Contains(requestedCariNo))
            {
                return requestedCariNo;
            }

            return defaultCariNo;
        }
    }
}
