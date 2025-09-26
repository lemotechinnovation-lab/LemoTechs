// Payment Refund Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { PaymentRefundConfiguration, EntityMappers, PaymentRefund } from '../../infrastructure/entityConfigurations';

export class PaymentRefundRepository extends Repository<PaymentRefund> {
  constructor(client: PoolClient) {
    super(client, PaymentRefundConfiguration, EntityMappers.paymentRefund);
  }

  // Find by transaction ID
  async findByTransactionId(transactionId: string): Promise<PaymentRefund[]> {
    return await this.findWhere(refund => refund.transactionId === transactionId);
  }

  // Find by status
  async findByStatus(status: string): Promise<PaymentRefund[]> {
    return await this.findWhere(refund => refund.status === status);
  }

  // Find successful refunds
  async findSuccessfulRefunds(): Promise<PaymentRefund[]> {
    return await this.findWhere(refund => refund.status === 'succeeded');
  }
}

export default PaymentRefundRepository;
