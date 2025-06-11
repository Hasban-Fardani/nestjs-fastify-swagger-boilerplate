import { applyDecorators } from '@nestjs/common';
import { ApiErrorResponse } from './api-error-response.decorator';

type ErrorStatus = 400 | 401 | 403 | 404 | 500;

export function ApiDynamicErrorResponses(path: string, statusCodes: ErrorStatus[] = [400, 401, 403, 404, 500]) {
    return applyDecorators(
        ...statusCodes.map((code) => {
            switch (code) {
                case 400:
                    return ApiErrorResponse(400, path, 'Bad Request', 'BAD_REQUEST');
                case 401:
                    return ApiErrorResponse(401, path, 'Unauthorized', 'UNAUTHORIZED');
                case 403:
                    return ApiErrorResponse(403, path, 'Forbidden', 'FORBIDDEN');
                case 404:
                    return ApiErrorResponse(404, path, 'Not Found', 'NOT_FOUND');
                case 500:
                    return ApiErrorResponse(500,
                        path, 'Internal Server Error', 'INTERNAL_SERVER_ERROR');
                default:
                    return ApiErrorResponse(code, 'Error', 'ERROR');
            }
        }),
    );
}
