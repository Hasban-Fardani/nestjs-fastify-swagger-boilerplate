// decorators/api-error-response.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

export function ApiErrorResponse(
  statusCode: 400 | 401 | 403 | 404 | 409 | 500,
  path: string,
  message?: string,
  errorCode?: string,
) {
  const defaultMessages = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    500: 'Internal Server Error',
  };

  const responseMessage = message || defaultMessages[statusCode] || 'Error';
  const responseErrorCode = errorCode || responseMessage.toUpperCase().replace(/ /g, '_');

  const options: ApiResponseOptions = {
    status: statusCode,
    description: responseMessage,
    schema: {
      example: {
        statusCode,
        message: responseMessage,
        errorCode: responseErrorCode,
        timestamp: '2025-06-04T10:00:00Z',
        path: path,
      },
    },
  };

  return applyDecorators(ApiResponse(options));
}
