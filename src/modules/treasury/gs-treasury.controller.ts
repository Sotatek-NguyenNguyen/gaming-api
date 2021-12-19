import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiHeaderGsGet } from 'src/decorators';
import { TokenInfoResponse, TreasuryResponse } from './dto';

@ApiTags('Game Server')
@Controller('game-server')
export class GsTreasuryController {
  @Get('/treasury-info')
  @ApiOperation({
    operationId: 'gsGetTreasuryInfo',
    description: 'Retrieve information of current treasury contract (basically the most important is treasury balance)',
  })
  @ApiHeaderGsGet()
  @ApiOkResponse({ type: TreasuryResponse })
  getTreasuryInfo() {
    //
  }

  @Get('/token-info')
  @ApiOperation({
    operationId: 'gsGetTokenInfo',
    description: 'Retrieve information of currency token',
  })
  @ApiHeaderGsGet()
  @ApiOkResponse({ type: TokenInfoResponse })
  gsGetTokenInfo() {
    //
  }
}
