import { Controller, Get, HttpStatus, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RepositoryService } from '../services/repository.service';
import { BaseApiResponse, SwaggerBaseApiResponse } from '@common/dto/base-api-response.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { ValidateRepositoryResDto } from '../dto/res/repository-res.dto';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { ValidateRepositoryQueryDto } from '../dto/req/repository-req.dto';

@ApiTags('Repository')
@Controller({ path: 'repositories', version: '1' })
@UseInterceptors(ResponseInterceptor)
export class RepositoryController {
  constructor(private repositoryService: RepositoryService) {

  }

  @Get('validate')
  @ApiOkResponse({ type: SwaggerBaseApiResponse(ValidateRepositoryResDto, HttpStatus.OK) })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('auth')
  async validateRepository(@Query() dto: ValidateRepositoryQueryDto): Promise<BaseApiResponse<ValidateRepositoryResDto>> {
    let data = await this.repositoryService.validateRepository(dto.repository_url);
    return {
      message: null,
      data
    };
  }


}