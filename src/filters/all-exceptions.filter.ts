import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.error(exception);

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException ? exception.getResponse() : HttpStatus[status];

    const data: any = {
      statusCode: status,
      error: HttpStatus[status],
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (typeof message === 'string') {
      data.message = message;
    } else Object.assign(data, message);

    response.status(status).json(data);
  }
}
