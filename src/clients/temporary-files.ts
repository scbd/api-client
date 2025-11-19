import ApiBase from "../api-base";
import { handleError } from "../api-error";

export default class TemporaryFilesApi extends ApiBase {
  constructor(opts: { token: string, baseURL: string }) {
    super({
      onRequest: ({ options }: { request: any, options: any }) => {
        options.headers = { Authorization: `${opts.token}` }
      },
      onResponseError: handleError, 
      ...opts
    })
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
      ...options,
    });

    if (!prepareRes.url) throw new Error(`field missing from response: url`);
    
    if (!prepareRes.uid) throw new Error(`field missing from response: uid`);

    // step 2: upload to the url

    await this.fetch(prepareRes.url, {
      method: "PUT",
      body: file,
      // overwrite so that we don't provide auth token
      onRequest: ({ options }: { request: any, options: any }) => {
        options.headers = { contentType }
      },
      ...options,
    });

    // step 3: get the file data

    return this.get(prepareRes.uid, options);
  }

  async get(uid: string, options: any = {}) {
    return this.fetch(`/api/v2015/temporary-files/${encodeURIComponent(uid)}`, options);
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