import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ProviderService } from '../services/provider.service';
import { ProviderDto } from '../dtos/provider.dto';
import { Provider } from '../entities/provider.entity';

@Controller('provider')
export class ProviderController {
  /**
   * Constructs the community provider controller.
   * @param providerService The provider service.
   */
  constructor(private readonly providerService: ProviderService) {
    this.assigningCommunityIdToLocation();
  }

  /**
   * We will create data for the database only from here, NOT open to the API
   * Because we work on a defined set of Data, won't change often
   * TODO: Read the data to be posted from a JSON file OR by TypeORM Seeding, and not hard-coded
   */
  public async assigningCommunityIdToLocation() {
    const pdto = new ProviderDto();
    pdto.location = 'Paris';
    pdto.communityId = 1;
    await this.providerService.storeProviderRecord(pdto);

    pdto.location = 'Toulouse';
    pdto.communityId = 2;
    await this.providerService.storeProviderRecord(pdto);

    pdto.location = 'Nice';
    pdto.communityId = 3;
    await this.providerService.storeProviderRecord(pdto);
  }

  /**
   * Get the location corresponding to the communityId (Provider Entity, 1-for-1 link)
   * @param communityId Sent to a pipe that will parse it to a number (string by default in the query)
   * If impossible, an exception is thrown (by default 400-Bad Request), avoiding 500-Internal Server Error
   */
  @Get('by-id/:communityId')
  public getLocationByCommunityId(@Param('communityId', ParseIntPipe) communityId: number): Promise<Provider> {
    return this.providerService.getLocationById(communityId);
  }

  /**
   * Get the communityId corresponding to the location (Provider Entity, 1-for-1 link)
   * @param loc string of the location => default format for parameters, no pipe/check
   */
  @Get('by-location/:location')
  public getCommunityIdByLocation(@Param('location') loc: string): Promise<Provider> {
    return this.providerService.getIdByLocation(loc);
  }
}
