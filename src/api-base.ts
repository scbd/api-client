import { ofetch } from "ofetch";
import type { $Fetch } from "ofetch";

const defaultInterceptors = {
  // TODO
}

export const interceptorChain = (parent: any, self: any) => {
  return async (...params: any) => {
    parent && await parent(...params);
    self && await self(...params);
  }
}

export const interceptorChains = (parentOpts?: any, opts?: any) => {
  return {
    onRequest: interceptorChain(parentOpts?.onRequest, opts?.onRequest),
    onRequestError: interceptorChain(parentOpts?.onRequestError, opts?.onRequestError),
    onResponse: interceptorChain(parentOpts?.onResponse, opts?.onResponse),
    onResponseError: interceptorChain(parentOpts?.onResponseError, opts?.onResponseError),
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
      ...interceptorChains(defaultInterceptors, opts)
    };
    this.#fetch = myFetch.create(this.#opts);
  }

  async fetch(url: string, opts?: any) {
    return this.#fetch(url, {
      ...opts,
      ...interceptorChains(this.#opts, opts)
    })
  }
}
