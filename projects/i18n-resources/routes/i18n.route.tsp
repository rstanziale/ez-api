import "@typespec/http";
import "@typespec/openapi";
import "../model/i18n-resource.model.tsp";
import "../model/i18n-locale.model.tsp";
import "./bundle/admin-bundle.route.tsp";
import "../../../ext/badges.tsp";

namespace I18nResourceNamespace;

using TypeSpec.Http;
using TypeSpec.OpenAPI;

@route("/i18n")
namespace I18nRoute {
  @route("/admin")
  @tag("Admin")
  namespace AdminI18nRoute {
    interface _AdminBundleRoute extends AdminBundleRoute {}
  }

  @route("/bundle")
  @summary("Consume bundle resource")
  @doc("""
      Retrieve a bundle resource according **selector** and **langTag** taken as input.
      
      It's important to note that if a custom bundle is present, it will override the default entries.
    """)
  @get
  op consumeBundle(@query selector: string, @query langTag: string): {
    @statusCode _: 200;
    @body result: BaseResponse<I18nResponseOneOf>;
  };

  @route("/selectors")
  @summary("Get unique resource selectors")
  @doc("""
      Retrieve all unique selectors stored in the database. A selector is a unique identifier that represents a specific bundle of translations.
      
      This endpoint returns an array of selector strings that can be used to fetch specific translation bundles.
    """)
  @get
  @opExample(#{
    returnType: #{
      statusCode: 200,
      result: #{ state: #{ code: 0 }, result: #["myAwesomeApp", "myAwesomeLib"] },
    },
  })
  op getSelectors(): {
    @statusCode statusCode: 200;
    @body result: BaseResponse<string[]>;
  };

  @route("/locales")
  @extension(BadgesExtKey, BadgeComment<"Keep locales always up-to-date">)
  @summary("Get available locales")
  @doc("""
      Retrieve all available locales supported by the i18n system.
            
      This endpoint returns an array of locale objects containing information about supported languages and regions.
    """)
  @get
  op getLocales(): {
    @statusCode _: 200;
    @body result: BaseResponse<I18nLocale[]>;
  };
}
