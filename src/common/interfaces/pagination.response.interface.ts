export interface IDataWithPagination<T = any> {
  data: T[];

  total: number;

  page: number;

  pageSize: number;

  totalPage: number;
}
