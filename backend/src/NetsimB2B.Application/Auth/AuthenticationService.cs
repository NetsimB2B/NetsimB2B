namespace NetsimB2B.Application.Auth;

public sealed class AuthenticationService(
    IUserCredentialStore credentialStore,
    ICariAccessStore cariAccessStore,
    IAccountReadService accountReadService,
    IPasswordHasher passwordHasher)
{
    public async Task<UserSessionInfo?> AuthenticateAsync(string email, string password, CancellationToken cancellationToken)
    {
        var credential = await credentialStore.GetByEmailAsync(email, cancellationToken);
        if (credential is null || !credential.IsActive || !passwordHasher.Verify(password, credential.PasswordHash))
        {
            return null;
        }

        return await BuildSessionAsync(credential, cancellationToken);
    }

    public async Task<UserSessionInfo?> GetSessionAsync(Guid userId, CancellationToken cancellationToken)
    {
        var credential = await credentialStore.GetByIdAsync(userId, cancellationToken);
        if (credential is null || !credential.IsActive)
        {
            return null;
        }

        return await BuildSessionAsync(credential, cancellationToken);
    }

    private async Task<UserSessionInfo?> BuildSessionAsync(UserCredential credential, CancellationToken cancellationToken)
    {
        var access = await cariAccessStore.GetForUserAsync(credential.Id, cancellationToken);
        if (access.Count == 0)
        {
            return null;
        }

        var cariNos = access.Select(a => a.CariNo).ToArray();
        var netsimAccounts = await accountReadService.GetByCariNosAsync(cariNos, cancellationToken);
        var netsimByCariNo = netsimAccounts.ToDictionary(a => a.CariNo);

        var accounts = access
            .Where(a => netsimByCariNo.ContainsKey(a.CariNo))
            .Select(a =>
            {
                var (cariNo, cariKodu, cariAdi) = netsimByCariNo[a.CariNo];
                return new AccountSummary(cariNo, cariKodu, cariAdi, a.IsDefault);
            })
            .ToList();

        var defaultCariNo = access.FirstOrDefault(a => a.IsDefault)?.CariNo ?? access[0].CariNo;
        var user = new SessionUser(credential.Id, credential.Email, credential.DisplayName);
        return new UserSessionInfo(user, accounts, defaultCariNo);
    }
}
