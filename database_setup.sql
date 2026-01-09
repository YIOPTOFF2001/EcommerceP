-- Database setup for EcommerceP
-- Run this in your PostgreSQL database (e.g., via psql or pgAdmin)

-- Assuming the 'users' table already exists from previous setup

-- Add role column to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    items JSONB NOT NULL,  -- Store cart items as JSON
    total DECIMAL(10,2) NOT NULL,
    shipping_address JSONB NOT NULL,  -- Store shipping details as JSON
    status VARCHAR(50) DEFAULT 'pending',  -- e.g., pending, shipped, delivered
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Create index for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);