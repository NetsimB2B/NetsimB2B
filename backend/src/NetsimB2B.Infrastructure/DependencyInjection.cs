using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NetsimB2B.Application.Abstractions.Data;
using NetsimB2B.Application.Auth;
using NetsimB2B.Application.Cart;
using NetsimB2B.Application.Favorites;
using NetsimB2B.Application.Finance;
using NetsimB2B.Application.Invoices;
using NetsimB2B.Application.Orders;
using NetsimB2B.Application.Products;
using NetsimB2B.Application.Quotes;
using NetsimB2B.Application.Shipments;
using NetsimB2B.Infrastructure.B2B;
using NetsimB2B.Infrastructure.Netsim;
using NetsimB2B.Infrastructure.Netsim.Accounts;
using NetsimB2B.Infrastructure.Netsim.Finance;
using NetsimB2B.Infrastructure.Netsim.Invoices;
using NetsimB2B.Infrastructure.Netsim.Orders;
using NetsimB2B.Infrastructure.Netsim.Products;
using NetsimB2B.Infrastructure.Netsim.Quotes;
using NetsimB2B.Infrastructure.Netsim.Shipments;
using NetsimB2B.Infrastructure.Security;

namespace NetsimB2B.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var netsimConnectionString = configuration.GetConnectionString("Netsim")
            ?? throw new InvalidOperationException("ConnectionStrings:Netsim tanımlı değil.");
        var b2bConnectionString = configuration.GetConnectionString("B2B")
            ?? throw new InvalidOperationException("ConnectionStrings:B2B tanımlı değil.");

        services.AddSingleton<INetsimConnectionFactory>(new FirebirdConnectionFactory(netsimConnectionString));
        services.AddSingleton<IB2BConnectionFactory>(new FirebirdB2BConnectionFactory(b2bConnectionString));

        services.AddScoped<IProductReadService, NetsimProductReadService>();
        services.AddScoped<IQuoteReadService, NetsimQuoteReadService>();
        services.AddScoped<IOrderReadService, NetsimOrderReadService>();
        services.AddScoped<IOrderWriteService, NetsimOrderWriteService>();
        services.AddScoped<IInvoiceReadService, NetsimInvoiceReadService>();
        services.AddScoped<IFinanceReadService, NetsimFinanceReadService>();
        services.AddScoped<IShipmentReadService, NetsimShipmentReadService>();

        services.AddSingleton<IPasswordHasher, Pbkdf2PasswordHasher>();
        services.AddScoped<IUserCredentialStore, UserCredentialStore>();
        services.AddScoped<ICariAccessStore, CariAccessStore>();
        services.AddScoped<IAccountReadService, NetsimAccountReadService>();
        services.AddScoped<AuthenticationService>();
        services.AddScoped<ICartStore, CartStore>();
        services.AddScoped<IFavoriteStore, FavoriteStore>();

        return services;
    }
}

