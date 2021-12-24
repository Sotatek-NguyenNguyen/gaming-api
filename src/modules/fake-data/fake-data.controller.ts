import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FakeDataRequest } from './fake-data.dto';
import { FakeDataService } from './fake-data.service';

@ApiTags('Fake Data')
@Controller('fake-data')
export class FakeDataController {
  constructor(readonly service: FakeDataService) {}

  @Post()
  @ApiOperation({
    operationId: 'fakeData',
  })
  getMyNftItem(@Body() { userAddress }: FakeDataRequest) {
    return this.service.fake(userAddress);
  }
}
