using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NetsimB2B.Application.Abstractions.Data;
using NetsimB2B.Application.Products;
using NetsimB2B.Infrastructure.Netsim;
using NetsimB2B.Infrastructure.Netsim.Products;

namespace NetsimB2B.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Netsim")
            ?? throw new InvalidOperationException("ConnectionStrings:Netsim tanımlı değil.");

        services.AddSingleton<INetsimConnectionFactory>(new FirebirdConnectionFactory(connectionString));
        services.AddScoped<IProductReadService, NetsimProductReadService>();
        return services;
    }
}

