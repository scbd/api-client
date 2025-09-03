"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaiaApi = void 0;
const lodash_1 = __importDefault(require("lodash"));
const api_base_1 = require("./api-base");
class GaiaApi extends api_base_1.ApiBase {
    constructor({ baseUrl, authorizationToken }) {
        super({
            baseURL: baseUrl,
            timeout: 30 * 1000,
            // TODO type
            async onRequest({ request, options }) {
                options.headers.set('Authorization', `${authorizationToken}`);
            }
        });
    }
    // TODO type
    toQuery({ adminTags, sort, limit }) {
        const q = {
            adminTags: {
                $all: (0, lodash_1.default)(['kronos']).union([adminTags])
                    .flatten()
                    .compact()
                    .uniq()
                    .value()
            }
        };
        const s = sort || { 'meta.updatedOn': -1 };
        const l = Math.max(limit || 1, 0) || 10;
        const f = {
            title: 1, content: 1, coverImage: 1, adminTags: 1
        };
        return {
            q, f, s, l
        };
    }
    // TODO type
    async queryArticles({ adminTags, sort, limit }) {
        const query = this.toQuery({ adminTags, sort, limit });
        const data = await this.fetch(`api/v2017/articles`, { query });
        return data;
    }
    async getArticle(id) {
        const data = await this.fetch(`api/v2017/articles/${id}`);
        return data;
    }
}
exports.GaiaApi = GaiaApi;
