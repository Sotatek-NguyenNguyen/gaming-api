import { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../constant';

export interface IJwtPayload extends JwtPayload {
  address: string;

  role: UserRole;
}
