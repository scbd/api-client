import _ from 'lodash';
import { ApiBase } from './api-base'

export class GaiaApi extends ApiBase {
  constructor({ baseUrl, authorizationToken }: any) {
    super({
      baseURL: baseUrl, // inconsistent casing 😡
      timeout: 30 * 1000, // 30 sec
      // TODO type
      async onRequest({ request, options }: any) {
        options.headers.set('Authorization', `${authorizationToken}`)
      }
    });
  }

  // TODO type
  toQuery({ adminTags, sort, limit }: any) {
    const q = {
      adminTags: {
        $all: _(['kronos']).union([adminTags])
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
    }
  }

  // TODO type
  async queryArticles({ adminTags, sort, limit }: any) {
    const query = this.toQuery({ adminTags, sort, limit });

    const data = await this.fetch(`api/v2017/articles`, { query });

    return data;
  }

  async getArticle(id: string) {
    const data = await this.fetch(`api/v2017/articles/${id}`);

    return data;
  }
}
