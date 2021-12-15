import { AutoMap } from '@automapper/classes';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseMongo } from 'src/common/dto';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { BaseSchema } from 'src/decorators';

export type UserDocument = User & Document;

@BaseSchema()
export class User extends BaseMongo {
  @Prop({ required: true, unique: true })
  @AutoMap()
  address?: string;

  @Prop({ required: true, unique: true })
  @AutoMap()
  accountInGameId?: string;

  @Prop({ required: true })
  @AutoMap()
  nonce: number;

  @Prop({ default: 0, min: 0 })
  balance: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(mongooseLeanVirtuals);
