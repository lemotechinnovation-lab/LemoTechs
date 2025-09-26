// Service Item Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { ServiceItemConfiguration, EntityMappers } from '../../infrastructure/entityConfigurations';
import { ServiceItem } from '../../infrastructure/entities/databaseSchema';

export class ServiceItemRepository extends Repository<ServiceItem> {
  constructor(client: PoolClient) {
    super(client, ServiceItemConfiguration, EntityMappers.serviceItem);
  }

  // Find service items by category
  async findByCategory(category: string): Promise<ServiceItem[]> {
    return await this.findWhere(item => item.category === category);
  }

  // Find active service items
  async findActiveItems(): Promise<ServiceItem[]> {
    return await this.findWhere(item => item.isActive);
  }

  // Find service items by price range
  async findByPriceRange(minPrice: number, maxPrice: number): Promise<ServiceItem[]> {
    return await this.findWhere(item => 
      item.basePrice >= minPrice && item.basePrice <= maxPrice
    );
  }

  // Find shoe services
  async findShoeServices(): Promise<ServiceItem[]> {
    return await this.findByCategory('shoes');
  }

  // Find clothing services
  async findClothingServices(): Promise<ServiceItem[]> {
    return await this.findByCategory('clothing');
  }

  // Find accessory services
  async findAccessoryServices(): Promise<ServiceItem[]> {
    return await this.findByCategory('accessories');
  }
}

export default ServiceItemRepository;
