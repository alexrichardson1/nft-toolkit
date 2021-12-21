/**
 * Checks if `value` is undefined. Used for type narrowing from `T | undefined` to `T`
 * @param value - Any value
 * @param message - Error message if value is `undefined`
 * @throws - Error with `message`
 * @returns `value` with type T
 */
export const undefinedCheck = <T>(value: T | undefined, message: string): T => {
  if (value === void 0) {
    throw new Error(message);
  }
  return value;
};
