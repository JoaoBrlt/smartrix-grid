import { ArrayNotEmpty, IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export enum DirectiveStatus {
  ON = 'ON',
  OFF = 'OFF',
  AUTO = 'AUTO',
}

export enum DirectiveBatteryStatus {
  CHARGE = 'CHARGE',
  DISCHARGE = 'DISCHARGE',
}

export class MetersIndicationDto {
  /**
   * The community identifier.
   */
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  public communityId: number;

  /**
   * The array of all customers from this community
   */
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  public customersIds: number[];

  /**
   * Directive of energy regulation for the house (ON / OFF / AUTO / ...)
   */
  @IsNotEmpty()
  @IsEnum(DirectiveStatus)
  public house: DirectiveStatus;

  /**
   * Directive of energy regulation for the cars (ON / OFF / AUTO / ...)
   */
  @IsNotEmpty()
  @IsEnum(DirectiveStatus)
  public cars: DirectiveStatus;

  /**
   * Directive for battery behavior (need to charge or discharge it)
   */
  @IsNotEmpty()
  @IsEnum(DirectiveBatteryStatus)
  public battery: DirectiveBatteryStatus;
}
