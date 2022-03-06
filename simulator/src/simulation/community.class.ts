import { SimulationConfigDto } from '../dtos/simulation-config.dto';
import { HouseholdMetricsDto } from '../dtos/household-metrics.dto';
import { DirectiveBatteryStatus, DirectiveStatus, MetersIndicationDto } from '../dtos/meters-indication.dtos';

export class Community {
  private static epsilon = 0.1;
  private static carConsumption = 50;
  private static maxCarBattery = 1000;

  public id: number;
  public houseIds: number[];
  public averageDayConsumption: number;
  public averageNightConsumption: number;
  public currentDate: Date;
  public actualCarBattery = 0;

  private directive: { battery: DirectiveBatteryStatus; cars: DirectiveStatus; house: DirectiveStatus };

  constructor(config: SimulationConfigDto, id: number, houseIds: number[]) {
    this.directive = {
      battery: DirectiveBatteryStatus.CHARGE,
      cars: DirectiveStatus.OFF,
      house: DirectiveStatus.ON,
    };
    this.id = id;
    this.houseIds = houseIds;
    this.averageDayConsumption = config.averageDayConsumptionByCommunity / config.nbHouseByCommunity;
    this.averageNightConsumption = config.averageNightConsumptionByCommunity / config.nbHouseByCommunity;
    this.currentDate = new Date(Date.UTC(2021, 1, 1, config.startingHour));
  }

  public update(directive: MetersIndicationDto) {
    this.directive.cars = directive.cars;
    this.directive.house = directive.house;
    this.directive.battery = directive.battery;
    this.currentDate.setMinutes(this.currentDate.getMinutes() + 1);
  }

  public getNextConsumptionMetrics(): HouseholdMetricsDto[] {
    const result: HouseholdMetricsDto[] = [];
    this.houseIds.forEach((id) => {
      result.push({
        consumption: Math.round(this.generateConsumption()),
        production: 0,
        date: this.currentDate,
        currentBattery: 0,
        maxBattery: 0,
        batteryUsage: 0,
        customerId: id,
      });
    });
    return result;
  }

  private generateConsumption(): number {
    let realValue =
      this.directive.house == DirectiveStatus.ON
        ? Math.round((1 + (Math.random() * 2 - 1) * Community.epsilon) * this.getSmoothValue())
        : this.averageNightConsumption;
    if (this.directive.cars == DirectiveStatus.ON && this.actualCarBattery < Community.maxCarBattery) {
      const currentCarConsumption = Math.min(Community.carConsumption, Community.maxCarBattery - this.actualCarBattery);
      this.actualCarBattery += currentCarConsumption;
      realValue += currentCarConsumption;
    }
    return realValue;
  }

  private getSmoothValue(): number {
    const max = this.averageDayConsumption;
    const min = this.averageNightConsumption;
    const hour = this.currentDate.getHours() + this.currentDate.getMinutes() / 60;
    const x = hour * (Math.PI / 12) - Math.PI;
    return ((Math.cos(x) + 1) * (max - min)) / 2 + min;
  }
}
