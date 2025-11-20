import ApiBase from "../api-base";
import { handleError } from "../api-error";

export default class TemporaryFilesApi extends ApiBase {
  #token: string;

  constructor(opts: { token: string, baseURL: string }) {
    super({
      onResponseError: handleError,
      ...opts
    });

    this.#token = opts.token;
  }

  async upload(file: File, options: any = {}) {
    const contentType = getMimeType(file);
    const filename = file.name;

    // step 1: prepare

    const prepareRes = await this.fetch('/api/v2015/temporary-files', {
      method: "POST",
      body: {
        filename,
        contentType,
      },
      headers: { Authorization: `${this.#token}` },
      ...options,
    });

    // step 2: upload to the url

    await this.fetch(prepareRes.url, {
      method: "PUT",
      body: file,
      ...options,
    });

    // step 3: get the file data

    return this.get(prepareRes.uid, options);
  }

  async get(uid: string, options: any = {}) {
    return this.fetch(`/api/v2015/temporary-files/${encodeURIComponent(uid)}`, {
      headers: { Authorization: `${this.#token}` },
      ...options
    });
  }
}

function getMimeType(file: File) {
  const filename = file.name
  const sMimeType = file.type || "application/octet-stream";

  if (filename && sMimeType == "application/octet-stream") {
    if (/\.(?:geo)?json$/.test(filename)) return "application/json";
    if (/\.xml$/.test(filename)) return "application/xml";
  }

  return sMimeType;
}