// Shop Inventory Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { ShopInventoryConfiguration, EntityMappers, ShopInventory } from '../../infrastructure/entityConfigurations';

export class ShopInventoryRepository extends Repository<ShopInventory> {
  constructor(client: PoolClient) {
    super(client, ShopInventoryConfiguration, EntityMappers.shopInventory);
  }

  // Find by shop ID
  async findByShopId(shopId: string): Promise<ShopInventory[]> {
    return await this.findWhere(inventory => inventory.shopId === shopId);
  }

  // Find by category
  async findByCategory(category: string): Promise<ShopInventory[]> {
    return await this.findWhere(inventory => inventory.category === category);
  }

  // Find active inventory
  async findActiveInventory(): Promise<ShopInventory[]> {
    return await this.findWhere(inventory => inventory.isActive);
  }

  // Find low stock items
  async findLowStockItems(threshold: number = 10): Promise<ShopInventory[]> {
    return await this.findWhere(inventory => 
      inventory.isActive && inventory.quantity <= threshold
    );
  }
}

export default ShopInventoryRepository;
