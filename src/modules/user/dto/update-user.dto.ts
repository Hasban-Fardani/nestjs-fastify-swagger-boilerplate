import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({ description: 'Name of the user', example: 'John Doe', required: false })
    @IsOptional()
    @IsNotEmpty({ message: 'If provided, name should not be empty' })
    name?: string;

    @ApiProperty({ description: 'Email address of the user', example: 'johndoe@example.com', required: false })
    @IsOptional()
    @IsEmail({}, { message: 'If provided, email must be a valid email address' })
    email?: string;

    static example(): UpdateUserDto {
        const dto = new UpdateUserDto();
        dto.name = "John Doe";
        dto.email = "john.doe@example.com";
        return dto;
    }
}
