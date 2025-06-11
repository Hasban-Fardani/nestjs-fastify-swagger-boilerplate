import { ResponseDto } from "../dtos/response.dto";

export function wrapResponse(data: unknown, message = 'Success', statusCode = 200): ResponseDto {
    return {
        statusCode,
        message,
        data,
    };
}

export const responseOk = (data: unknown, message = 'Success') => wrapResponse(data, message, 200);

export const responseCreated = (data: unknown, message = 'Success') => wrapResponse(data, message, 201);

export const responseNoContent = (message = 'Success') => wrapResponse(null, message, 204);

export const responseNotFound = (message = 'Not Found') => wrapResponse(null, message, 404);

export const responseBadRequest = (message = 'Bad Request') => wrapResponse(null, message, 400);

export const responseConflict = (message = 'Conflict') => wrapResponse(null, message, 409);

export const responseInternalServerError = (message = 'Internal Server Error') => wrapResponse(null, message, 500);

export const responseUnauthorized = (message = 'Unauthorized') => wrapResponse(null, message, 401);

export const responseForbidden = (message = 'Forbidden') => wrapResponse(null, message, 403);

export const responseUnprocessableEntity = (message = 'Unprocessable Entity') => wrapResponse(null, message, 422);

export const responseTooManyRequests = (message = 'Too Many Requests') => wrapResponse(null, message, 429);

export const responseServiceUnavailable = (message = 'Service Unavailable') => wrapResponse(null, message, 503);