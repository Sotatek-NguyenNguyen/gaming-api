import { AutoMap } from '@automapper/classes';

export class BaseMongo {
  @AutoMap()
  id: string;

  @AutoMap()
  createdAt: string;

  @AutoMap()
  updatedAt: string;
}
