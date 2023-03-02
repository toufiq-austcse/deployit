import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';

export class AxiosErrorException extends HttpException {
  constructor(error: AxiosError, contextName: string) {
    let msg = `error in internal server communication, ${contextName}`;
    if (error.response) {
      super(
        {
          message: msg,
          error: JSON.stringify(error.response.data),
          statusCode: error.response.status
        },
        error.response.status
      );
    } else {
      super(
        {
          message: msg,
          error: error.toJSON(),
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}