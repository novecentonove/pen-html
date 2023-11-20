export type FileType = {
  children?: Array<FileType>,
  name: string,
  path: string,
}