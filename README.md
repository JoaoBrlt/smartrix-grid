# Smartrix Grid

Course: Service-Oriented Architecture

Supervisors: M. Chevalier, L. Gaillard, P. Collet

Date: September 2021 - October 2021

## Description

Smartrix Grid is a smart grid management system. The goal was to design a system with a service-oriented architecture
that would be able to manage an electrical grid. The grid, which interconnects every single device no matter its size
needs to be stable, production must match consumption at any time, and it is up to energy supplies to match and adapt
to the demand. For this purpose, the system manages electric meters, electric car charging stations, production units
(such as solar panels), storage units (such as batteries) of each household and of course power plants.

## Structure

- [services](services): Internal services (NestJS, TypeScript).
- [external](external): External services (NestJS, TypeScript).
- [simulator](simulator): Simulator to test the services (NestJS, TypeScript).
- [tests](tests): Acceptance tests (Cucumber.js, TypeScript).
- [postman](postman): Postman collection and environment.
- [deliverables](deliverables): Project deliverables.

## Requirements

- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/en/download/)
- [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Prepare

- Prepare the dependencies:

```bash
./prepare.sh
```

## Run

- Run the project:

```bash
./run.sh
```

## Stop

- Stop the project:

```bash
./stop.sh
```

## Authors

- [João Brilhante](https://github.com/JoaoBrlt)
- [Enzo Briziarelli](https://github.com/enbriziare)
- [Charly Ducrocq](https://github.com/CharlyDucrocq)
- [Quentin Larose](https://github.com/QuentinLarose)
- [Ludovic Marti](https://github.com/LudovicMarti)

## License

This project is licensed under the GPLv3 License - see the [LICENSE](LICENSE) file for details.
