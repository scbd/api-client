import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import startCase from 'lodash-es/startCase';
import type { FetchContext, FetchResponse } from 'ofetch';

const customStatusCodes = [
  { code: 'badRequest', statusCode: StatusCodes.BAD_REQUEST },
  { code: 'mandatory', statusCode: StatusCodes.BAD_REQUEST },
  { code: 'invalidParameter', statusCode: StatusCodes.BAD_REQUEST },
  { code: 'unauthorized', statusCode: StatusCodes.UNAUTHORIZED },
  { code: 'forbidden', statusCode: StatusCodes.FORBIDDEN },
  { code: 'notFound', statusCode: StatusCodes.NOT_FOUND },
  { code: 'internalServerError', statusCode: StatusCodes.INTERNAL_SERVER_ERROR },
  { code: 'notImplemented', statusCode: StatusCodes.NOT_IMPLEMENTED },
  { code: 'serviceUnavailable', statusCode: StatusCodes.SERVICE_UNAVAILABLE },
];

type ApiErrorParams = { statusCode?: number, code?: string, field?: string, message?: string, cause?: any };

export class ApiError extends Error {
  code: string;
  statusCode: number;
  cause: any;
  message: string;
  fields: string[];

  constructor({ statusCode, code, field, message, cause }: ApiErrorParams) {
    let _code = code;
    let _statusCode = statusCode;
    let _cause = cause;

    if (_code) _statusCode = _statusCode || getDefaultStatusCode(_code);
    if (_statusCode) _code = _code || getDefaultCode(_statusCode);

    _statusCode = _statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    _code = _code || 'internalServerError';

    super(_code); // TODO why does doing this swallow this.message?

    this.code = _code;
    this.statusCode = _statusCode;
    this.cause = _cause;
    this.message = message || getReasonPhrase(_statusCode) || startCase(_code);
    this.fields = field && [field] || []
  }

  static handleError = ({ response, error }: FetchContext & { response?: FetchResponse<any>, error?: ApiError }) => {
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

  toJSON() {
    const { cause, ...withoutCause } = this;
    return withoutCause;
  }

  static forbidden(message?: string, { ...params }: ApiErrorParams = {}) {
    return new ApiError({
      ...params,
      statusCode: StatusCodes.FORBIDDEN,
      code: 'forbidden',
      message: message || 'Operation is not allowed',
    });
  }

  static unauthorized(message?: string, { ...params }: ApiErrorParams = {}) {
    return new ApiError({
      ...params,
      statusCode: StatusCodes.UNAUTHORIZED,
      code: 'unauthorized',
      message: message || 'Unauthorized',
    });
  }

  static notFound(message?: string, { ...params }: ApiErrorParams = {}) {
    return new ApiError({
      ...params,
      statusCode: StatusCodes.NOT_FOUND,
      code: 'notFound',
      message: message || 'Not found',
    });
  }

  static invalidParameter(field: string, message?: string, { ...params }: ApiErrorParams = {}) {
    return new ApiError({
      ...params,
      statusCode: StatusCodes.BAD_REQUEST,
      code: 'invalidParameter',
      message: message || 'Invalid parameter value',
      field,
    });
  }

  static mandatory(field: string, message?: string, { ...params }: ApiErrorParams = {}) {
    return new ApiError({
      ...params,
      statusCode: StatusCodes.BAD_REQUEST,
      code: 'mandatory',
      message: message || 'Value is mandatory',
      field,
    });
  }

  static badRequest(message?: string, { code, ...params }: ApiErrorParams = {}) {
    return new ApiError({
      ...params,
      statusCode: StatusCodes.BAD_REQUEST,
      code: code || 'badRequest',
      message: message || 'Bad Request',
    });
  }

  static internalServerError(message?: string, { ...params }: ApiErrorParams = {}) {
    return new ApiError({
      ...params,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      code: 'internalServerError',
      message: message || 'Internal Server Error',
    });
  }

  static serviceUnavailable(message?: string, { ...params }: ApiErrorParams = {}) {
    return new ApiError({
      ...params,
      statusCode: StatusCodes.SERVICE_UNAVAILABLE,
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

  static isBadRequest = (error: any) => ApiError.getStatusCode(error) == StatusCodes.BAD_REQUEST;
  static isUnauthorized = (error: any) => ApiError.getStatusCode(error) == StatusCodes.UNAUTHORIZED;
  static isForbidden = (error: any) => ApiError.getStatusCode(error) == StatusCodes.FORBIDDEN;
  static isNotFound = (error: any) => ApiError.getStatusCode(error) == StatusCodes.NOT_FOUND;
}

function getDefaultStatusCode(code: string) {
  const entry = customStatusCodes.find((o) => o.code === code);
  return entry ? entry.statusCode : undefined;
}

function getDefaultCode(statusCode: number) {
  const entry = customStatusCodes.find((o) => o.statusCode === statusCode);
  return entry ? entry.code : undefined;
}
