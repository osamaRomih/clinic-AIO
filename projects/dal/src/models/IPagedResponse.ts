export interface IPagedResponse<T> {
  items: T[];
  pageNumber: number;
  totalPages: number;
  totalCount:number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
