import { ApiBase } from './api-base';
export declare class GaiaApi extends ApiBase {
    constructor({ baseUrl, authorizationToken }: any);
    toQuery({ adminTags, sort, limit }: any): {
        q: {
            adminTags: {
                $all: string[];
            };
        };
        f: {
            title: number;
            content: number;
            coverImage: number;
            adminTags: number;
        };
        s: any;
        l: number;
    };
    queryArticles({ adminTags, sort, limit }: any): Promise<any>;
    getArticle(id: string): Promise<any>;
}
