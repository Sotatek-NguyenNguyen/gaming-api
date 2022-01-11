import { NftItemStatus } from '../enum';

export interface INftFilter {
  page: number;

  pageSize: number;

  userAddress?: string;

  address?: string;

  gameItemId?: string;

  status?: NftItemStatus;
}
