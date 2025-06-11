import { PartialType } from "@nestjs/mapped-types";
import { ResponseDto } from "../../../common/dtos/response.dto";
import { ApiResponseProperty } from "@nestjs/swagger";

export class LoginReponse extends PartialType(ResponseDto) {
    @ApiResponseProperty({ type: String })
    accessToken: string;
}