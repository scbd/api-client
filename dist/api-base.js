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
exports.ApiBase = exports.interceptorChains = exports.interceptorChain = void 0;
const ofetch_1 = require("ofetch");
const defaultInterceptors = {
// TODO
};
const interceptorChain = (parent, self) => {
    return async (...params) => {
        parent && await parent(...params);
        self && await self(...params);
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
