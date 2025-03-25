@example(i18nLocaleExample)
model I18nLocale {
  /**
   * Language identifier according application locales
   */
  langTag: string;

  /**
   * Language description according langTag
   */
  language: string;

  /**
   * Base64 representation of the flag image
   */
  flag: string;
}

const i18nLocaleExample: I18nLocale = #{
  langTag: "it-IT",
  language: "Italiano",
  flag: "data:image/png;base64,iVBOR...0D",
};
