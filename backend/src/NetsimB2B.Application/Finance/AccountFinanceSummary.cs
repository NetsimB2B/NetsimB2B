namespace NetsimB2B.Application.Finance;

public sealed record AccountFinanceSummary(
    long CariNo,
    string CariKodu,
    string CariAdi,
    string? TaxNumber,
    double Balance,
    double AvailableCredit,
    double OverdueAmount,
    string Currency);
