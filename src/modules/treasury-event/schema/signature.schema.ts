import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { BaseMongo } from 'src/common/dto';
import { BaseSchema } from 'src/decorators';

export type SignatureDocument = Signature & Document;

@BaseSchema()
export class Signature extends BaseMongo {
  @Prop({ required: true, unique: true })
  signature: string;

  @Prop({ required: true, index: true })
  slot: string;
}

export const SignatureSchema = SchemaFactory.createForClass(Signature);

SignatureSchema.plugin(mongooseLeanVirtuals);
