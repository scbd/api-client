import { ApiBase } from './api-base';
export declare class ThingApi extends ApiBase {
    constructor(opts: any);
    getThings(page?: number): Promise<any>;
}
