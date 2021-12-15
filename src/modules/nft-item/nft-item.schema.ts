import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { BaseMongo } from 'src/common/dto';
import { BaseSchema } from 'src/decorators';

export type NftItemDocument = NftItem & Document;

@BaseSchema()
export class NftItem extends BaseMongo {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  referenceId: string;

  @Prop()
  address?: string;
}

export const NftItemSchema = SchemaFactory.createForClass(NftItem);

NftItemSchema.plugin(mongooseLeanVirtuals);
