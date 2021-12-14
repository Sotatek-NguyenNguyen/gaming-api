import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { MongoServerError } from 'mongodb';

@Catch(MongoServerError)
export class MongoServerErrorFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse();

    // if (exception.code === 11000) {
    //   return res.status(422).json({
    //     statusCode: 422,
    //     message: 'TASK_NAME_EXIST',
    //   });
    // }

    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    });
  }
}
