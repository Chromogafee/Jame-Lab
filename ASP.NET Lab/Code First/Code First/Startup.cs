using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Code_First.Startup))]
namespace Code_First
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
