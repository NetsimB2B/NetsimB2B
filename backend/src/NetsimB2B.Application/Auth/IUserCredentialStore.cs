namespace NetsimB2B.Application.Auth;

public interface IUserCredentialStore
{
    Task<UserCredential?> GetByEmailAsync(string email, CancellationToken cancellationToken);

    Task<UserCredential?> GetByIdAsync(Guid userId, CancellationToken cancellationToken);
}
