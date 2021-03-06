import { AutoMap } from '@automapper/classes';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseMongo } from 'src/common/dto';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { BaseSchema } from 'src/decorators';
import { BalanceChangeStatus, BalanceChangeType } from './balance-change.enum';

export type BalanceChangeDocument = BalanceChange & Document;

@BaseSchema()
export class BalanceChange extends BaseMongo {
  @Prop({ required: true, index: true })
  @AutoMap()
  userAddress: string;

  @Prop({ required: true, min: 0 })
  @AutoMap()
  amount: number;

  @Prop({ enum: BalanceChangeType, required: true, index: true })
  @AutoMap()
  type: BalanceChangeType;

  @Prop({ enum: BalanceChangeStatus, default: BalanceChangeStatus.Succeed, index: true })
  @AutoMap()
  status?: BalanceChangeStatus;

  @Prop({ index: true })
  @AutoMap()
  transactionId?: string;

  @Prop({})
  @AutoMap()
  note?: string;
}

export const BalanceChangeSchema = SchemaFactory.createForClass(BalanceChange);

BalanceChangeSchema.plugin(mongooseLeanVirtuals);
