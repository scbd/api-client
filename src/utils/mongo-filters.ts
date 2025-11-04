import { default as MongoFiltersOptions, MongoQueryString } from '../types/mongo-filters';

export const toMongoQuery = (options: MongoFiltersOptions): MongoQueryString => {
  const ret = {} as MongoQueryString;

  if (options.query) ret.q = JSON.stringify(options.query);
  if (options.project) ret.f = JSON.stringify(options.project);
  if (options.sort) ret.s = options.sort;
  if (options.skip) ret.sk = options.skip;
  if (options.limit) ret.l = options.limit;
  if (options.count) ret.c = 1;
  if (options.firstOne) ret.fo = 1;
  if (options.aggregate) ret.ag = JSON.stringify(options.aggregate);

  return ret;
}
