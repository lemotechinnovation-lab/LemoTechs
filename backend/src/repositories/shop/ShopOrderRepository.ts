// Shop Order Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { ShopOrderConfiguration, EntityMappers, ShopOrder } from '../../infrastructure/entityConfigurations';

export class ShopOrderRepository extends Repository<ShopOrder> {
  constructor(client: PoolClient) {
    super(client, ShopOrderConfiguration, EntityMappers.shopOrder);
  }

  // Find by shop ID
  async findByShopId(shopId: string): Promise<ShopOrder[]> {
    return await this.findWhere(order => order.shopId === shopId);
  }

  // Find by booking ID
  async findByBookingId(bookingId: string): Promise<ShopOrder[]> {
    return await this.findWhere(order => order.bookingId === bookingId);
  }

  // Find by status
  async findByStatus(status: string): Promise<ShopOrder[]> {
    return await this.findWhere(order => order.status === status);
  }

  // Find pending orders
  async findPendingOrders(): Promise<ShopOrder[]> {
    return await this.findWhere(order => order.status === 'pending');
  }

  // Find completed orders
  async findCompletedOrders(): Promise<ShopOrder[]> {
    return await this.findWhere(order => order.status === 'completed');
  }
}

export default ShopOrderRepository;
