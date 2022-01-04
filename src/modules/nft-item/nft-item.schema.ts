import { AutoMap } from '@automapper/classes';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { BaseMongo } from 'src/common/dto';
import { BaseSchema } from 'src/decorators';

export type NftItemDocument = NftItem & Document;

@BaseSchema()
export class NftItem extends BaseMongo {
  @Prop({ required: true, index: true })
  @AutoMap()
  userAddress: string;

  @Prop({ required: true, unique: true })
  @AutoMap()
  gameItemId: string;

  @Prop({ unique: true })
  @AutoMap()
  address?: string;
}

export const NftItemSchema = SchemaFactory.createForClass(NftItem);

NftItemSchema.plugin(mongooseLeanVirtuals);
