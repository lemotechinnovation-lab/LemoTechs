-- Fix Payment Transactions Table Schema
-- This script ensures the payment_transactions table has the correct column names

-- Check if the table exists and what columns it has
DO $$
BEGIN
    -- Check if bookingId column exists (camelCase)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'bookingId'
    ) THEN
        -- Check if bookingid column exists (lowercase)
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'payment_transactions' 
            AND column_name = 'bookingid'
        ) THEN
            -- Rename bookingid to bookingId
            ALTER TABLE payment_transactions RENAME COLUMN bookingid TO "bookingId";
            RAISE NOTICE 'Renamed bookingid column to bookingId';
        ELSE
            -- Add bookingId column if it doesn't exist
            ALTER TABLE payment_transactions ADD COLUMN "bookingId" UUID REFERENCES bookings(id) ON DELETE SET NULL;
            RAISE NOTICE 'Added bookingId column';
        END IF;
    END IF;

    -- Check if userId column exists (camelCase)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'userId'
    ) THEN
        -- Check if userid column exists (lowercase)
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'payment_transactions' 
            AND column_name = 'userid'
        ) THEN
            -- Rename userid to userId
            ALTER TABLE payment_transactions RENAME COLUMN userid TO "userId";
            RAISE NOTICE 'Renamed userid column to userId';
        ELSE
            -- Add userId column if it doesn't exist
            ALTER TABLE payment_transactions ADD COLUMN "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE;
            RAISE NOTICE 'Added userId column';
        END IF;
    END IF;

    -- Check if paymentMethodId column exists (camelCase)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'paymentMethodId'
    ) THEN
        -- Check if paymentmethodid column exists (lowercase)
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'payment_transactions' 
            AND column_name = 'paymentmethodid'
        ) THEN
            -- Rename paymentmethodid to paymentMethodId
            ALTER TABLE payment_transactions RENAME COLUMN paymentmethodid TO "paymentMethodId";
            RAISE NOTICE 'Renamed paymentmethodid column to paymentMethodId';
        ELSE
            -- Add paymentMethodId column if it doesn't exist
            ALTER TABLE payment_transactions ADD COLUMN "paymentMethodId" VARCHAR(255);
            RAISE NOTICE 'Added paymentMethodId column';
        END IF;
    END IF;

    -- Check if stripePaymentIntentId column exists (camelCase)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'stripePaymentIntentId'
    ) THEN
        -- Check if stripepaymentintentid column exists (lowercase)
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'payment_transactions' 
            AND column_name = 'stripepaymentintentid'
        ) THEN
            -- Rename stripepaymentintentid to stripePaymentIntentId
            ALTER TABLE payment_transactions RENAME COLUMN stripepaymentintentid TO "stripePaymentIntentId";
            RAISE NOTICE 'Renamed stripepaymentintentid column to stripePaymentIntentId';
        ELSE
            -- Add stripePaymentIntentId column if it doesn't exist
            ALTER TABLE payment_transactions ADD COLUMN "stripePaymentIntentId" VARCHAR(255);
            RAISE NOTICE 'Added stripePaymentIntentId column';
        END IF;
    END IF;

    -- Check if payfastPaymentId column exists (camelCase)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'payfastPaymentId'
    ) THEN
        -- Check if payfastpaymentid column exists (lowercase)
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'payment_transactions' 
            AND column_name = 'payfastpaymentid'
        ) THEN
            -- Rename payfastpaymentid to payfastPaymentId
            ALTER TABLE payment_transactions RENAME COLUMN payfastpaymentid TO "payfastPaymentId";
            RAISE NOTICE 'Renamed payfastpaymentid column to payfastPaymentId';
        ELSE
            -- Add payfastPaymentId column if it doesn't exist
            ALTER TABLE payment_transactions ADD COLUMN "payfastPaymentId" VARCHAR(255);
            RAISE NOTICE 'Added payfastPaymentId column';
        END IF;
    END IF;

    -- Check if createdAt column exists (camelCase)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'createdAt'
    ) THEN
        -- Check if createdat column exists (lowercase)
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'payment_transactions' 
            AND column_name = 'createdat'
        ) THEN
            -- Rename createdat to createdAt
            ALTER TABLE payment_transactions RENAME COLUMN createdat TO "createdAt";
            RAISE NOTICE 'Renamed createdat column to createdAt';
        ELSE
            -- Add createdAt column if it doesn't exist
            ALTER TABLE payment_transactions ADD COLUMN "createdAt" TIMESTAMP DEFAULT NOW();
            RAISE NOTICE 'Added createdAt column';
        END IF;
    END IF;

    -- Check if updatedAt column exists (camelCase)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payment_transactions' 
        AND column_name = 'updatedAt'
    ) THEN
        -- Check if updatedat column exists (lowercase)
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'payment_transactions' 
            AND column_name = 'updatedat'
        ) THEN
            -- Rename updatedat to updatedAt
            ALTER TABLE payment_transactions RENAME COLUMN updatedat TO "updatedAt";
            RAISE NOTICE 'Renamed updatedat column to updatedAt';
        ELSE
            -- Add updatedAt column if it doesn't exist
            ALTER TABLE payment_transactions ADD COLUMN "updatedAt" TIMESTAMP DEFAULT NOW();
            RAISE NOTICE 'Added updatedAt column';
        END IF;
    END IF;

    RAISE NOTICE 'Payment transactions table schema fix completed successfully';
END $$;
