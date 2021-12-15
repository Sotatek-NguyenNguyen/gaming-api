import { AutoMap } from '@automapper/classes';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseMongo } from 'src/common/dto';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { BaseSchema } from 'src/decorators';
import { BalanceChangeType } from './balance-change.enum';

export type BalanceChangeDocument = BalanceChange & Document;

@BaseSchema()
export class BalanceChange extends BaseMongo {
  @Prop({ required: true, ref: 'User' })
  @AutoMap()
  userId: string;

  @Prop({ required: true, min: 0 })
  @AutoMap()
  amount: number;

  @Prop({ enum: BalanceChangeType, required: true })
  type: BalanceChangeType;

  @Prop()
  transactionId?: string;
}

export const BalanceChangeSchema = SchemaFactory.createForClass(BalanceChange);

BalanceChangeSchema.plugin(mongooseLeanVirtuals);
