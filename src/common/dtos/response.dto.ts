import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ResponseDto {
    @ApiProperty({ example: HttpStatus.OK })
    statusCode: number;

    @ApiProperty({ example: 'Success' })
    message: string;

    @ApiProperty({ description: 'Response data', required: false })
    // biome-ignore lint/suspicious/noExplicitAny: data can be anything
    data?: any;
}