export function getFileExtension(filename: string) {
  const fileExtension = filename.split(".").pop();
  if (!fileExtension)
    throw new Error("Unable to parse file extension from downloadURL");
  return fileExtension;
}
