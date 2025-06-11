import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
    @IsNotEmpty({ message: 'Name should not be empty' })
    name: string;

    @ApiProperty({ description: 'Email address of the user', example: 'johndoe@example.com' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @ApiProperty({ description: 'Password for the user', example: 'StrongPassword123!', minLength: 6 })
    @IsNotEmpty({ message: 'Password should not be empty' })
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;

    static example(): CreateUserDto {
        const dto = new CreateUserDto();
        dto.name = "John Doe";
        dto.email = "john.doe@example.com";
        dto.password = "securePassword123";
        return dto;
    }
}
