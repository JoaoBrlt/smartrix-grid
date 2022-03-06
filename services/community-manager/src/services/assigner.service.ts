import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assigner } from '../entities/assigner.entity';
import { AssignerDto } from '../dtos/assigner.dto';
import { UpdateAssignerDto } from '../dtos/update-assigner.dto';
import { Community } from '../dtos/community.dtos';

@Injectable()
export class AssignerService {
  /**
   * Constructs the community assigner service.
   * @param kafkaClient The kafka client
   * @param assignerRepository The assigner repository.
   */
  constructor(
    @Inject('KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
    @InjectRepository(Assigner)
    private assignerRepository: Repository<Assigner>,
  ) {}

  /**
   * Store an Assigner record, linking a customer/household to a community
   * @param assignerRequest
   */
  public async storeAssignerRecord(assignerRequest: AssignerDto): Promise<Assigner> {
    //Check if the customerId is already assigned to another communityId BEFORE saving, abort otherwise
    const existingCustomer = await this.getCommunity(assignerRequest.customerId);
    if (existingCustomer) return undefined; //The customer has been found, he already exists, aborting the creation

    //Save to the DB, CREATE new assignment (block the update possibility)
    const assignee = this.assignerRepository.create(assignerRequest); //Create the entity instance based on the Dto
    return await this.assignerRepository.save(assignee);
  }

  public async updateAssignerRecord(customerId: number, updateRequest: UpdateAssignerDto): Promise<Assigner> {
    // Naive implementation
    //TODO : Better/Cleaner implementation => Without getCommunity() to check if it exists, without a dummy AssignerDto

    const assignerRequest = new AssignerDto();
    assignerRequest.customerId = customerId;
    assignerRequest.communityId = updateRequest.communityId;

    const existingCustomer = await this.getCommunity(assignerRequest.customerId); //Try to get the customer
    if (!existingCustomer) return undefined; //The customer has NOT been found, aborting the update

    const assignee = this.assignerRepository.create(assignerRequest); //Create the entity instance based on the Dto
    //Save to the DB, UPDATE existing assignment (save() method take care of both create and update)
    return await this.assignerRepository.save(assignee);
  }

  /**
   * Returns an Assigner entity, searching by customerId (1-for-1 link)
   * @param customerId id of the customer/household
   */
  public async getCommunity(customerId: number): Promise<Assigner> {
    return await this.assignerRepository.findOne({ customerId: customerId });
  }

  /**
   * Returns a collection of Assigner dtos, searching by communityId (1-for-n link)
   * @param communityId id of the community
   */
  public async getCustomers(communityId: number): Promise<number[]> {
    const customersId: Array<number> = [];

    //get all the dtos, filtered by the communityId
    const collectionOfAssigners = await this.assignerRepository.find({
      communityId: communityId,
    });

    //We want to get rid of the useless and redundant 'communityId' within each entry, to get only the customers id
    collectionOfAssigners.forEach(function (as) {
      customersId.push(as.customerId);
    });

    return customersId;
  }

  /**
   * Returns all the communities.
   */
  public async getCommunities(): Promise<Community[]> {
    const queryResult = await this.assignerRepository
      .createQueryBuilder()
      .select('Assigner.communityId', 'communityId')
      .addSelect('array_agg("customerId")', 'customersIds')
      .groupBy('Assigner.communityId')
      .getRawMany();

    return queryResult.map((c) => {
      const val = new Community();
      val.communityId = c.communityId;
      val.customersIds = c.customersIds;
      return val;
    });
  }

  /**
   * Clears the entities.
   */
  public async clear(): Promise<void> {
    await this.assignerRepository.clear();
  }

  public async sendDtUpdateEvent(): Promise<void> {
    this.kafkaClient.emit('communities-updated', await this.getCommunities());
  }
}
