import { AutoMap } from '@automapper/classes';

export class BaseMongo {
  _id: string;

  @AutoMap()
  id: string;

  @AutoMap()
  createdAt: string;

  @AutoMap()
  updatedAt: string;
}
