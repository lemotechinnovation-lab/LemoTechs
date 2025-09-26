// Models Index - Organized by Domain
// This exports all simple data models for easy importing

// User Domain
export * from './user/userModel';
export * from './user/adminModel';

// Driver Domain
export * from './driver/driverModel';
export * from './driver/driverJobModel';
export * from './driver/driverLocationModel';
export * from './driver/driverAssignmentModel';

// Shop Domain
export * from './shop/shopModel';
export * from './shop/shopOrderModel';
export * from './shop/shopInventoryModel';
export * from './shop/shopManagementModel';

// Cleaning Domain
export * from './cleaning/cleaningItemModel';

// Booking Domain
export * from './booking/bookingModel';
export * from './booking/bookingHistoryModel';
export * from './booking/bookingStepModel';
export * from './booking/inProgressBookingModel';

// Payment Domain
export * from './payment/paymentModel';
export * from './payment/paymentMethodModel';
export * from './payment/paymentRefundModel';
export * from './payment/payfastModel';

// System Domain
export * from './system/fileModel';
export * from './system/phoneVerificationModel';
export * from './system/serviceItemModel';
export * from './system/hybridAuthModel';
export * from './system/smsModel';
