import ApiBase from "../api-base";
import { handleError } from "../api-error";

export default class TemporaryFilesApi extends ApiBase {
  #token: string;

  constructor({ token, baseURL }: { token: string, baseURL: string }) {
    super({
      onResponseError: handleError,
      baseURL,
    });

    this.#token = token;
  }

  async upload(file: File, metadata?: any) {
    const contentType = getMimeType(file);
    const filename = file.name;

    // step 1: prepare

    const prepareRes = await this.fetch('/api/v2015/temporary-files', {
      method: "POST",
      body: {
        filename,
        contentType,
        ...metadata,
      },
      headers: { Authorization: `${this.#token}` },
    });

    // step 2: upload to the url

    await this.fetch(prepareRes.url, {
      method: "PUT",
      body: file,
    });

    // step 3: get the file data

    return this.get(prepareRes.uid);
  }

  async get(uid: string) {
    return this.fetch(`/api/v2015/temporary-files/${encodeURIComponent(uid)}`, {
      headers: { Authorization: `${this.#token}` },
    });
  }
}

export function getMimeType(file: File) {
  const filename = file.name
  const sMimeType = file.type || "application/octet-stream";

  if (filename && sMimeType == "application/octet-stream") {
    if (/\.(?:geo)?json$/.test(filename)) return "application/json";
    if (/\.xml$/.test(filename)) return "application/xml";
  }

  return sMimeType;
}