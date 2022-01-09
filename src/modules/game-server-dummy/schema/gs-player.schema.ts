import { AutoMap } from '@automapper/classes';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { BaseMongo } from 'src/common/dto';
import { BaseSchema } from 'src/decorators';

export type GsPlayerDocument = GsPlayer & Document;

@BaseSchema()
export class GsPlayer extends BaseMongo {
  @Prop({})
  @AutoMap()
  walletAddress: string;

  @Prop({})
  @AutoMap()
  name: string;
}

export const GsPlayerSchema = SchemaFactory.createForClass(GsPlayer);

GsPlayerSchema.plugin(mongooseLeanVirtuals);
