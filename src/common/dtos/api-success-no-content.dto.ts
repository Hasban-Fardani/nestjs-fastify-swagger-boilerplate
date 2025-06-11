import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ResponseDto } from './response.dto';

export class SuccessResponseNoContent extends PartialType(ResponseDto) {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty({ example: '2025-06-03T10:00:00Z', required: false })
  timestamp?: string;
}
