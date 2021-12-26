import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { BaseMongo } from 'src/common/dto';
import { BaseSchema } from 'src/decorators';

export type LatestSignatureDocument = LatestSignature & Document;

@BaseSchema()
export class LatestSignature extends BaseMongo {
  @Prop({ required: true, unique: true })
  programPk: string;

  @Prop({ required: true })
  signature: string;
}

export const LatestSignatureSchema = SchemaFactory.createForClass(LatestSignature);

LatestSignatureSchema.plugin(mongooseLeanVirtuals);
