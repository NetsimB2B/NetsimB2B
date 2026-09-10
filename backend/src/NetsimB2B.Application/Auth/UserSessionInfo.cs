namespace NetsimB2B.Application.Auth;

public sealed record SessionUser(Guid Id, string Email, string DisplayName);

public sealed record UserSessionInfo(SessionUser User, IReadOnlyList<AccountSummary> Accounts, long DefaultCariNo);
