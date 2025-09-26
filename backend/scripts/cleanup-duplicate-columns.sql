-- Cleanup Duplicate Columns in Payment Transactions Table
-- This script removes the duplicate camelCase columns that are causing conflicts

DO $$
BEGIN
    -- Remove duplicate camelCase columns if they exist
    -- Keep only the underscore convention columns
    
    -- Drop userId column if it exists (keep user_id)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'userId'
    ) THEN
        ALTER TABLE payment_transactions DROP COLUMN "userId";
        RAISE NOTICE 'Dropped duplicate userId column';
    END IF;

    -- Drop bookingId column if it exists (keep booking_id)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'bookingId'
    ) THEN
        ALTER TABLE payment_transactions DROP COLUMN "bookingId";
        RAISE NOTICE 'Dropped duplicate bookingId column';
    END IF;

    -- Drop paymentMethodId column if it exists (keep payment_method_id)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'paymentMethodId'
    ) THEN
        ALTER TABLE payment_transactions DROP COLUMN "paymentMethodId";
        RAISE NOTICE 'Dropped duplicate paymentMethodId column';
    END IF;

    -- Drop stripePaymentIntentId column if it exists (keep stripe_payment_intent_id)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'stripePaymentIntentId'
    ) THEN
        ALTER TABLE payment_transactions DROP COLUMN "stripePaymentIntentId";
        RAISE NOTICE 'Dropped duplicate stripePaymentIntentId column';
    END IF;

    -- Drop payfastPaymentId column if it exists (keep payfast_payment_id)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'payfastPaymentId'
    ) THEN
        ALTER TABLE payment_transactions DROP COLUMN "payfastPaymentId";
        RAISE NOTICE 'Dropped duplicate payfastPaymentId column';
    END IF;

    -- Drop createdAt column if it exists (keep created_at)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'createdAt'
    ) THEN
        ALTER TABLE payment_transactions DROP COLUMN "createdAt";
        RAISE NOTICE 'Dropped duplicate createdAt column';
    END IF;

    -- Drop updatedAt column if it exists (keep updated_at)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'updatedAt'
    ) THEN
        ALTER TABLE payment_transactions DROP COLUMN "updatedAt";
        RAISE NOTICE 'Dropped duplicate updatedAt column';
    END IF;

    RAISE NOTICE 'Payment transactions table cleanup completed successfully';
END $$;
