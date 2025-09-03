"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThingApi = void 0;
const api_base_1 = require("./api-base");
class ThingApi extends api_base_1.ApiBase {
    constructor(opts) {
        super(opts);
    }
    async getThings(page) {
        return this.fetch(`/api/things?page=${page || 0}`);
    }
}
exports.ThingApi = ThingApi;
