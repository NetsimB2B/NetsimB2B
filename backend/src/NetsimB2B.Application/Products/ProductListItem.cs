namespace NetsimB2B.Application.Products;

public sealed record ProductListItem(
    long Id,
    string Code,
    string Name,
    string Unit,
    string? Category,
    string? Brand,
    string? Description,
    double? Price,
    double Stock);
