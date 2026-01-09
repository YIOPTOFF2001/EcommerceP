![Alt text for accessibility](pictures/chat.png)

# Full-Stack Development for a Clothing Brand


This is a full-stack e-commerce style web application built.  The goal of this project is to design and implement a real-world system that handles authentication, orders, admin management, and backend processing, not just frontend visuals. An online store approached me and requested that I build a full stack project that accepts and places customers orders in real time.

The project is being built incrementally, with a focus on clean architecture, security, and practical functionality.

## Project Functionality
I'm building an e-commerce platform for a clothing brand. At its core, this e-commerce platform is designed to do one thing well: turn attention into transactions reliably.

The site must allow users to browse products effortlessly, understand value immediately, and complete a purchase with minimal friction. That means a clean product catalogue with categories, filters, and search that actually works. Each product page must convey trust, featuring clear pricing, high-quality images, detailed descriptions, an accurate availability status, and a visible call to action. 

Users must be able to create accounts, log in securely, manage their profiles, view order history, and receive transactional emails or notifications. Checkout must be fast, mobile-first, and localized for the market — meaning correct currency, relevant payment methods, and realistic delivery options.
Payments are a big part of the spec. The system must integrate with reliable payment gateways suitable for the region, handle failed transactions gracefully, and confirm orders only when payments are actually verified. 

On the backend, the platform must support full product management: adding, editing, and removing products; managing inventory levels; setting prices and discounts; and handling stock alerts. Order management is critical the admin must be able to see orders in real time, update statuses, manage cancellations or returns, and export data for accounting or analysis. 

The frontend is built with a modern JavaScript framework to ensure performance, responsiveness, and maintainability. The backend exposes clean APIs for products, users, orders, and payments. A relational database handles transactional data because e-commerce needs consistency. Authentication is handled securely, and the architecture allows features to be extended later without rewriting everything.

## Project Goals

The main goals of this project are to:

Build a complete frontend-to-backend workflow

Implement secure user authentication and role-based access control

Design and manage order processing logic

Practice working with APIs, databases, and Dockerized environments

Simulate real production patterns used in modern web applications

## Features
### Authentication & Authorization

Users can register and log in using a session-based authentication system. Sessions persist across pages, and protected routes are enforced on the backend. A role-based system is implemented using a role column in the users table, allowing differentiation between normal users and admins.

Admin-only APIs validate the logged-in user’s role before allowing access. A /me endpoint returns the authenticated user’s details, including their role, for frontend logic.

### Order Management

Authenticated users can place orders through the checkout flow. When an order is submitted, the backend validates the request, saves the order to the database, generates a unique order ID, and returns it to the frontend.
Orders store cart items and shipping information in JSON format, along with totals, status, and timestamps. The system is structured to allow future normalization into separate order and order_items tables.

### Admin Dashboard

An admin dashboard allows administrators to view all orders and update order statuses. This interface communicates with protected backend APIs and reflects real database data.

### Email Notifications

When an order is successfully placed, email notifications are sent to both the user and the admin. The admin receives order details, while the user receives a confirmation email containing their order ID and shipping information.

### Frontend Integration

The frontend communicates with the backend exclusively through API calls. Checkout actions clear the cart only after a successful backend response. Error handling is implemented for validation failures and network issues

## Tech Stack
### Frontend

HTML5

CSS3

JavaScript (Vanilla JS)

Backend

PHP

REST-style API endpoints

### Database

PostgreSQL
