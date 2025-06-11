
import { OmitType } from "@nestjs/swagger";
import { CreateUserDto } from "../../user/dto/create-user.dto";

export class RegisterResponse extends OmitType(CreateUserDto, ['password']) {}