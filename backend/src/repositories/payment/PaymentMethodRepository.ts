// Payment Method Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { PaymentMethodConfiguration, EntityMappers } from '../../infrastructure/entityConfigurations';
import { PaymentMethod } from '../../infrastructure/entities/databaseSchema';

export class PaymentMethodRepository extends Repository<PaymentMethod> {
  constructor(client: PoolClient) {
    super(client, PaymentMethodConfiguration, EntityMappers.paymentMethod);
  }

  // Find by user ID
  async findByUserId(userId: string): Promise<PaymentMethod[]> {
    return await this.findWhere(method => method.userId === userId);
  }

  // Find default payment method
  async findDefaultMethod(userId: string): Promise<PaymentMethod | null> {
    return await this.findFirst(method => 
      method.userId === userId && method.isDefault
    );
  }

  // Find by provider
  async findByProvider(provider: string): Promise<PaymentMethod[]> {
    return await this.findWhere(method => method.provider === provider);
  }

  // Find by type
  async findByType(type: string): Promise<PaymentMethod[]> {
    return await this.findWhere(method => method.type === type);
  }
}

export default PaymentMethodRepository;
