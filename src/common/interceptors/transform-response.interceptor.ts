import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  // biome-ignore lint/suspicious/noExplicitAny: Obsevable can be anything
  // biome-ignore lint/correctness/noUnusedVariables: required from nest interceptor
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: 200,
        message: 'Success',
        data,
      })),
    );
  }
}