import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  RECORD_NOT_FOUND,
  RECORD_EXISTS,
  CANNOT_DELETE,
} from '../common/common.constants';

export class GlobalExceptionHandler {
  static handlePrismaError(
    error: any,
    defaultMessage: string = 'Internal Server Error',
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new HttpException(RECORD_EXISTS, HttpStatus.CONFLICT);
        case 'P2025':
          throw new HttpException(RECORD_NOT_FOUND, HttpStatus.NOT_FOUND);
        case 'P2003':
          throw new HttpException(CANNOT_DELETE, HttpStatus.BAD_REQUEST);
        default:
          throw new HttpException(
            `${defaultMessage} - ${error.message}`,
            statusCode,
          );
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      throw new HttpException('Validation failed', HttpStatus.BAD_REQUEST);
    } else {
      throw new HttpException(defaultMessage, statusCode);
    }
  }
}
