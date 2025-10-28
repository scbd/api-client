import ApiBase from '../api-base';
import { handleError } from "../api-error"
import type MongoQueryOptions from '../types/mongo-query';
import { toMongoQuery } from '../utils/mongo-query';

export default class CountriesApi extends ApiBase {
  constructor(opts: { token: string, baseURL: string }) {
    super({
      onRequest: ({ options }: { request: any, options: any }) => {
        options.headers = { "Authorization": `${opts.token}` }
      },
      onResponseError: handleError, 
      ...opts
    })
  }

  async getCountries(options: MongoQueryOptions & any = {}) {
    const { query, projection, sort, skip, limit, count, firstOne, aggregation, ...rest } = options;
    let mongoQuery = toMongoQuery({ query, projection, sort, skip, limit, count, firstOne, aggregation });

    return this.fetch('/api/v2013/countries', { query: mongoQuery, ...rest });
  }

  async getCountry(code: string, options: any = {}) {

    return this.fetch(`/api/v2013/countries/${encodeURIComponent(code)}`, options);
  }  
}
