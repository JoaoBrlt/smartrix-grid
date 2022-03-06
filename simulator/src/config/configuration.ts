export default () => ({
  // Service.
  port: parseInt(process.env.PORT, 10) || 3030,

  // Household metrics writer.
  householdMetricsWriter: {
    host: process.env.HOUSEHOLD_METRICS_WRITER_HOST || 'localhost',
    port: parseInt(process.env.HOUSEHOLD_METRICS_WRITER_PORT, 10) || 3000,
  },

  // Production writer.
  productionWriter: {
    host: process.env.PRODUCTION_WRITER_HOST || 'localhost',
    port: parseInt(process.env.PRODUCTION_WRITER_PORT, 10) || 3002,
  },

  // Production evaluator.
  productionEvaluator: {
    host: process.env.PRODUCTION_EVALUATOR_HOST || 'localhost',
    port: parseInt(process.env.PRODUCTION_EVALUATOR_PORT, 10) || 3003,
  },

  // Community manager.
  communityManager: {
    host: process.env.COMMUNITY_MANAGER_HOST || 'localhost',
    port: parseInt(process.env.COMMUNITY_MANAGER_PORT, 10) || 3006,
  },

  // Meter controller.
  meterController: {
    host: process.env.METER_CONTROLLER_HOST || 'localhost',
    port: parseInt(process.env.METER_CONTROLLER_PORT, 10) || 3008,
  },

  // Household metrics calculator.
  householdMetricsCalculator: {
    host: process.env.HOUSEHOLD_METRICS_CALCULATOR_HOST || 'localhost',
    port: parseInt(process.env.HOUSEHOLD_METRICS_CALCULATOR_PORT, 10) || 3012,
  },
});
