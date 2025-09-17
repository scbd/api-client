import { StatusCodes, getReasonPhrase, getStatusCode, getStatusText } from "http-status-codes";
import camelCase from "lodash-es/camelCase.js";
import startCase from "lodash-es/startCase.js";
import type { FetchContext, FetchResponse } from "ofetch";

const customStatusCodes = [
  { code: "mandatory", statusCode: StatusCodes.BAD_REQUEST },
  { code: "invalidParameter", statusCode: StatusCodes.BAD_REQUEST },
];

type ApiErrorParams = { statusCode?: number | null, code?: string | null, field?: string, message?: string, cause?: any };

export default class ApiError extends Error {
  code: string;
  statusCode: number | null;
  cause: any;
  message: string;
  fields: string[];

  constructor({ statusCode, code, field, message, cause }: ApiErrorParams) {
    let _code = code;
    let _statusCode = statusCode;

    if (_code) _statusCode = _statusCode || getDefaultStatusCode(_code);
    if (_statusCode) _code = _code || getDefaultCode(_statusCode);

    _statusCode = _statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    _code = _code || "internalServerError";

    super(_code); // TODO why does doing this swallow this.message?

    this.code = _code;
    this.statusCode = _statusCode;
    this.cause = cause;
    this.message = message || getDefaultMessage(_statusCode) || startCase(_code);
    this.fields = (field && [field]) || [];
  }

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { cause, ...withoutCause } = this;
    return withoutCause;
  }
}

export function handleError({ response, error }: FetchContext & { response?: FetchResponse<any>, error?: ApiError }) {
  let statusCode = response?.status;
  let code = response?.statusText || error?.code || error?.cause?.code;
  let message = error && `${error}`;
  let field;

  const contentType = response?.headers.get("content-type");

  if (contentType == "application/json") {
    const data = response?._data;
    statusCode = data.statusCode || statusCode;
    code = data.code || code;
    field = data.field;
    message = data.message || data.Message;
  }
  else if (contentType?.startsWith("text")) {
    message = response?._data;
  }

  if (!message) {
    message = code || "Unknown error";
  }

  throw new ApiError({ code, statusCode, field, message, cause: error });
}

export function forbidden(message?: string, { ...params }: ApiErrorParams = {}) {
  return new ApiError({
    ...params,
    statusCode: StatusCodes.FORBIDDEN,
    code: "forbidden",
    message: message || "Operation is not allowed",
  });
}

export function unauthorized(message?: string, { ...params }: ApiErrorParams = {}) {
  return new ApiError({
    ...params,
    statusCode: StatusCodes.UNAUTHORIZED,
    code: "unauthorized",
    message: message || "Unauthorized",
  });
}

export function notFound(message?: string, { ...params }: ApiErrorParams = {}) {
  return new ApiError({
    ...params,
    statusCode: StatusCodes.NOT_FOUND,
    code: "notFound",
    message: message || "Not found",
  });
}

export function invalidParameter(field: string, message?: string, { ...params }: ApiErrorParams = {}) {
  return new ApiError({
    ...params,
    statusCode: StatusCodes.BAD_REQUEST,
    code: "invalidParameter",
    message: message || "Invalid parameter value",
    field,
  });
}

export function mandatory(field: string, message?: string, { ...params }: ApiErrorParams = {}) {
  return new ApiError({
    ...params,
    statusCode: StatusCodes.BAD_REQUEST,
    code: "mandatory",
    message: message || "Value is mandatory",
    field,
  });
}

export function badRequest(message?: string, { code, ...params }: ApiErrorParams = {}) {
  return new ApiError({
    ...params,
    statusCode: StatusCodes.BAD_REQUEST,
    code: code || "badRequest",
    message: message || "Bad Request",
  });
}

export function internalServerError(message?: string, { ...params }: ApiErrorParams = {}) {
  return new ApiError({
    ...params,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    code: "internalServerError",
    message: message || "Internal Server Error",
  });
}

export function serviceUnavailable(message?: string, { ...params }: ApiErrorParams = {}) {
  return new ApiError({
    ...params,
    statusCode: StatusCodes.SERVICE_UNAVAILABLE,
    code: "serviceUnavailable",
    message: message || "Service Unavailable",
  });
}

// = ===========================================================
//
// Extract SuperAgent / Ky / ApiError statusCode
//
// = ===========================================================
export function extractStatusCode(error: any) {
  let status = error?.status || error?.statusCode || error?.response?.status || error?.response?.statusCode || error;

  status = parseInt(status);

  if (isNaN(status)) status = getDefaultStatusCode(status);

  return status;
}

export const isBadRequest = (error: any) => extractStatusCode(error) == StatusCodes.BAD_REQUEST;
export const isUnauthorized = (error: any) => extractStatusCode(error) == StatusCodes.UNAUTHORIZED;
export const isForbidden = (error: any) => extractStatusCode(error) == StatusCodes.FORBIDDEN;
export const isNotFound = (error: any) => extractStatusCode(error) == StatusCodes.NOT_FOUND;

function getDefaultStatusCode(code: string) {
  try {
    const entry = customStatusCodes.find((o: any) => o.code === code);
    return entry ? entry.statusCode : getStatusCode(startCase(code));
  }
  catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return null;
  }
}

function getDefaultCode(statusCode: number) {
  try {
    const entry = customStatusCodes.find((o: any) => o.statusCode === statusCode);
    return entry ? entry.code : camelCase(getStatusText(statusCode));
  }
  catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return null;
  }
}

function getDefaultMessage(statusCode: number) {
  try {
    return getReasonPhrase(statusCode);
  }
  catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return null;
  }
}
