import { Body, Controller, Post } from '@nestjs/common';
import { SimulationService } from '../services/simulation.service';
import { SimulationConfigDto } from '../dtos/simulation-config.dto';
import { MetersIndicationDto } from '../dtos/meters-indication.dtos';
import { addToCsvFile } from '../simulation/csv-writer';

@Controller('simulator')
export class SimulationController {
  /**
   * Constructs the simulation controller;
   * @param simulationService The simulation service.
   */
  constructor(private readonly simulationService: SimulationService) {}

  /**
   * Starts the simulation according to the given configuration.
   * @param config the simulation configuration.
   */
  @Post('start')
  public async start(@Body() config: SimulationConfigDto) {
    await this.simulationService.init(config);
    console.log('test');
    await this.simulationService.start();
  }

  /**
   * Receives the next iteration indication for a community.
   * @param indication the consumption indication for a community.
   */
  @Post('indicate')
  public async receiveDirective(@Body() indication: MetersIndicationDto) {
    await this.simulationService.indicate(indication);
  }

  @Post('test')
  public test(@Body() data: any) {
    addToCsvFile('test.csv', data);
  }
}
