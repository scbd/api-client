type SortOption = -1 | 1;
type ProjectOption = 0 | 1;
type CountOption = 1;
type FirstOneOption = 1;

export default interface MongoFilters {
  query?: any;
  project?: { [field: string]: ProjectOption };
  sort?: { [field: string]: SortOption };
  skip?: number;
  limit?: number;
  count?: CountOption;
  firstOne?: FirstOneOption;
  aggregate?: any;
};

export interface MongoQueryString {
  q?: string;
  f?: string;
  s?: any;
  sk?: number;
  l?: number;
  c?: number;
  fo?: number;
  ag?: string;
};
