using NetsimB2B.Domain.Catalog;
using Xunit;

namespace NetsimB2B.UnitTests.Catalog;

public sealed class ProductTests
{
    [Fact]
    public void Constructor_RejectsEmptyCode()
    {
        Assert.Throws<ArgumentException>(() => new Product(1, "", "Ürün", "ADET"));
    }
}

