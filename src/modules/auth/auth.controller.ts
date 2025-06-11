import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiSuccessResponse } from '../../common/decorators/api-success-response.decorator';
import { LoginReponse } from './dto/login-response.dto';
import { ApiDynamicErrorResponses } from '../../common/decorators/api-dynamic-error-response.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { RegisterResponse } from './dto/register-response.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    @Post('login')
    @ApiSuccessResponse(LoginReponse, 200)
    @ApiDynamicErrorResponses('login', [400, 401, 500])
    async login(@Body() loginDto: LoginDto): Promise<LoginReponse> {
        const validated = await this.authService.validateUser(loginDto.email, loginDto.password)

        const accessToken = await this.authService.login(validated)

        return {
            accessToken
        }
    }

    @Post('register')
    @ApiSuccessResponse(RegisterResponse, 201)
    @ApiDynamicErrorResponses('register', [400, 500])
    async register(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }
}
