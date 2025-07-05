import "@typespec/http";
import "../../consts/example.const.tsp";
import "../../model/base-response.model.tsp";
import "../../model/i18n-resource.model.tsp";

using TypeSpec.Http;

interface AdminBundleRoute {
  @route("/bundle")
  @summary("Get bundle resource")
  @doc("""
      Get default and custom bundle resources.
    
      The service will return a list of two elements: **default** bundle resource and **custom** bundle resource (if any).
    """)
  @get
  @opExample(#{ parameters: #{ selector: EXAMPLE_SELECTOR, langTag: EXAMPLE_LANG_TAG } })
  getBundle(@query selector: string, @query langTag: string): {
    @statusCode _: 200;
    @body result: BaseResponse<(I18nResourceCustom | I18nResource)[]>;
  };

  @route("/bundle")
  @summary("Create bundle resource")
  @doc("""
      Create a new custom bundle resource.
    
      The service will force **default** attribute to false and set **createdAt** attribute on resource.
    """)
  @post
  @opExample(#{
    returnType: #{
      statusCode: 200,
      result: #{ state: #{ code: 0 }, result: i18nResourceCustomExample },
    },
  })
  createBundle(@body resource: I18nResource): {
    @statusCode statusCode: 200;
    @body result: BaseResponse<I18nResourceCustom>;
  };

  @route("/bundle")
  @summary("Delete bundle resource")
  @doc("""
      Delete a custom bundle resource.
    
      The service responds with number of deletions performed (typically "1" for a single resource deletion).
    """)
  @delete
  @opExample(#{
    parameters: #{ selector: EXAMPLE_SELECTOR, langTag: EXAMPLE_LANG_TAG },
    returnType: #{ statusCode: 200, result: #{ state: #{ code: 0 }, result: 0 } },
  })
  deleteBundle(@query selector: string, @query langTag: string): {
    @statusCode statusCode: 200;
    @body result: BaseResponse<0 | 1>;
  };

  @route("/bundle")
  @summary("Update bundle resource")
  @doc("""
      Update a custom bundle resource.
    
      This operation allows you to modify an existing custom bundle resource. The service will:
      - Validate the updated resource content
      - Replace the previous content
      - Return the number of successful updates performed (typically "1" for a single resource update)
      
      **Note:** Only custom bundles can be updated. System bundles are read-only.
    """)
  @put
  @opExample(#{ returnType: #{ statusCode: 200, result: #{ state: #{ code: 0 }, result: 1 } } })
  updateBundle(): {
    @statusCode statusCode: 200;
    @body result: BaseResponse<0 | 1>;
  };
}
