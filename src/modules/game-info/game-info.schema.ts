import { AutoMap } from '@automapper/classes';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { BaseMongo } from 'src/common/dto';
import { BaseSchema } from 'src/decorators';

export type GameInfoDocument = GameInfo & Document;

@BaseSchema()
export class GameInfo extends BaseMongo {
  @Prop({})
  @AutoMap()
  name: string;

  @Prop({})
  @AutoMap()
  videoIntroURL: string;

  @Prop({})
  @AutoMap()
  logoURL: string;

  @Prop({})
  @AutoMap()
  backgroundURL: string;

  @Prop({})
  @AutoMap()
  description: string;

  @Prop({})
  @AutoMap()
  gameURL: string;
}

export const GameInfoSchema = SchemaFactory.createForClass(GameInfo);

GameInfoSchema.plugin(mongooseLeanVirtuals);
