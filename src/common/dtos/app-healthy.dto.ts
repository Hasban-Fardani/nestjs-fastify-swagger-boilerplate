import { ApiProperty } from '@nestjs/swagger';

export class AppHealthyDto {
    @ApiProperty({ example: 'OK' })
    status: string;
}
