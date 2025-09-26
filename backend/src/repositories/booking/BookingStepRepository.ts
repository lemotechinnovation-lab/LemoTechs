// Booking Step Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { BookingStepConfiguration, EntityMappers } from '../../infrastructure/entityConfigurations';
import { BookingStep } from '../../infrastructure/entities/databaseSchema';

export class BookingStepRepository extends Repository<BookingStep> {
  constructor(client: PoolClient) {
    super(client, BookingStepConfiguration, EntityMappers.bookingStep);
  }

  // Find steps by order
  async findByOrder(order: number): Promise<BookingStep[]> {
    return await this.findWhere(step => step.stepOrder === order);
  }

  // Find steps in order
  async findInOrder(): Promise<BookingStep[]> {
    return await this.findAll().then(steps => 
      steps.sort((a, b) => a.stepOrder - b.stepOrder)
    );
  }
}

export default BookingStepRepository;
