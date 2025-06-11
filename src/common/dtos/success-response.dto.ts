import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ResponseDto } from './response.dto';

// biome-ignore lint/suspicious/noExplicitAny: The type can be anything
export class SuccessResponseDto<T = any> extends PartialType(ResponseDto) {
  @ApiProperty({ description: 'Response data', required: false })
  data?: T;

  @ApiProperty({ example: '2025-06-03T10:00:00Z', required: false })
  timestamp?: string;
}