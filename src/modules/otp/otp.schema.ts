import { AutoMap } from '@automapper/classes';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseMongo } from 'src/common/dto';
import mongooseLeanVirtuals from 'mongoose-lean-virtuals';
import { BaseSchema } from 'src/decorators';

export type OtpDocument = Otp & Document;

@BaseSchema()
export class Otp extends BaseMongo {
  @Prop({ required: true })
  @AutoMap()
  accountInGameId: string;

  @Prop({ required: true, unique: true })
  @AutoMap()
  otp: string;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

OtpSchema.plugin(mongooseLeanVirtuals);
