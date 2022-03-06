import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Production } from '../entities/production.entity';

@Injectable()
export class ProductionReaderService {
  /**
   * Constructs the production output service.
   * @param productionRepository The production repository.
   */
  constructor(@InjectRepository(Production) private productionRepository: Repository<Production>) {}

  /**
   * Returns the total production.
   */
  public async getTotalProduction(): Promise<number> {
    const productions = await this.productionRepository.createQueryBuilder().getMany();
    return productions.map((p) => p.amount).reduce((a, b) => a + b, 0);
  }

  /**
   * Returns the production for a given day.
   * @param date The requested date of the day.
   */
  public async getGivenDayTotalProduction(date: Date): Promise<number[]> {
    const result: number[] = new Array(24);

    for (let hour = 24; hour > 0; hour--) {
      const predate = new Date(date);
      predate.setHours(predate.getHours() - hour);

      const postdate = new Date(date);
      postdate.setHours(postdate.getHours() - hour + 1);

      const productions = await this.productionRepository
        .createQueryBuilder()
        .where('Production.date >= :predate', { predate })
        .andWhere('Production.date < :postdate', { postdate })
        .getMany();

      result[24 - hour] = productions.map((p) => p.amount).reduce((a, b) => a + b, 0);
    }
    return result;
  }

  /**
   * Returns the production for a given month.
   * @param date The requested date of the month.
   */
  public async getGivenMonthTotalProduction(date: Date): Promise<number> {
    const predate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
    const postdate = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 1));
    const productions = await this.productionRepository
      .createQueryBuilder()
      .where('Production.date >= :predate', { predate })
      .andWhere('Production.date < :postdate', { postdate })
      .getMany();
    return productions.map((p) => p.amount).reduce((a, b) => a + b, 0);
  }

  /**
   * Returns the production for a given year.
   * @param date The requested date of the year.
   */
  public async getGivenYearTotalProduction(date: Date): Promise<number> {
    const predate = new Date(Date.UTC(date.getFullYear(), 1, 1));
    const postdate = new Date(Date.UTC(date.getFullYear() + 1, 1, 1));
    const productions = await this.productionRepository
      .createQueryBuilder()
      .where('Production.date >= :predate', { predate })
      .andWhere('Production.date < :postdate', { postdate })
      .getMany();
    return productions.map((p) => p.amount).reduce((a, b) => a + b, 0);
  }

  /**
   * Returns a production by identifier.
   * @param id The production identifier.
   */
  public async getProductionById(id: number): Promise<Production> {
    return await this.productionRepository.findOne(id);
  }

  public async getLastProduction(maxDate: Date): Promise<Production> {
    return this.productionRepository
      .createQueryBuilder()
      .where('Production.date <= :date', { date: maxDate })
      .orderBy('Production.date', 'DESC', 'NULLS LAST')
      .getOne();
  }
}
