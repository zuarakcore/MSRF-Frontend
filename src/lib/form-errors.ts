/** Helpers that make form validation errors visible on the fields themselves, not just in a toast. */

/** Red border for an invalid field; append to the field's normal classes. */
export const invalidClass = (error: string | undefined) =>
  error ? " border-destructive focus:border-destructive" : "";

/** aria props linking a field to its error message (render the message with id `${name}-error`). */
export const errorProps = (name: string, error: string | undefined) =>
  error ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` } : {};

/**
 * Focus the first field (in `order`) that has an error. Fields are found by id, so give each input,
 * or the element standing in for it (such as an upload drop zone with tabIndex={0}), the field's name as its id.
 */
export function focusFirstError(
  errors: Record<string, string | undefined>,
  order: readonly string[],
) {
  const first = order.find((name) => errors[name]);
  if (!first) return;
  // Wait a frame so newly rendered fields (and aria-invalid) are in the DOM.
  requestAnimationFrame(() => {
    const el = document.getElementById(first);
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  });
}
