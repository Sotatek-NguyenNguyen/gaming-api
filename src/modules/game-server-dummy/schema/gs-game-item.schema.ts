import { AutoMap } from '@automapper/classes';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { BaseMongo } from 'src/common/dto';
import { BaseSchema } from 'src/decorators';

export type GsGameItemDocument = GsGameItem & Document;

@BaseSchema()
export class GsGameItem extends BaseMongo {
  @Prop({ required: true })
  @AutoMap()
  name: string;

  @Prop({ required: true })
  @AutoMap()
  userAddress: string;

  @Prop({ required: true })
  @AutoMap()
  image: string;
}

export const GsGameItemSchema = SchemaFactory.createForClass(GsGameItem);

GsGameItemSchema.plugin(mongooseLeanVirtuals);
