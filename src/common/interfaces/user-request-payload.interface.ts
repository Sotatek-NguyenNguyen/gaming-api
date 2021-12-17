import { UserRole } from '../constant';

export interface IUserPayload {
  userId: string;

  address: string;

  role: UserRole;
}
