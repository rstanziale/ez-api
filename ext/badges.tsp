/**
 * It accepts an array as a value
 */
alias BadgesExtKey = "x-badges";

/**
 * Create a green badge with "New" as label
 */
alias BadgeNew = {
  color: "green";
  label: "New";
};

/**
 * Create an orange badge with "Updated" as label
 */
alias BadgeUpdated = {
  color: "orange";
  label: "Updated";
};

/**
 * Create a red badge with "Deprecated" as label
 */
alias BadgeDeprecated = {
  color: "red";
  label: "Deprecated";
};

/**
 * Create a blue badge with a custom text as label
 */
alias BadgeComment<T extends string> = {
  color: "blue";
  label: T;
};
