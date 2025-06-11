import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: HttpStatus.INTERNAL_SERVER_ERROR })
  statusCode: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty({ example: 'BAD_REQUEST' })
  errorCode: string;

  @ApiProperty({ example: '2025-06-03T10:00:00Z' })
  timestamp: string;

  @ApiProperty({ example: '/' })
  path: string;
}
