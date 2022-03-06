# Services

## Structure

- [community-manager](community-manager): Manages household communities.
- [consumption-notifier](consumption-notifier): Notifies customers when they become self-sufficient.
- [consumption-regulator](consumption-regulator): Regulates the energy consumption of each household.
- [customer-registry](customer-registry): Manages customer accounts.
- [household-metrics-calculator](household-metrics-calculator): Computes the average power consumption of each community.
- [household-metrics-reader](household-metrics-reader): Retrieves the energy metrics of each household.
- [household-metrics-writer](household-metrics-writer): Allows electric meters to send household energy metrics.
- [invoice-issuer](invoice-issuer): Issues the invoices for each customer.
- [invoice-reader](invoice-reader): Retrieves the invoices for each customer.
- [meter-controller](meter-controller) (Mock): Allows services to send commands to electric meters.
- [payment-processor](payment-processor) (Mock): Processes payments each time an invoice is issued.
- [price-estimator](price-estimator): Estimates the price of energy in real time.
- [production-evaluator](production-evaluator): Estimates the energy production required for each power plant.
- [production-reader](production-reader): Retrieves the energy production metrics of each power plant.
- [production-writer](production-writer): Allows power plants to indicate their energy production.

## Authors

- [João Brilhante](https://github.com/JoaoBrlt)
- [Enzo Briziarelli](https://github.com/enbriziare)
- [Charly Ducrocq](https://github.com/CharlyDucrocq)
- [Quentin Larose](https://github.com/QuentinLarose)
- [Ludovic Marti](https://github.com/LudovicMarti)
