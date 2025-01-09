export interface IPagination {
  page: number;
  limit: number;
  totalPage: number;
  total: number;
  nextPage: string | null;
  prevPage: string | null;
}

export interface IQueryOptions {
  page?: number;
  limit?: number;
  sortType?: "asc" | "desc";
  sortBy?: string;
  search?: string;
  fields?: string;
  filter?: { [key: string]: string };
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: IPagination;
}
