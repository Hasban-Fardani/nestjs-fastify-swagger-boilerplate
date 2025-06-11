import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiAcceptedResponse,
  ApiNoContentResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { SuccessResponseDto } from '../dtos/success-response.dto';

type SuccessStatus = 200 | 201 | 202 | 204;

const statusDecoratorMap = {
  200: ApiOkResponse,
  201: ApiCreatedResponse,
  202: ApiAcceptedResponse,
  204: ApiNoContentResponse,
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function ApiSuccessResponse<TModel extends Type<any> | null>(
  model?: TModel,
  status: SuccessStatus = 200,
) {
  const Decorator = statusDecoratorMap[status];
  const decorators: Array<MethodDecorator | ClassDecorator> = [];

  if (status === 204) {
    decorators.push(
      Decorator({
        description: 'No Content',
      }),
    );
  } else if (model) {
    decorators.push(ApiExtraModels(SuccessResponseDto, model));
    decorators.push(
      Decorator({
        schema: {
          allOf: [
            { $ref: getSchemaPath(SuccessResponseDto) },
            {
              properties: {
                data: { $ref: getSchemaPath(model) },
              },
            },
          ],
        },
      }),
    );
  } else {
    decorators.push(ApiExtraModels(SuccessResponseDto));
    decorators.push(
      Decorator({
        schema: {
          $ref: getSchemaPath(SuccessResponseDto),
        },
      }),
    );
  }

  return applyDecorators(...decorators);
}
