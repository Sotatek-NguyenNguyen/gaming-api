import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { TreasuryEventName } from 'src/common/constant';
import { BaseMongo } from 'src/common/dto';
import { BaseSchema } from 'src/decorators';

export type GsEventDocument = GsEvent & Document;

@BaseSchema()
export class GsEvent extends BaseMongo {
  @Prop({ enum: TreasuryEventName, required: true, index: true })
  event: TreasuryEventName;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  data: any;
}

export const GsEventSchema = SchemaFactory.createForClass(GsEvent);

GsEventSchema.plugin(mongooseLeanVirtuals);
