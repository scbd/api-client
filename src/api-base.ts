import { ofetch } from "ofetch";
import type { $Fetch, FetchHooks, ResponseType } from "ofetch";

const concatInterceptors = (parentOpts?: FetchHooks<any, ResponseType>, opts?: any) => {
  return {
    onRequest: [parentOpts?.onRequest, opts?.onRequest].flat().filter(Boolean),
    onRequestError: [parentOpts?.onRequestError, opts?.onRequestError].flat().filter(Boolean),
    onResponse: [parentOpts?.onResponse, opts?.onResponse].flat().filter(Boolean),
    onResponseError: [parentOpts?.onResponseError, opts?.onResponseError].flat().filter(Boolean),
  }
}

export class ApiBase {
  #fetch: $Fetch;
  #opts: any;

  constructor(opts?: any) {
    // @ts-ignore
    const myFetch = (globalThis.$fetch || ofetch) as $Fetch;

    this.#opts = opts;
    this.#fetch = myFetch.create(this.#opts);
  }

  async fetch(url: string, opts?: any) {
    return this.#fetch(url, {
      ...opts,
      ...concatInterceptors(this.#opts, opts),
    })
  }
}
