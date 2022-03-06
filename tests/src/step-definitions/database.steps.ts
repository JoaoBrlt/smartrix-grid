import { Given } from '@cucumber/cucumber';
import { CommunityManagerService } from '../services/community-manager.service';
import { HouseholdMetricsWriterService } from '../services/household-metrics-writer.service';
import { ProductionWriterService } from '../services/production-writer.service';

//============================================================================//
// GIVEN
//============================================================================//

Given(/^All fresh database$/,
  async () => {
    await CommunityManagerService.clear();
    await HouseholdMetricsWriterService.clear();
    await ProductionWriterService.clear();
  });

Given(/^A fresh production database$/,
  async () => {
    await ProductionWriterService.clear();
  });

Given(/^A fresh community database$/,
  async () => {
    await CommunityManagerService.clear();
  });

Given(/^A fresh consumption database$/,
  async () => {
    await HouseholdMetricsWriterService.clear();
    await HouseholdMetricsWriterService.loadFixtures();
  });
