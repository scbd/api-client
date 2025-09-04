import { startCase } from 'lodash-es';
import { ofetch } from "ofetch";
import type { $Fetch } from "ofetch";

const defaultErrorHandler = ({ request, options, response, error }: any) => {
  let statusCode = response?.status;
  let code = response?.statusText || error?.code || error?.cause?.code;
  let cause = error;
  let message = `${error}`;
  let field;

  const contentType = response?.headers.get("content-type");

  if (contentType == "application/json") {
    const data = response?._data;
    statusCode = data.statusCode || statusCode;
    code = data.code || code;
    field = data.field;
    message = data.message || data.Message;
  } else if (contentType?.startsWith("text")) {
    message = response?._data;
  }

  if (!message) {
    message = 'UNKNOWN ERROR';
  }

  throw new ApiError({ code, statusCode, field, message, cause });
}

const defaultInterceptors = {
  // TODO: this is speculative, need to clarify 
  onResponse({ request, options, response }: any) {
    const contentType = response.headers.get("content-type");
    
    if (contentType == "application/json") {
      const { error, rest } = response._data;
      if (error) {
        throw new ApiError(rest);
      }
    }
  },
  onResponseError: defaultErrorHandler,
  onRequestError: defaultErrorHandler,
}

export const interceptorChain = (parent: any, self: any) => {
  return async (...params: any) => {
    try {
      parent && await parent(...params);
      self && await self(...params);
    } catch (error) {
      console.error("interceptorChain error", error);
      throw error;
    }
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

const httpStatusCodes = [
  { code: 'badRequest', statusCode: 400 },
  { code: 'mandatory', statusCode: 400 },
  { code: 'invalidParameter', statusCode: 400 },
  { code: 'unauthorized', statusCode: 401 },
  { code: 'forbidden', statusCode: 403 },
  { code: 'notFound', statusCode: 404 },
  { code: 'internalServerError', statusCode: 500 },
  { code: 'notImplemented', statusCode: 501 },
  { code: 'serviceUnavailable', statusCode: 503 },
];

type ApiErrorParams = { statusCode?: number, code?: string, field?: string, message?: string, cause?: any };
export class ApiError extends Error {
  code: string;
  statusCode: number;
  cause: any;
  message: string;
  fields: string[];

  constructor({ statusCode, code, field, message, cause }: ApiErrorParams) {
    console.log("ApiError", {
      statusCode, code, field, message, cause
    });


    let _code = code;
    let _statusCode = statusCode;
    let _cause = cause;

    if (_code) _statusCode = _statusCode || getDefaultStatusCode(_code);
    if (_statusCode) _code = _code || getDefaultCode(_statusCode);

    _statusCode = _statusCode || 500;
    _code = _code || 'internalServerError';

    super(_code); // TODO why does doing this swallow this.message?

    this.code = _code;
    this.statusCode = _statusCode;
    this.cause = _cause;
    this.message = message || startCase(_code);
    this.fields = field && [field] || []
  }

  toJSON() {
    const { cause, ...withoutCause } = this;
    return withoutCause;
  }

  static forbidden(message?: string, { ...params }: ApiErrorParams = {}) {
    return new ApiError({
      ...params,
      statusCode: 403,
      code: 'forbidden',
      message: message || 'Operation is not allowed',
    });
  }

  static notFound(message?: string, { ...params }: ApiErrorParams = {}) {
    return new ApiError({
      ...params,
      statusCode: 404,
      code: 'notFound',
      message: message || 'Not found',
    });
  }

  static invalidParameter(field: string, message?: string, { ...params }: ApiErrorParams = {}) {
    return new ApiError({
      ...params,
      statusCode: 400,
      code: 'invalidParameter',
      message: message || 'Invalid parameter value',
      field,
    });
  }

  static mandatory(field: string, message?: string, { ...params }: ApiErrorParams = {}) {
    return new ApiError({
      ...params,
      statusCode: 400,
      code: 'mandatory',
      message: message || 'Value is mandatory',
      field,
    });
  }

  static badRequest(message?: string, { code, ...params }: ApiErrorParams = {}) {
    return new ApiError({
      ...params,
      statusCode: 400,
      code: code || 'badRequest',
      message: message || 'Bad Request',
    });
  }

  static internalServerError(message?: string, { ...params }: ApiErrorParams = {}) {
    return new ApiError({
      ...params,
      statusCode: 500,
      code: 'internalServerError',
      message: message || 'Internal Server Error',
    });
  }

  static serviceUnavailable(message?: string, { ...params }: ApiErrorParams = {}) {
    return new ApiError({
      ...params,
      statusCode: 503,
      code: 'serviceUnavailable',
      message: message || 'Service Unavailable',
    });
  }

  //= ===========================================================
  //
  // Extract SuperAgent / Ky / ApiError statusCode  
  //
  //= ===========================================================
  static getStatusCode(error: any) {
    let status = error?.status || error?.statusCode || error?.response?.status || error?.response?.statusCode || error;

    status = parseInt(status);

    if (isNaN(status)) status = getDefaultStatusCode(status)

    return status;
  }

  static isBadRequest = (error: any) => ApiError.getStatusCode(error) == 400;
  static isUnauthorized = (error: any) => ApiError.getStatusCode(error) == 401;
  static isForbidden = (error: any) => ApiError.getStatusCode(error) == 403;
  static isNotFound = (error: any) => ApiError.getStatusCode(error) == 404;
}

function getDefaultStatusCode(code: string) {
  const entry = httpStatusCodes.find((o) => o.code === code);
  return entry ? entry.statusCode : undefined;
}

function getDefaultCode(statusCode: number) {
  const entry = httpStatusCodes.find((o) => o.statusCode === statusCode);
  return entry ? entry.code : undefined;
}
