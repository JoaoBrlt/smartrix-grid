#!/usr/bin/env bash
curl -L -X POST 'http://localhost:3030/simulator/start' \
-H 'Content-Type: application/json' \
--data-raw '{
   "nbCommunity": 5,
   "nbHouseByCommunity": 10,
   "averageDayConsumptionByCommunity": 600000,
   "averageNightConsumptionByCommunity": 10000,
   "startingProd": 50000000,
   "startingHour": 0,
   "endingHour": 12
}'
