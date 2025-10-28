import { default as MongoQueryOptions, MongoQueryStringOptions } from '../types/mongo-query';

export const toMongoQuery = (options: MongoQueryOptions): MongoQueryStringOptions => {
  const ret = {} as MongoQueryStringOptions;

  if (options.query) ret.q = JSON.stringify(options.query);
  if (options.projection) ret.f = JSON.stringify(options.projection);
  if (options.sort) ret.s = options.sort;
  if (options.skip) ret.sk = options.skip;
  if (options.limit) ret.l = options.limit;
  if (options.count) ret.c = 1;
  if (options.firstOne) ret.fo = 1;
  if (options.aggregation) ret.ag = JSON.stringify(options.aggregation);

  return ret;
}
