// User Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { UserConfiguration, EntityMappers } from '../../infrastructure/entityConfigurations';
import { User } from '../../infrastructure/entities/databaseSchema';

export class UserRepository extends Repository<User> {
  constructor(client: PoolClient) {
    super(client, UserConfiguration, EntityMappers.user);
  }

  // Override findById to use direct SQL query for better reliability
  override async findById(id: string): Promise<User | null> {
    const result = await this.client.query(
      'SELECT * FROM users WHERE id = $1 LIMIT 1',
      [id]
    );
    return result.rows.length > 0 ? this.entityMapper(result.rows[0]) : null;
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.client.query(
      'SELECT * FROM users WHERE email = $1 LIMIT 1',
      [email]
    );
    return result.rows.length > 0 ? this.entityMapper(result.rows[0]) : null;
  }

  // Find user by phone
  async findByPhone(phone: string): Promise<User | null> {
    const result = await this.client.query(
      'SELECT * FROM users WHERE phone = $1 LIMIT 1',
      [phone]
    );
    return result.rows.length > 0 ? this.entityMapper(result.rows[0]) : null;
  }

  // Find users by role
  async findByRole(role: string): Promise<User[]> {
    return await this.findWhere(user => user.role === role);
  }

  // Find verified users
  async findVerifiedUsers(): Promise<User[]> {
    return await this.findWhere(user => user.emailVerified && user.phoneVerified);
  }

  // Find users with loyalty points
  async findUsersWithLoyaltyPoints(minPoints: number = 0): Promise<User[]> {
    return await this.findWhere(user => user.loyaltyPoints >= minPoints);
  }

  // Get user statistics
  async getUserStats(): Promise<{
    totalUsers: number;
    verifiedUsers: number;
    drivers: number;
    shops: number;
    admins: number;
  }> {
    const totalUsers = await this.count();
    const verifiedUsers = await this.countWhere(user => user.emailVerified);
    const drivers = await this.countWhere(user => user.role === 'driver');
    const shops = await this.countWhere(user => user.role === 'shop');
    const admins = await this.countWhere(user => user.role === 'admin');

    return {
      totalUsers,
      verifiedUsers,
      drivers,
      shops,
      admins
    };
  }
}

export default UserRepository;
