import "@typespec/http";
import "@typespec/openapi";
import "@typespec/versioning";
import "./routes/";

using TypeSpec.Http;
using TypeSpec.OpenAPI;
using TypeSpec.Versioning;

@service(#{ title: "I18n Resources APIs" })
@versioned(Versions)
@doc("""
  **Development only**.
  
  Analysis documentation for _i18n_ server-side resources.
  """)
@useAuth(BasicAuth)
@tagMetadata("Admin", #{ description: "List of Administrative API about i18n resources" })
@server(
  "http://{baseUrl}{pathSpec}",
  "Backend URL (HTTP)",
  {
    @doc("Base URL")
    baseUrl: string = "localhost:8080",

    @doc("Path specializer (e.g. /api")
    pathSpec: string = "/api",
  }
)
namespace I18nResourceNamespace;

enum Versions {
  `1.0.0-beta.1`,
}
