export interface JsdocOptions {
  jsdocParser: boolean;
  jsdocSpaces: number;
  jsdocPrintWidth?: number;
  jsdocDescriptionWithDot: boolean;
  jsdocDescriptionTag: boolean;
  jsdocVerticalAlignment: boolean;
  jsdocKeepUnParseAbleExampleIndent: boolean;
  /** Default is true. */
  jsdocSingleLineComment: boolean;
  jsdocSeparateReturnsFromParam: boolean;
  jsdocSeparateTagGroups: boolean;
  jsdocAddDefaultToDescription: boolean;
  jsdocCapitalizeDescription: boolean;
  jsdocPreferCodeFences: boolean;
  tsdoc: boolean;
}
