export default interface TemporaryFile {
  url: string;
  uid: string;
  hash: string;
  filename: string;
  size: number;
  contentType: string;
  metadata?: { [key: string]: string};
};
