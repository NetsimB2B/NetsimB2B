using System.Data.Common;
using Dapper;
using NetsimB2B.Application.Abstractions.Data;
using NetsimB2B.Application.Cart;

namespace NetsimB2B.Infrastructure.B2B;

internal sealed class CartStore(IB2BConnectionFactory connectionFactory) : ICartStore
{
    public async Task<IReadOnlyList<CartLineItem>> GetLinesAsync(Guid userId, long cariNo, CancellationToken cancellationToken)
    {
        const string sql = """
            SELECT CAST(L.STOK_NO AS BIGINT) AS StokNo, L.QUANTITY AS Quantity, L.UNIT_PRICE AS UnitPrice, L.QUOTE_ID AS QuoteId
            FROM B2B_CART_LINES L
            JOIN B2B_CARTS C ON C.ID = L.CART_ID
            WHERE C.USER_ID = @UserId AND C.CARI_NO = @CariNo AND C.STATUS = 'ACTIVE'
            ORDER BY L.STOK_NO
            """;

        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);
        var command = new CommandDefinition(sql, new { UserId = userId.ToString(), CariNo = cariNo }, cancellationToken: cancellationToken);
        var rows = await connection.QueryAsync<CartLineItem>(command);
        return rows.AsList();
    }

    public async Task<CartLineItem> AddLineAsync(
        Guid userId,
        long cariNo,
        long stokNo,
        decimal quantity,
        decimal? unitPrice,
        string? quoteId,
        CancellationToken cancellationToken)
    {
        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);
        var cartId = await GetOrCreateCartIdAsync(connection, userId, cariNo, cancellationToken);

        // CartLineItem'ın (record) tek constructor'ı StokNo bekler; Dapper'ın constructor
        // eşlemesi tüm parametrelerin sorgu sütunlarıyla eşleşmesini gerektirir, bu yüzden
        // burada zaten bilinen stokNo'yu da sütun olarak veriyoruz.
        const string selectExistingSql = """
            SELECT CAST(@StokNo AS BIGINT) AS StokNo, QUANTITY AS Quantity, UNIT_PRICE AS UnitPrice, QUOTE_ID AS QuoteId
            FROM B2B_CART_LINES
            WHERE CART_ID = @CartId AND STOK_NO = @StokNo AND VARIANT_KEY IS NULL
            """;
        var existing = await connection.QuerySingleOrDefaultAsync<CartLineItem>(new CommandDefinition(
            selectExistingSql, new { CartId = cartId, StokNo = stokNo }, cancellationToken: cancellationToken));

        if (existing is null)
        {
            const string insertSql = """
                INSERT INTO B2B_CART_LINES (ID, CART_ID, STOK_NO, QUANTITY, UNIT_PRICE, QUOTE_ID)
                VALUES (@Id, @CartId, @StokNo, @Quantity, @UnitPrice, @QuoteId)
                """;
            await connection.ExecuteAsync(new CommandDefinition(
                insertSql,
                new { Id = Guid.NewGuid().ToString(), CartId = cartId, StokNo = stokNo, Quantity = quantity, UnitPrice = unitPrice, QuoteId = quoteId },
                cancellationToken: cancellationToken));

            return new CartLineItem(stokNo, quantity, unitPrice, quoteId);
        }

        var mergedQuantity = existing.Quantity + quantity;
        var mergedUnitPrice = unitPrice ?? existing.UnitPrice;
        var mergedQuoteId = quoteId ?? existing.QuoteId;

        const string updateSql = """
            UPDATE B2B_CART_LINES
            SET QUANTITY = @Quantity, UNIT_PRICE = @UnitPrice, QUOTE_ID = @QuoteId
            WHERE CART_ID = @CartId AND STOK_NO = @StokNo AND VARIANT_KEY IS NULL
            """;
        await connection.ExecuteAsync(new CommandDefinition(
            updateSql,
            new { CartId = cartId, StokNo = stokNo, Quantity = mergedQuantity, UnitPrice = mergedUnitPrice, QuoteId = mergedQuoteId },
            cancellationToken: cancellationToken));

        return new CartLineItem(stokNo, mergedQuantity, mergedUnitPrice, mergedQuoteId);
    }

    public async Task SetLineQuantityAsync(Guid userId, long cariNo, long stokNo, decimal quantity, CancellationToken cancellationToken)
    {
        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);
        var cartId = await FindActiveCartIdAsync(connection, userId, cariNo, cancellationToken);
        if (cartId is null) return;

        if (quantity <= 0)
        {
            await DeleteLineAsync(connection, cartId, stokNo, cancellationToken);
            return;
        }

        const string sql = "UPDATE B2B_CART_LINES SET QUANTITY = @Quantity WHERE CART_ID = @CartId AND STOK_NO = @StokNo";
        await connection.ExecuteAsync(new CommandDefinition(
            sql, new { CartId = cartId, StokNo = stokNo, Quantity = quantity }, cancellationToken: cancellationToken));
    }

    public async Task RemoveLineAsync(Guid userId, long cariNo, long stokNo, CancellationToken cancellationToken)
    {
        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);
        var cartId = await FindActiveCartIdAsync(connection, userId, cariNo, cancellationToken);
        if (cartId is null) return;

        await DeleteLineAsync(connection, cartId, stokNo, cancellationToken);
    }

    public async Task ClearAsync(Guid userId, long cariNo, CancellationToken cancellationToken)
    {
        await using var connection = await connectionFactory.OpenConnectionAsync(cancellationToken);
        var cartId = await FindActiveCartIdAsync(connection, userId, cariNo, cancellationToken);
        if (cartId is null) return;

        const string sql = "DELETE FROM B2B_CART_LINES WHERE CART_ID = @CartId";
        await connection.ExecuteAsync(new CommandDefinition(sql, new { CartId = cartId }, cancellationToken: cancellationToken));
    }

    private static Task DeleteLineAsync(DbConnection connection, string cartId, long stokNo, CancellationToken cancellationToken)
    {
        const string sql = "DELETE FROM B2B_CART_LINES WHERE CART_ID = @CartId AND STOK_NO = @StokNo";
        return connection.ExecuteAsync(new CommandDefinition(
            sql, new { CartId = cartId, StokNo = stokNo }, cancellationToken: cancellationToken));
    }

    private static async Task<string?> FindActiveCartIdAsync(DbConnection connection, Guid userId, long cariNo, CancellationToken cancellationToken)
    {
        const string sql = "SELECT ID FROM B2B_CARTS WHERE USER_ID = @UserId AND CARI_NO = @CariNo AND STATUS = 'ACTIVE'";
        return await connection.QuerySingleOrDefaultAsync<string?>(new CommandDefinition(
            sql, new { UserId = userId.ToString(), CariNo = cariNo }, cancellationToken: cancellationToken));
    }

    private static async Task<string> GetOrCreateCartIdAsync(DbConnection connection, Guid userId, long cariNo, CancellationToken cancellationToken)
    {
        var existing = await FindActiveCartIdAsync(connection, userId, cariNo, cancellationToken);
        if (existing is not null) return existing;

        var newCartId = Guid.NewGuid().ToString();
        const string insertSql = "INSERT INTO B2B_CARTS (ID, USER_ID, CARI_NO) VALUES (@Id, @UserId, @CariNo)";
        await connection.ExecuteAsync(new CommandDefinition(
            insertSql, new { Id = newCartId, UserId = userId.ToString(), CariNo = cariNo }, cancellationToken: cancellationToken));
        return newCartId;
    }
}
