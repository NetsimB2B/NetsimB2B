using NetsimB2B.Domain.Common;

namespace NetsimB2B.Domain.Identity;

public sealed class B2BUser(Guid id, string email, string displayName, bool isActive) : Entity<Guid>(id)
{
    public string Email { get; } = string.IsNullOrWhiteSpace(email) ? throw new ArgumentException("E-posta zorunludur.") : email;
    public string DisplayName { get; } = string.IsNullOrWhiteSpace(displayName) ? throw new ArgumentException("Görünen ad zorunludur.") : displayName;
    public bool IsActive { get; } = isActive;
}
