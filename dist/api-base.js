"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ApiBase_fetch, _ApiBase_opts;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.ApiBase = exports.interceptorChains = exports.interceptorChain = void 0;
const lodash_es_1 = require("lodash-es");
const ofetch_1 = require("ofetch");
const defaultErrorHandler = ({ request, options, response, error }) => {
    var _a;
    let statusCode = response === null || response === void 0 ? void 0 : response.status;
    let code = (response === null || response === void 0 ? void 0 : response.statusText) || (error === null || error === void 0 ? void 0 : error.code) || ((_a = error === null || error === void 0 ? void 0 : error.cause) === null || _a === void 0 ? void 0 : _a.code);
    let cause = error;
    let message = `${error}`;
    let field;
    const contentType = response === null || response === void 0 ? void 0 : response.headers.get("content-type");
    if (contentType == "application/json") {
        const data = response === null || response === void 0 ? void 0 : response._data;
        statusCode = data.statusCode || statusCode;
        code = data.code || code;
        field = data.field;
        message = data.message || data.Message;
    }
    else if (contentType === null || contentType === void 0 ? void 0 : contentType.startsWith("text")) {
        message = response === null || response === void 0 ? void 0 : response._data;
    }
    if (!message) {
        message = 'UNKNOWN ERROR';
    }
    throw new ApiError({ code, statusCode, field, message, cause });
};
const defaultInterceptors = {
    onResponse({ request, options, response }) {
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
};
const interceptorChain = (parent, self) => {
    return async (...params) => {
        try {
            parent && await parent(...params);
            self && await self(...params);
        }
        catch (error) {
            console.error("interceptorChain error", error);
            throw error;
        }
    };
};
exports.interceptorChain = interceptorChain;
const interceptorChains = (parentOpts, opts) => {
    return {
        onRequest: (0, exports.interceptorChain)(parentOpts === null || parentOpts === void 0 ? void 0 : parentOpts.onRequest, opts === null || opts === void 0 ? void 0 : opts.onRequest),
        onRequestError: (0, exports.interceptorChain)(parentOpts === null || parentOpts === void 0 ? void 0 : parentOpts.onRequestError, opts === null || opts === void 0 ? void 0 : opts.onRequestError),
        onResponse: (0, exports.interceptorChain)(parentOpts === null || parentOpts === void 0 ? void 0 : parentOpts.onResponse, opts === null || opts === void 0 ? void 0 : opts.onResponse),
        onResponseError: (0, exports.interceptorChain)(parentOpts === null || parentOpts === void 0 ? void 0 : parentOpts.onResponseError, opts === null || opts === void 0 ? void 0 : opts.onResponseError),
    };
};
exports.interceptorChains = interceptorChains;
class ApiBase {
    constructor(opts) {
        _ApiBase_fetch.set(this, void 0);
        _ApiBase_opts.set(this, void 0);
        // @ts-ignore
        const myFetch = (globalThis.$fetch || ofetch_1.ofetch);
        __classPrivateFieldSet(this, _ApiBase_opts, {
            ...opts,
            ...(0, exports.interceptorChains)(defaultInterceptors, opts)
        }, "f");
        __classPrivateFieldSet(this, _ApiBase_fetch, myFetch.create(__classPrivateFieldGet(this, _ApiBase_opts, "f")), "f");
    }
    async fetch(url, opts) {
        return __classPrivateFieldGet(this, _ApiBase_fetch, "f").call(this, url, {
            ...opts,
            ...(0, exports.interceptorChains)(__classPrivateFieldGet(this, _ApiBase_opts, "f"), opts)
        });
    }
}
exports.ApiBase = ApiBase;
_ApiBase_fetch = new WeakMap(), _ApiBase_opts = new WeakMap();
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
class ApiError extends Error {
    constructor({ statusCode, code, field, message, cause }) {
        console.log("ApiError", {
            statusCode, code, field, message, cause
        });
        let _code = code;
        let _statusCode = statusCode;
        let _cause = cause;
        if (_code)
            _statusCode = _statusCode || getDefaultStatusCode(_code);
        if (_statusCode)
            _code = _code || getDefaultCode(_statusCode);
        _statusCode = _statusCode || 500;
        _code = _code || 'internalServerError';
        super(_code); // TODO why does doing this swallow this.message?
        this.code = _code;
        this.statusCode = _statusCode;
        this.cause = _cause;
        this.message = message || (0, lodash_es_1.startCase)(_code);
        this.fields = field && [field] || [];
    }
    toJSON() {
        const { cause, ...withoutCause } = this;
        return withoutCause;
    }
    static forbidden(message, { ...params } = {}) {
        return new ApiError({
            ...params,
            statusCode: 403,
            code: 'forbidden',
            message: message || 'Operation is not allowed',
        });
    }
    static notFound(message, { ...params } = {}) {
        return new ApiError({
            ...params,
            statusCode: 404,
            code: 'notFound',
            message: message || 'Not found',
        });
    }
    static invalidParameter(field, message, { ...params } = {}) {
        return new ApiError({
            ...params,
            statusCode: 400,
            code: 'invalidParameter',
            message: message || 'Invalid parameter value',
            field,
        });
    }
    static mandatory(field, message, { ...params } = {}) {
        return new ApiError({
            ...params,
            statusCode: 400,
            code: 'mandatory',
            message: message || 'Value is mandatory',
            field,
        });
    }
    static badRequest(message, { code, ...params } = {}) {
        return new ApiError({
            ...params,
            statusCode: 400,
            code: code || 'badRequest',
            message: message || 'Bad Request',
        });
    }
    static internalServerError(message, { ...params } = {}) {
        return new ApiError({
            ...params,
            statusCode: 500,
            code: 'internalServerError',
            message: message || 'Internal Server Error',
        });
    }
    static serviceUnavailable(message, { ...params } = {}) {
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
    static getStatusCode(error) {
        var _a, _b;
        let status = (error === null || error === void 0 ? void 0 : error.status) || (error === null || error === void 0 ? void 0 : error.statusCode) || ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) || ((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.statusCode) || error;
        status = parseInt(status);
        if (isNaN(status))
            status = getDefaultStatusCode(status);
        return status;
    }
}
exports.ApiError = ApiError;
ApiError.isBadRequest = (error) => ApiError.getStatusCode(error) == 400;
ApiError.isUnauthorized = (error) => ApiError.getStatusCode(error) == 401;
ApiError.isForbidden = (error) => ApiError.getStatusCode(error) == 403;
ApiError.isNotFound = (error) => ApiError.getStatusCode(error) == 404;
function getDefaultStatusCode(code) {
    const entry = httpStatusCodes.find((o) => o.code === code);
    return entry ? entry.statusCode : undefined;
}
function getDefaultCode(statusCode) {
    const entry = httpStatusCodes.find((o) => o.statusCode === statusCode);
    return entry ? entry.code : undefined;
}
