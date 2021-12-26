import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { BaseMongo } from 'src/common/dto';
import { BaseSchema } from 'src/decorators';

export type TreasuryEventDocument = TreasuryEvent & Document;

@BaseSchema()
export class TreasuryEvent extends BaseMongo {
  @Prop({ required: true })
  signature: string;

  @Prop({ required: true })
  logIndex: number;

  @Prop({ required: true, default: false })
  isError: boolean;

  @Prop({ required: true })
  raw: string;
}

export const TreasuryEventSchema = SchemaFactory.createForClass(TreasuryEvent);

TreasuryEventSchema.plugin(mongooseLeanVirtuals);
