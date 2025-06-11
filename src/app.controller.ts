import { Controller, Get } from '@nestjs/common';
import { ApiErrorResponse } from './common/decorators/api-error-response.decorator';
import { ApiSuccessResponse } from './common/decorators/api-success-response.decorator';
import { AppHealthyDto } from './common/dtos/app-healthy.dto';


@Controller()
export class AppController {
  @Get('/health')
  @ApiErrorResponse(500, '/health')
  @ApiSuccessResponse(AppHealthyDto, 200)
  getHealthy() {
    return {
      status: 'OK',
    };
  }
}
