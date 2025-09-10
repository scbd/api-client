import { ofetch } from "ofetch";
import type { $Fetch, FetchHooks, FetchContext, FetchResponse, ResponseType } from "ofetch";
import { ApiError } from './api-error'

const defaultInterceptors = {
  // TODO: this is speculative, need to clarify 
  onResponse({ response }: FetchContext & { response: FetchResponse<any> }) {
    const contentType = response.headers.get("content-type");
    
    if (contentType == "application/json") {
      const { error, rest } = response._data;
      if (error) {
        throw new ApiError(rest);
      }
    }
  },
  onResponseError: ApiError.handleError,
  onRequestError: ApiError.handleError,
}
  
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

    this.#opts = {
      ...opts,
      // @ts-ignore we use same handler for onRequestError and onResponseError but treat optional error and response keys
      ...concatInterceptors(defaultInterceptors, opts),
    };
    this.#fetch = myFetch.create(this.#opts);
  }

  async fetch(url: string, opts?: any) {
    return this.#fetch(url, {
      ...opts,
      ...concatInterceptors(this.#opts, opts),
    })
  }
}
