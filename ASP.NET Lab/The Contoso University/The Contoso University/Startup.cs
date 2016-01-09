using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(The_Contoso_University.Startup))]
namespace The_Contoso_University
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
