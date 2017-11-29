export const unsavedPath = '[unsaved]';

export function isUnsaved(file) {
  return !file || file.path === unsavedPath;
}