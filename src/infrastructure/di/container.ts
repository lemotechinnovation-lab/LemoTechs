/**
 * Dependency Injection Container
 * Manages service instances and their dependencies
 */

export interface ServiceIdentifier<T = any> {
  new (...args: any[]): T;
}

export interface ServiceInstance<T = any> {
  instance: T;
  singleton: boolean;
}

export class DIContainer {
  private services = new Map<string, ServiceInstance>();
  private factories = new Map<string, () => any>();

  /**
   * Register a service as singleton
   */
  registerSingleton<T>(identifier: ServiceIdentifier<T>, instance: T): void {
    this.services.set(identifier.name, {
      instance,
      singleton: true
    });
  }

  /**
   * Register a factory function for creating instances
   */
  registerFactory<T>(identifier: ServiceIdentifier<T>, factory: () => T): void {
    this.factories.set(identifier.name, factory);
  }

  /**
   * Register a transient service (new instance each time)
   */
  registerTransient<T>(identifier: ServiceIdentifier<T>, factory: () => T): void {
    this.factories.set(identifier.name, factory);
  }

  /**
   * Resolve a service instance
   */
  resolve<T>(identifier: ServiceIdentifier<T>): T {
    const serviceName = identifier.name;
    
    // Check if it's a singleton service
    const service = this.services.get(serviceName);
    if (service) {
      return service.instance;
    }

    // Check if there's a factory
    const factory = this.factories.get(serviceName);
    if (factory) {
      const instance = factory();
      
      // If it's a singleton, cache it
      const serviceInstance = this.services.get(serviceName);
      if (serviceInstance?.singleton) {
        this.services.set(serviceName, {
          instance,
          singleton: true
        });
      }
      
      return instance;
    }

    throw new Error(`Service ${serviceName} not registered`);
  }

  /**
   * Check if a service is registered
   */
  isRegistered<T>(identifier: ServiceIdentifier<T>): boolean {
    return this.services.has(identifier.name) || this.factories.has(identifier.name);
  }

  /**
   * Clear all registered services (useful for testing)
   */
  clear(): void {
    this.services.clear();
    this.factories.clear();
  }
}

// Global container instance
export const container = new DIContainer();
