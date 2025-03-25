import "@typespec/openapi3";

using TypeSpec.OpenAPI;

@example(i18nResourceExample)
model I18nResource {
  /**
   * Resource bundle identifier
   */
  selector: string;

  /**
   * Language identifier according application locales
   */
  langTag: string;

  /**
   * Json object with i18n entries
   */
  bundle: Record<unknown>;

  /**
   * True if resource is provided by application, false if it's created by customer
   */
  default: boolean;
}

const i18nResourceExample: I18nResource = #{
  selector: "reportingApp",
  langTag: "it-IT",
  bundle: #{ key1: #{ key2: "Label per key 2" }, key3: "Label per key 3" },
  default: true,
};

@example(i18nResourceCustomExample)
model I18nResourceCustom extends I18nResource {
  /**
   * It is always false for custom resource
   */
  default: false;

  /**
   * It is a timestamp of creation server-side (YYYY-MM-DD[T]HH:mm:ss)
   */
  createdAt: string;

  /**
   * It is a timestamp of last update server-side (YYYY-MM-DD[T]HH:mm:ss)
   */
  updatedAt?: string;
}

const i18nResourceCustomExample: I18nResourceCustom = #{
  selector: "reportingApp",
  langTag: "it-IT",
  bundle: #{ key1: #{ key2: "Label custom per key 2" }, key3: "Label per key 3" },
  default: false,
  createdAt: "2024-12-03T10:45:00",
  updatedAt: "2024-12-04T16:27:00",
};

@oneOf
union I18nResponseOneOf {
  resource: I18nResource,
  resourceCustom: I18nResourceCustom,
}
