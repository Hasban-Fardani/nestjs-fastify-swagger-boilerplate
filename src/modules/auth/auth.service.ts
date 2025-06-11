import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { AuthSchema } from './auth.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<User> {
        const user = await this.userRepository.findOneBy({
            email: username,
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordCorrect = await bcrypt.compare(password, user.password)
        if (!passwordCorrect) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        return user
    }

    async login(user: User) {
        const payload: AuthSchema = {
            email: user.email,
        }

        const token = this.jwtService.sign(payload);

        return token
    }
}
