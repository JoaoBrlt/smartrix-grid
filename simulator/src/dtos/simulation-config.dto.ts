import { IsInt, IsNotEmpty } from 'class-validator';

export class SimulationConfigDto {
  @IsInt()
  @IsNotEmpty()
  public nbCommunity: number;
  @IsInt()
  @IsNotEmpty()
  public nbHouseByCommunity: number;
  @IsInt()
  @IsNotEmpty()
  public averageDayConsumptionByCommunity: number;
  @IsInt()
  @IsNotEmpty()
  public averageNightConsumptionByCommunity: number;
  @IsInt()
  @IsNotEmpty()
  public startingProd: number;
  @IsInt()
  @IsNotEmpty()
  public startingHour: number;
  @IsInt()
  @IsNotEmpty()
  public endingHour: number;
  // public prevision: { [hour: number]: number[] };
}
