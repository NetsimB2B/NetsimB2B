namespace NetsimB2B.Application.Invoices;

public sealed record InvoiceLineItem(long ProductId, double Quantity, double UnitPrice, double TaxRate);
