import { Injectable } from '@nestjs/common';
import { SimulationConfigDto } from '../dtos/simulation-config.dto';
import { MetersIndicationDto } from '../dtos/meters-indication.dtos';
import { Community } from '../simulation/community.class';
import { CommunityManagerService } from '../external/community-manager.service';
import { ProductionEvaluatorService } from '../external/production-evaluator.service';
import { HouseholdMetricsWriterService } from '../external/household-metrics-writer.service';
import { HouseholdMetricsCalculatorService } from '../external/household-metrics-calculator.service';
import { HouseholdMetricsDto } from '../dtos/household-metrics.dto';
import { addToCsvFile } from '../simulation/csv-writer';
import { ProductionMetrics } from '../dtos/production-metrics.dto';
import { MeterControllerService } from '../external/meter-controller.service';
import { ProductionWriterService } from '../external/production-writer.service';

@Injectable()
export class SimulationService {
  private lastProd: number;
  private communities: Community[];
  private config: SimulationConfigDto;
  private endDate: Date;
  private countdown: number;

  /**
   * Constructs the simulation service.
   * @param communityManagerService The community manager service.
   * @param productionWriterService The production writer service.
   * @param productionEvaluatorService The production evaluator service.
   * @param householdMetricsWriterService The household metrics writer service.
   * @param householdMetricsCalculatorService The household metrics calculator service.
   * @param meterControllerService The meter controller service.
   */
  constructor(
    private readonly communityManagerService: CommunityManagerService,
    private readonly productionWriterService: ProductionWriterService,
    private readonly productionEvaluatorService: ProductionEvaluatorService,
    private readonly householdMetricsWriterService: HouseholdMetricsWriterService,
    private readonly householdMetricsCalculatorService: HouseholdMetricsCalculatorService,
    private readonly meterControllerService: MeterControllerService,
  ) {}

  /**
   * Set the configuration for the next simulation.
   * @param config the configuration to initiate.
   */
  public async init(config: SimulationConfigDto): Promise<void> {
    await this.communityManagerService.clear();
    console.log('clear done');
    this.communities = [];
    this.endDate = new Date(Date.UTC(2021, 1, 1, config.endingHour));
    this.config = config;
    this.countdown = config.nbCommunity;
    let idCustomer = 0;
    for (let idCommunity = 0; idCommunity < config.nbCommunity; idCommunity++) {
      const customers: number[] = [];
      for (let i = 0; i < config.nbHouseByCommunity; i++) {
        await this.communityManagerService.addCustomerToCommunity(idCustomer, idCommunity);
        customers.push(idCustomer++);
      }
      this.communities.push(new Community(config, idCommunity, customers));
    }
    console.log('communities created');
    await this.householdMetricsCalculatorService.setCounter(config.nbHouseByCommunity * config.nbCommunity);
    console.log('counter set');
    await this.meterControllerService.sub();
    console.log('sub done');
    this.lastProd = this.config.startingProd;
  }

  /**
   * Starts the simulation.
   */
  public async start(): Promise<void> {
    console.log('starting...');
    await this.productionWriterService.sendProduction({
      amount: this.config.startingProd,
      date: new Date(Date.UTC(2021, 1, 1, this.config.startingHour)),
    });
    console.log('first prod send');
    for (const community of this.communities) {
      const allMetrics: HouseholdMetricsDto[] = community.getNextConsumptionMetrics();
      addToCsvFile(
        'metrics.csv',
        allMetrics.map((m) => {
          return { ...m, prod: Math.round(this.lastProd / (this.config.nbCommunity * this.config.nbHouseByCommunity)) };
        }),
      );
      console.log(allMetrics);
      for (const metrics of allMetrics) {
        await this.householdMetricsWriterService.sendMetrics(metrics);
      }
    }
    console.log('first consumptions send');
    return;
  }

  /**
   * Receives the consumption indication for a community.
   * @param indication the consumption indication of a community.
   */
  async indicate(indication: MetersIndicationDto) {
    const community: Community = this.communities[indication.communityId];
    console.log(community.currentDate, 'indication receive');
    community.update(indication);
    if (community.currentDate > this.endDate) {
      console.log('############## END #############');
      return;
    }
    if (!--this.countdown) {
      this.lastProd = await this.sendProduction(community.currentDate);
      this.countdown = this.config.nbCommunity;
    }
    const allMetrics: HouseholdMetricsDto[] = community.getNextConsumptionMetrics();
    addToCsvFile(
      'metrics.csv',
      allMetrics.map((m) => {
        return { ...m, prod: Math.round(this.lastProd / (this.config.nbCommunity * this.config.nbHouseByCommunity)) };
      }),
    );
    for (const metrics of allMetrics) {
      await this.householdMetricsWriterService.sendMetrics(metrics);
    }
  }

  /**
   * estimate and send production.
   * @param date
   */
  private async sendProduction(date: Date): Promise<number> {
    const prod = { amount: await this.productionEvaluatorService.getEvaluation(), date: date } as ProductionMetrics;
    addToCsvFile('prod.csv', prod);
    await this.productionWriterService.sendProduction(prod);
    return prod.amount;
  }
}
