using Dapper;
using NetsimB2B.Application.Abstractions.Data;
using NetsimB2B.Application.Auth;

namespace NetsimB2B.Infrastructure.Netsim.Accounts;

internal sealed class NetsimAccountReadService(INetsimConnectionFactory connectionFactory) : IAccountReadService
{
    private sealed record Row(long CariNo, string CariKodu, string CariAdi);

    public async Task<IReadOnlyList<(long CariNo, string CariKodu, string CariAdi)>> GetByCariNosAsync(
        IReadOnlyCollection<long> cariNos, CancellationToken cancellationToken)
    {
        if (cariNos.Count == 0)
        {
            return [];
        }

        // CARI_NO Netsim'de INTEGER (Int32); Dapper'ın record ctor materyalizasyonu Int32->long
        // genişletmesini otomatik yapmaz, bu yüzden BIGINT'e cast edip Dapper tarafını Int64 ile eşleştiriyoruz.
        const string sql = """
            SELECT CAST(CARI_NO AS BIGINT) AS CariNo, CARI_KODU AS CariKodu, CARI_ADI AS CariAdi
            FROM CARIKART
            WHERE CARI_NO IN @CariNos
            """;

        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);
        var command = new CommandDefinition(sql, new { CariNos = cariNos }, cancellationToken: cancellationToken);
        var rows = await connection.QueryAsync<Row>(command);
        return rows.Select(r => (r.CariNo, r.CariKodu, r.CariAdi)).ToList();
    }
}
