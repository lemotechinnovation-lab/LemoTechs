// Payment Transaction Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { PaymentTransactionConfiguration, EntityMappers } from '../../infrastructure/entityConfigurations';
import { PaymentTransaction } from '../../infrastructure/entities/databaseSchema';

export class PaymentTransactionRepository extends Repository<PaymentTransaction> {
  constructor(client: PoolClient) {
    super(client, PaymentTransactionConfiguration, EntityMappers.paymentTransaction);
  }

  // Find transactions by user ID
  async findByUserId(userId: string): Promise<PaymentTransaction[]> {
    return await this.findWhere(transaction => transaction.userId === userId);
  }

  // Find transactions by booking ID
  async findByBookingId(bookingId: string): Promise<PaymentTransaction[]> {
    return await this.findWhere(transaction => transaction.bookingId === bookingId);
  }

  // Find transactions by status
  async findByStatus(status: string): Promise<PaymentTransaction[]> {
    return await this.findWhere(transaction => transaction.status === status);
  }

  // Find successful transactions
  async findSuccessfulTransactions(): Promise<PaymentTransaction[]> {
    return await this.findWhere(transaction => transaction.status === 'succeeded');
  }

  // Find transactions by PayFast ID
  async findByPayfastId(payfastId: string): Promise<PaymentTransaction | null> {
    return await this.findFirst(transaction => 
      transaction.payfastPaymentId === payfastId
    );
  }

  // Find transactions by Stripe ID
  async findByStripeId(stripeId: string): Promise<PaymentTransaction | null> {
    return await this.findFirst(transaction => 
      transaction.stripePaymentIntentId === stripeId
    );
  }

  // Get payment statistics
  async getPaymentStats(): Promise<{
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    totalAmount: number;
  }> {
    const totalTransactions = await this.count();
    const successfulTransactions = await this.countWhere(transaction => 
      transaction.status === 'succeeded'
    );
    const failedTransactions = await this.countWhere(transaction => 
      transaction.status === 'failed'
    );

    const allTransactions = await this.findAll();
    const totalAmount = allTransactions.reduce((sum, transaction) => 
      sum + transaction.amount, 0
    );

    return {
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      totalAmount
    };
  }
}

export default PaymentTransactionRepository;
