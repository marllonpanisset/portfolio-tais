/** True when the value looks like a Storage object path instead of a public URL or local asset. */
export function isStoragePath(value: string): boolean {
  return (
    value.length > 0 &&
    !value.startsWith("/") &&
    !value.startsWith("http://") &&
    !value.startsWith("https://")
  );
}
