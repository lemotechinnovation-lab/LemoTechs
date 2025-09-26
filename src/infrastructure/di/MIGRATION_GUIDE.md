/**
 * Dependency Injection Migration Guide
 * 
 * This guide shows how to migrate from static service calls to dependency injection
 */

/*
BEFORE (Static Service Calls):
=============================

// In controllers
import { UserService } from '../services/userService';

export const getUserProfile = async (req: Request, res: Response) => {
  const user = await UserService.getUserByEmail(email);
  // ...
};

// In services
export class UserService {
  static async getUserByEmail(email: string) {
    const client = await getClient();
    const userRepository = new UserRepository(client);
    return await userRepository.findByEmail(email);
  }
}

PROBLEMS:
- Hard to test (can't mock static methods easily)
- Tight coupling between controllers and services
- Services create their own dependencies
- Difficult to swap implementations
- No clear dependency graph

AFTER (Dependency Injection):
===========================

// In controllers
import { injectServices, getServices } from '../infrastructure/di/injector';

export const getUserProfile = async (req: Request, res: Response) => {
  const { userService } = getServices(req);
  const user = await userService.getUserByEmail(email);
  // ...
};

// In services
export class UserService implements IUserService {
  constructor(
    private userRepository: UserRepository,
    private phoneVerificationRepository: PhoneVerificationRepository
  ) {}

  async getUserByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }
}

BENEFITS:
- Easy to test (inject mock dependencies)
- Loose coupling (depend on interfaces, not implementations)
- Clear dependency graph
- Easy to swap implementations
- Better separation of concerns
- More maintainable code

MIGRATION STEPS:
================

1. Create Service Interfaces
   - Define contracts for all services
   - See: src/infrastructure/di/interfaces.ts

2. Refactor Services to Implement Interfaces
   - Remove static methods
   - Add constructor with dependencies
   - Implement interface methods

3. Create DI Container and Factory
   - Register services and their dependencies
   - See: src/infrastructure/di/container.ts
   - See: src/infrastructure/di/serviceFactory.ts

4. Update Controllers
   - Use injectServices middleware
   - Access services via req.services
   - Remove direct service imports

5. Update App Initialization
   - Initialize DI container on startup
   - Register all services and dependencies

6. Update Tests
   - Create mock implementations
   - Inject mocks instead of using real services
   - See: src/tests/examples/diTestingExample.ts

EXAMPLE MIGRATION:
==================

// Step 1: Create interface
export interface IUserService {
  getUserByEmail(email: string): Promise<UserProfile | null>;
  createUser(userData: CreateUserRequest): Promise<UserProfile | null>;
}

// Step 2: Refactor service
export class UserService implements IUserService {
  constructor(
    private userRepository: UserRepository,
    private phoneVerificationRepository: PhoneVerificationRepository
  ) {}

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) return null;
    
    return {
      id: user.id,
      name: user.name || 'Unknown',
      email: user.email,
      // ... map other properties
    };
  }

  async createUser(userData: CreateUserRequest): Promise<UserProfile | null> {
    const hashedPassword = userData.password ? 
      await bcrypt.hash(userData.password, 12) : undefined;
    
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });
    
    if (!user) return null;
    
    return {
      id: user.id,
      name: user.name || 'Unknown',
      email: user.email,
      // ... map other properties
    };
  }
}

// Step 3: Register in factory
container.registerFactory(IUserService, () => new UserService(
  container.resolve(UserRepository),
  container.resolve(PhoneVerificationRepository)
));

// Step 4: Update controller
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userService } = getServices(req);
    const user = await userService.getUserByEmail(email);
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    Logger.logError('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Step 5: Update routes
app.use('/api/auth', injectServices, authRoutes);

TESTING WITH DI:
================

// Create mock service
class MockUserService implements IUserService {
  private users: Map<string, UserProfile> = new Map();

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    return this.users.get(email) || null;
  }

  async createUser(userData: CreateUserRequest): Promise<UserProfile | null> {
    const user: UserProfile = {
      id: 'test-id',
      name: userData.name,
      email: userData.email,
      // ... other properties
    };
    this.users.set(userData.email, user);
    return user;
  }
}

// In tests
beforeEach(() => {
  ServiceFactory.clear();
  ServiceFactory.registerSingleton(IUserService, new MockUserService());
});

it('should get user by email', async () => {
  const userService = ServiceFactory.getService(IUserService);
  const user = await userService.getUserByEmail('test@example.com');
  expect(user).toBeDefined();
});

BEST PRACTICES:
===============

1. Always depend on interfaces, not concrete classes
2. Use constructor injection for required dependencies
3. Register services as singletons when appropriate
4. Use factories for complex object creation
5. Clear container between tests
6. Validate dependencies at startup
7. Use TypeScript for better type safety
8. Document service contracts clearly

PERFORMANCE CONSIDERATIONS:
===========================

1. Services are registered as singletons by default
2. Repositories are also singletons (shared database connection)
3. Only create new instances when necessary
4. Use lazy loading for expensive services
5. Consider using a more advanced DI container for large applications

NEXT STEPS:
===========

1. Start with one service (e.g., UserService)
2. Migrate its controller and tests
3. Gradually migrate other services
4. Add more advanced features (scoped services, decorators)
5. Consider using a DI framework like InversifyJS for larger projects
*/
