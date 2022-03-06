import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from '../entities/provider.entity';
import { ProviderDto } from '../dtos/provider.dto';

@Injectable()
export class ProviderService {
  /**
   * Constructs the community provider service.
   * @param providerRepository
   */
  constructor(
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
  ) {}

  /**
   * Store a Provider record, linking a communityId to a location (string)
   * @param providerRequest
   */
  public async storeProviderRecord(providerRequest: ProviderDto): Promise<void> {
    //NOT meant to be open on the API by the controller! Only for local add!
    //So no need to check if the Provider already exists in the DB

    //Save to the DB
    const prov = this.providerRepository.create(providerRequest);
    await this.providerRepository.save(prov);
  }

  /**
   * Returns a Provider entity, searching by communityId (1-for-1 link)
   * @param communityId
   */
  public async getLocationById(communityId: number): Promise<Provider> {
    return await this.providerRepository.findOne({ communityId: communityId });
  }

  /**
   * Returns a Provider entity, searching by location name (1-for-1 link)
   * @param location
   */
  public async getIdByLocation(location: string): Promise<Provider> {
    return await this.providerRepository.findOne({ location: location });
  }
}
