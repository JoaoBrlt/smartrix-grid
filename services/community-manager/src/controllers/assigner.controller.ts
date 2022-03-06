import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AssignerDto } from '../dtos/assigner.dto';
import { AssignerService } from '../services/assigner.service';
import { Assigner } from '../entities/assigner.entity';
import { UpdateAssignerDto } from '../dtos/update-assigner.dto';
import { Community } from '../dtos/community.dtos';

@Controller('assigner')
export class AssignerController {
  /**
   * Constructs the community assigner controller.
   * @param assignerService The assigner service.
   */
  constructor(private readonly assignerService: AssignerService) {}

  /**
   * Get all communities
   */
  @Get('communities')
  public getCommunities(): Promise<Community[]> {
    return this.assignerService.getCommunities();
  }

  /**
   * Clears the entities.
   */
  @Get('clear')
  public async clearDB(): Promise<void> {
    await this.assignerService.clear();
  }

  /**
   * Store an Assigner record, linking a customer/household to a community
   * @param assignerRequest Dto => for validation (check good format and type to create the entity)
   */
  @Post('store')
  public async assigningCustomerToCommunity(@Body() assignerRequest: AssignerDto) {
    const assign = await this.assignerService.storeAssignerRecord(assignerRequest);
    if (!assign) {
      //If the customer already exists in the DB, send an error response (403 Forbidden)
      throw new ForbiddenException();
    } else this.assignerService.sendDtUpdateEvent().then();
  }

  /**
   * Update an Assigner record
   * @param customerId id of the customer, passed as a parameter and into a Pipe for validation
   * @param updateRequest id of the community, passed as body and into a Dto for validation
   */
  @Put('update/:customerId')
  public async updateCustomerToCommunity(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() updateRequest: UpdateAssignerDto,
  ) {
    // PUT format : - id of the entity to update == query parameter
    //              - information to store == body (new Dto Object needed for control)
    const assign = await this.assignerService.updateAssignerRecord(customerId, updateRequest);
    if (!assign) {
      //If the customerId doesn't exists in the DB, send an error response (404 Not Found)
      throw new NotFoundException();
    } else this.assignerService.sendDtUpdateEvent().then();
  }

  /**
   * Get a community corresponding to a customer (Assigner Entity, 1-for-1 link)
   * @param customerId Sent to a pipe that will parse it to a number (string by default in the query)
   *  If it can't be parsed, an exception is thrown (by default 400-Bad Request), avoiding 500-Internal Server Error
   */
  @Get('get_community/:customerId')
  public getCommunityById(@Param('customerId', ParseIntPipe) customerId: number): Promise<Assigner> {
    return this.assignerService.getCommunity(customerId);
  }

  /**
   * Get a collection of customers corresponding to a community (Assigner Entity, 1-for-n link)
   * @param communityId Sent to a pipe that will parse it to a number (string by default in the query)
   *  If it can't be parsed, an exception is thrown (by default 400-Bad Request), avoiding 500-Internal Server Error
   */
  @Get('get_customers/:communityId')
  public getCustomersById(@Param('communityId', ParseIntPipe) communityId: number): Promise<number[]> {
    return this.assignerService.getCustomers(communityId);
  }
}
