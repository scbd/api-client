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
