type MongoQuerySortOption = -1 | 1;
type MongoQueryProjectionOption = 0 | 1;
type MongoQueryCountOption = 1;
type MongoQueryFirstOneOption = 1;

export default interface MongoQueryOptions {
  query?: any;
  projection?: { [field: string]: MongoQueryProjectionOption };
  sort?: { [field: string]: MongoQuerySortOption };
  skip?: number;
  limit?: number;
  count?: MongoQueryCountOption;
  firstOne?: MongoQueryFirstOneOption;
  aggregation?: any;
};

export interface MongoQueryStringOptions {
  q?: string;
  f?: string;
  s?: any;
  sk?: number;
  l?: number;
  c?: number;
  fo?: number;
  ag?: string;
};
