import ApiBase from '../api-base';
import { handleError } from "../api-error"
import type MongoFilters from '../types/mongo-filters';
import { toMongoQuery } from '../utils/mongo-filters';

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

  async getCountries(options: MongoFilters & any = {}) {
    const { query, project, sort, skip, limit, count, firstOne, aggregate, ...rest } = options;
    const mongoQuery = toMongoQuery({ query, project, sort, skip, limit, count, firstOne, aggregate });

    return this.fetch('/api/v2013/countries', { query: mongoQuery, ...rest });
  }

  async getCountry(code: string, options: any = {}) {

    return this.fetch(`/api/v2013/countries/${encodeURIComponent(code)}`, options);
  }  
}
