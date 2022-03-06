import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateTime, Duration } from 'luxon';
import { HouseholdMetrics } from '../entities/household-metrics.entity';
import { HouseholdMetricsDto } from '../dtos/household-metrics.dto';

@Injectable()
export class HouseholdMetricsReaderService {
  /**
   * Constructs the household metrics reader service.
   * @param householdMetricsRepository The household metrics repository.
   */
  constructor(
    @InjectRepository(HouseholdMetrics)
    private readonly householdMetricsRepository: Repository<HouseholdMetrics>,
  ) {}

  /**
   * Aggregates household metrics by time slots.
   * Hypothesis: The household metrics are sorted by date.
   * @param metrics The household metrics to be aggregated.
   * @param start The start date.
   * @param end The end date.
   * @param step The duration of a time slot.
   */
  public aggregateHouseholdMetricsByTimeSlots(
    metrics: HouseholdMetrics[],
    start: DateTime,
    end: DateTime,
    step: Duration,
  ): HouseholdMetricsDto[] {
    // Initialize the results.
    const results: HouseholdMetricsDto[] = [];

    // For each time slot.
    let index = 0;
    let slotStart = start;
    let slotEnd = slotStart.plus(step);
    while (slotEnd < end.plus(step)) {
      // Initialize the metrics of the current time slot.
      const slotMetrics: HouseholdMetricsDto = {
        consumption: 0,
        boughtConsumption: 0,
        production: 0,
        soldProduction: 0,
        amount: 0,
        maxBattery: 0,
        batteryUsage: 0,
        currentBattery: 0,
        date: slotStart.toJSDate(),
      };

      // Find the household metrics belonging to the current time slot.
      while (index < metrics.length) {
        const item = metrics[index];
        if (DateTime.fromJSDate(item.date) >= slotStart && DateTime.fromJSDate(item.date) < slotEnd) {
          // Update the metrics of the current time slot.
          slotMetrics.consumption += item.consumption;
          slotMetrics.boughtConsumption += item.boughtConsumption;
          slotMetrics.production += item.production;
          slotMetrics.soldProduction += item.soldProduction;
          slotMetrics.maxBattery = item.maxBattery;
          slotMetrics.batteryUsage += item.batteryUsage;
          slotMetrics.currentBattery = item.currentBattery;
          slotMetrics.amount +=
            (item.boughtConsumption * item.purchasePrice - item.soldProduction * item.sellingPrice) / 1000;
          index++;
        } else {
          break;
        }
      }

      // Append the metrics of the current time slot.
      results.push(slotMetrics);

      // Compute the next time slot.
      slotStart = slotEnd;
      slotEnd = slotStart.plus(step);
    }

    return results;
  }

  /**
   * Aggregates household metrics.
   * @param metrics The household metrics to be aggregated.
   */
  public aggregateHouseholdMetrics(metrics: HouseholdMetrics[]): HouseholdMetricsDto {
    // Initialize the result.
    const result: HouseholdMetricsDto = {
      consumption: 0,
      boughtConsumption: 0,
      production: 0,
      soldProduction: 0,
      currentBattery: 0,
      maxBattery: 0,
      batteryUsage: 0,
      amount: 0,
    };

    // For each household metrics.
    for (const item of metrics) {
      result.consumption += item.consumption;
      result.boughtConsumption += item.boughtConsumption;
      result.production += item.production;
      result.soldProduction += item.soldProduction;
      result.maxBattery += item.maxBattery;
      result.batteryUsage += item.batteryUsage;
      result.currentBattery += item.currentBattery;
      result.amount += item.boughtConsumption * item.purchasePrice - item.soldProduction * item.sellingPrice;
    }

    return result;
  }
}
