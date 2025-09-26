// Phone Verification Repository with LINQ capabilities
import { PoolClient } from 'pg';
import { Repository } from '../../infrastructure/advancedLinqQueryBuilder';
import { PhoneVerificationConfiguration, EntityMappers } from '../../infrastructure/entityConfigurations';
import { PhoneVerification } from '../../infrastructure/entities/databaseSchema';

export class PhoneVerificationRepository extends Repository<PhoneVerification> {
  constructor(client: PoolClient) {
    super(client, PhoneVerificationConfiguration, EntityMappers.phoneVerification);
  }

  // Find verification by phone number
  async findByPhoneNumber(phoneNumber: string): Promise<PhoneVerification | null> {
    return await this.findFirst(verification => verification.phoneNumber === phoneNumber);
  }

  // Find expired verifications
  async findExpiredVerifications(): Promise<PhoneVerification[]> {
    const now = new Date();
    return await this.findWhere(verification => verification.expiresAt < now);
  }

  // Find active verifications
  async findActiveVerifications(): Promise<PhoneVerification[]> {
    const now = new Date();
    return await this.findWhere(verification => verification.expiresAt > now);
  }
}

export default PhoneVerificationRepository;
