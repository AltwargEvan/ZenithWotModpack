export function cleanFilename(filename: string) {
  return filename.replace(/([^a-z0-9 ._-]+)/gi, "");
}
