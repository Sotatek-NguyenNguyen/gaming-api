import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ValidationObjectIdPipe implements PipeTransform<any, ObjectId> {
  public transform(value: any) {
    if (!ObjectId.isValid(value)) {
      throw new BadRequestException('ObjectId is required');
    }

    return value;
  }
}
