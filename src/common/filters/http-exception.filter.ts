import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    try {
      let { statusCode, message } = exception.getResponse() as any;
      response.status(statusCode).json({
        status: statusCode,
        message: (exception.getResponse() as any).error,
        errors: typeof message === 'string' ? [message] : message,
        data: null
      });
    } catch (error) {
      let message = exception.message;
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to process the request',
        errors: [message],
        data: null
      });
    }
  }
}