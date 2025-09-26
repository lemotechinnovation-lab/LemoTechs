// Shop Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { ShopConfiguration, EntityMappers } from '../../infrastructure/entityConfigurations';
import { Shop } from '../../infrastructure/entities/databaseSchema';

export class ShopRepository extends Repository<Shop> {
  constructor(client: PoolClient) {
    super(client, ShopConfiguration, EntityMappers.shop);
  }

  // Find shop by user ID
  async findByUserId(userId: string): Promise<Shop | null> {
    return await this.findFirst(shop => shop.userId === userId);
  }

  // Find active shops
  async findActiveShops(): Promise<Shop[]> {
    return await this.findWhere(shop => shop.isActive);
  }

  // Find shops by rating
  async findByRating(minRating: number): Promise<Shop[]> {
    return await this.findWhere(shop => shop.rating >= minRating);
  }

  // Find shops with capacity
  async findShopsWithCapacity(): Promise<Shop[]> {
    return await this.findWhere(shop => 
      shop.isActive && shop.currentLoad < shop.capacity
    );
  }

  // Get shop statistics
  async getShopStats(): Promise<{
    totalShops: number;
    activeShops: number;
    averageRating: number;
    totalCapacity: number;
  }> {
    const totalShops = await this.count();
    const activeShops = await this.countWhere(shop => shop.isActive);

    const allShops = await this.findAll();
    const averageRating = allShops.length > 0 
      ? allShops.reduce((sum, shop) => sum + shop.rating, 0) / allShops.length
      : 0;

    const totalCapacity = allShops.reduce((sum, shop) => sum + shop.capacity, 0);

    return {
      totalShops,
      activeShops,
      averageRating,
      totalCapacity
    };
  }
}

export default ShopRepository;
