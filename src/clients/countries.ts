import ApiBase from '../api-base';
import { handleError } from "../api-error"
import type MongoFilters from '../types/mongo-filters';
import { toMongoQuery } from '../utils/mongo-filters';

export default class CountriesApi extends ApiBase {
  constructor({ token, baseURL }: { token: string, baseURL: string }) {
    super({
      onRequest: ({ options }: { request: any, options: any }) => {
        options.headers = { "Authorization": `${token}` }
      },
      onResponseError: handleError, 
      baseURL,
    })
  }

  async getCountries(options: MongoFilters & any = {}) {
    const { query, project, sort, skip, limit, count, firstOne, aggregate } = options;
    const mongoQuery = toMongoQuery({ query, project, sort, skip, limit, count, firstOne, aggregate });

    return this.fetch('/api/v2013/countries', { query: mongoQuery });
  }

  async getCountry(code: string) {
    return this.fetch(`/api/v2013/countries/${encodeURIComponent(code)}`);
  }  
}
