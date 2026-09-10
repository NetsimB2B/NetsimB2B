namespace NetsimB2B.Application.Auth;

public sealed record UserCredential(Guid Id, string Email, string DisplayName, bool IsActive, string PasswordHash);
