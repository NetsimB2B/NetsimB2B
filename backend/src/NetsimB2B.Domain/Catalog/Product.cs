using NetsimB2B.Domain.Common;

namespace NetsimB2B.Domain.Catalog;

public sealed class Product(long id, string code, string name, string unit) : Entity<long>(id)
{
    public string Code { get; } = string.IsNullOrWhiteSpace(code) ? throw new ArgumentException("Ürün kodu zorunludur.") : code;
    public string Name { get; } = string.IsNullOrWhiteSpace(name) ? throw new ArgumentException("Ürün adı zorunludur.") : name;
    public string Unit { get; } = unit;
}

