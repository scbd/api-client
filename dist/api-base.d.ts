export declare const interceptorChain: (parent: any, self: any) => (...params: any) => Promise<void>;
export declare const interceptorChains: (parentOpts?: any, opts?: any) => {
    onRequest: (...params: any) => Promise<void>;
    onRequestError: (...params: any) => Promise<void>;
    onResponse: (...params: any) => Promise<void>;
    onResponseError: (...params: any) => Promise<void>;
};
export declare class ApiBase {
    #private;
    constructor(opts?: any);
    fetch(url: string, opts?: any): Promise<any>;
}
type ApiErrorParams = {
    statusCode?: number;
    code?: string;
    field?: string;
    message?: string;
    cause?: any;
};
export declare class ApiError extends Error {
    code: string;
    statusCode: number;
    cause: any;
    message: string;
    fields: string[];
    constructor({ statusCode, code, field, message, cause }: ApiErrorParams);
    toJSON(): Omit<this, "cause" | "toJSON">;
    static forbidden(message?: string, { ...params }?: ApiErrorParams): ApiError;
    static notFound(message?: string, { ...params }?: ApiErrorParams): ApiError;
    static invalidParameter(field: string, message?: string, { ...params }?: ApiErrorParams): ApiError;
    static mandatory(field: string, message?: string, { ...params }?: ApiErrorParams): ApiError;
    static badRequest(message?: string, { code, ...params }?: ApiErrorParams): ApiError;
    static internalServerError(message?: string, { ...params }?: ApiErrorParams): ApiError;
    static serviceUnavailable(message?: string, { ...params }?: ApiErrorParams): ApiError;
    static getStatusCode(error: any): any;
    static isBadRequest: (error: any) => boolean;
    static isUnauthorized: (error: any) => boolean;
    static isForbidden: (error: any) => boolean;
    static isNotFound: (error: any) => boolean;
}
export {};
