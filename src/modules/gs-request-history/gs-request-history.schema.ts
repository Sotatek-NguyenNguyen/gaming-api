import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { BaseMongo } from 'src/common/dto';
import { BaseSchema } from 'src/decorators';

export type GsRequestHistoryDocument = GsRequestHistory & Document;

@BaseSchema()
export class GsRequestHistory extends BaseMongo {
  @Prop({ required: true, unique: true })
  requestId: string;

  @Prop()
  statusResponse: number;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  dataResponse: any;
}

export const GsRequestHistorySchema = SchemaFactory.createForClass(GsRequestHistory);

GsRequestHistorySchema.plugin(mongooseLeanVirtuals);
