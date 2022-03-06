export default () => ({
  // Service.
  port: parseInt(process.env.PORT, 10) || 3011,

  // Database.
  database: {
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgres://soa-e-usr:soa-e-pwd@localhost:6543/soa-e',
    synchronize: true,
    logging: false,
    entities: ['dist/**/*.entity.{js,ts}'],
    subscribers: ['dist/**/*.subscriber.{js,ts}'],
  },
});
