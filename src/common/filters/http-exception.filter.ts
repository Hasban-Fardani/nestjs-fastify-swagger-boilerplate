import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { ErrorResponseDto } from "../dtos/error-response.dto";
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? (exception.getResponse() as ErrorResponseDto).message || exception.message
        : 'Internal Server Error';

    let errorCode =
      exception instanceof HttpException
        ? (exception.getResponse() as { error: string }).error ||
        (exception.getResponse() as ErrorResponseDto).statusCode?.toString() ||
        'ERROR'
        : 'INTERNAL_SERVER_ERROR';

    if (status === HttpStatus.FORBIDDEN) {
      errorCode = 'FORBIDDEN';
      message = Array.isArray(message) ? message[0] : message || 'Forbidden';
    } else if (status === HttpStatus.UNAUTHORIZED) {
      errorCode = 'UNAUTHORIZED';
      message = Array.isArray(message) ? message[0] : message || 'Unauthorized';
    } else if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      errorCode = 'INTERNAL_SERVER_ERROR';
      message = 'Internal Server Error';
    }

    const errorResponse: ErrorResponseDto = {
      statusCode: status,
      message,
      errorCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).send(errorResponse);
  }
}
