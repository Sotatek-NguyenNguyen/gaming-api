import { AutoMap } from '@automapper/classes';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { BaseMongo } from 'src/common/dto';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { BaseSchema } from 'src/decorators';
import { UserRole } from 'src/common/constant';

export type UserDocument = User & Document;

@BaseSchema()
export class User extends BaseMongo {
  @Prop({ required: true, unique: true })
  @AutoMap()
  address?: string;

  @Prop({})
  @AutoMap()
  accountInGameId?: string;

  @Prop({ enum: UserRole, default: UserRole.Player })
  role?: UserRole;

  @Prop({ required: true })
  nonce: number;

  @Prop({ default: 0, min: 0, type: SchemaTypes.Decimal128 })
  balance: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(mongooseLeanVirtuals);
