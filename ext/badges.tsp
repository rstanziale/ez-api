/**
 * It accepts an array as a value
 */
alias BadgesExtKey = "x-badges";

/**
 * It accepts an object as a value
 * For blue badge, it accepts an object with custom label
 */
alias BadgesExtValue<Color = "green" | "orange" | "red" | "blue", Label extends string = string> = {
  color: Color;
  label: Label;
};

/**
 * Create a green badge with "New" as label
 */
const BadgeNew: BadgesExtValue = #{ color: "green", label: "New" };

/**
 * Create an orange badge with "Updated" as label
 */
const BadgeUpdated: BadgesExtValue = #{ color: "orange", label: "Updated" };

/**
 * Create a red badge with "Deprecated" as label
 */
const BadgeDeprecated: BadgesExtValue = #{ color: "red", label: "Deprecated" };
