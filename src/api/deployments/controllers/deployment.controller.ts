import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { DeploymentService } from '../services/deployment.service';
import { ApiCreatedResponse, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { DeploymentResDto, ListDeploymentResDto, ListDeploymentTypeResDto } from '../dto/res/deployment-res.dto';
import { BaseApiResponse, SwaggerBaseApiResponse } from '@common/dto/base-api-response.dto';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CreateDeploymentReqDto, ListDeploymentQueryDto } from '../dto/req/deployment-req.dto';
import { UserInfoDec } from '@common/decorators/user-info.decorator';
import { User } from '../../auth/entities/user.entity';

@Controller({ path: 'deployments', version: '1' })
@ApiTags('Deployment')
@UseInterceptors(ResponseInterceptor)
export class DeploymentController {
  constructor(private deploymentService: DeploymentService) {

  }

  @Get('type')
  @ApiOkResponse({ type: SwaggerBaseApiResponse([ListDeploymentTypeResDto], HttpStatus.OK) })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('auth')
  async listDeploymentTypes(): Promise<BaseApiResponse<ListDeploymentTypeResDto[]>> {
    let data = await this.deploymentService.listDeploymentTypes();
    return {
      message: null,
      data
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('auth')
  @ApiCreatedResponse({ type: SwaggerBaseApiResponse(DeploymentResDto, HttpStatus.OK) })
  async show(@Param('id', ParseIntPipe) id: number, @UserInfoDec() user: User): Promise<BaseApiResponse<DeploymentResDto>> {
    let data = await this.deploymentService.showDeployment(id, user);
    return {
      message: null,
      data
    };
  }


  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('auth')
  @ApiOkResponse({ type: SwaggerBaseApiResponse(ListDeploymentResDto, HttpStatus.OK) })
  async index(@Query() query: ListDeploymentQueryDto, @UserInfoDec() user: User): Promise<BaseApiResponse<ListDeploymentResDto>> {
    let data = await this.deploymentService.listDeployments(query, user);
    return {
      message: null,
      data
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('auth')
  @ApiCreatedResponse({ type: SwaggerBaseApiResponse(DeploymentResDto, HttpStatus.CREATED) })
  async create(@Body() dto: CreateDeploymentReqDto, @UserInfoDec() user: User): Promise<BaseApiResponse<DeploymentResDto>> {
    let data = await this.deploymentService.createDeployment(dto, user);
    return {
      message: '',
      data
    };
  }


  // @Post(':id/env')
  // @UseGuards(JwtAuthGuard)
  // @ApiSecurity('auth')
  // @ApiCreatedResponse({ type: SwaggerBaseApiResponse([EnvironmentVariableResDto], HttpStatus.CREATED) })
  // async createEnv(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateEnvReqDto, @UserInfoDec() user: User): Promise<BaseApiResponse<EnvironmentVariableResDto[]>> {
  //   let data = await this.envVariableService.createDeploymentEnvVariable(id, dto, user);
  //   return {
  //     message: '',
  //     data
  //   };
  //
  // }

}