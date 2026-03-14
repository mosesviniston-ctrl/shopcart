# Flipkart Clone (MERN Stack with MySQL & Razorpay)

This is a full-stack e-commerce project built using React, Node.js, Express, MySQL, and Tailwind CSS. It features user authentication, category browsing, cart management, and Razorpay payment integration.

## Prerequisites
- Node.js (v18+)
- MySQL Server
- Razorpay Account (for testing)

## Database Setup
1. Open your MySQL client and run the SQL commands provided in the `schema.sql` file at the root of the project.
2. This will establish the `flipkart_clone` database, create all necessary tables, and insert initial generic products and categories.

## Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Open `backend/.env` and update your MySQL connection details.
4. Add your **Razorpay Test Keys** to the `.env` file:
   ```
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
5. Start the backend server:
   ```bash
   node server.js
   ```
   The backend will run on `http://localhost:5000`.

## Frontend Setup
1. Navigate to the frontend folder from the project root:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the React app at the URL provided by Vite (usually `http://localhost:5173`).

## Razorpay Integration Notes
- The checkout page (`frontend/src/pages/Checkout.jsx`) automatically injects the Razorpay Checkout SDK.
- The `RAZORPAY_KEY_ID` is securely requested from the backend when an order is created.
- The payment verification algorithm uses `crypto.createHmac` in `backend/routes/orderRoutes.js` to ensure payload legitimacy.
- You can use standard Razorpay test cards during the checkout process.

## Key Decisions
- **MySQL over MongoDB**: Opted for a relational DB to maintain strict consistency across Users, Products, Cart, and Orders.
- **Tailwind CSS v4**: Utilized the Vite plugin architecture for zero-config global CSS styling.
- **Context API**: Managed Cart and Auth states using React Context avoiding Redux overhead for a clean implementation.
"# onlineshopping" 
