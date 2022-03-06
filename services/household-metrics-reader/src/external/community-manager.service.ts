import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CommunityDto } from '../dtos/community.dto';

@Injectable()
export class CommunityManagerService implements OnModuleInit, OnModuleDestroy {
  /**
   * Constructs the community manager service.
   * @param kafkaClient The Kafka client.
   */
  constructor(@Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka) {}

  /**
   * Triggered when the module is initialized.
   */
  public async onModuleInit(): Promise<void> {
    // Subscribe to the responses of some topics.
    const topics = ['get-all-communities', 'get-customers-by-community'];
    for (const topic of topics) {
      this.kafkaClient.subscribeToResponseOf(topic);
    }
    await this.kafkaClient.connect();
  }

  /**
   * Triggered when the module is destroyed.
   */
  public async onModuleDestroy(): Promise<void> {
    await this.kafkaClient.close();
  }

  /**
   * Returns the list of communities.
   */
  public async getCommunities(): Promise<CommunityDto[]> {
    return firstValueFrom(this.kafkaClient.send<CommunityDto[], string>('get-all-communities', ''));
  }

  /**
   * Returns the list of customer identifiers belonging to a community
   * @param communityId The community identifier.
   */
  public async getCustomersByCommunity(communityId: number): Promise<number[]> {
    return firstValueFrom(this.kafkaClient.send<number[], any>('get-customers-by-community', { communityId }));
  }
}
