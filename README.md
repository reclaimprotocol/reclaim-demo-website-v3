# Reclaim SDK Demo Website

**Live Demo:** [https://www.try.reclaimprotocol.org/](https://www.try.reclaimprotocol.org/)

This demonstrates the integration of Reclaim Protocol's JS SDK for managing user data providers and verifications.

## Prerequisites

- Node.js
- A Reclaim Developer account (get it from [dev.reclaimprotocol.org](https://dev.reclaimprotocol.org))

## Setup Instructions

1. **Get Your API Credentials**
   - Visit [dev.reclaimprotocol.org](https://dev.reclaimprotocol.org)
   - Create a new application or use an existing one
   - Copy your App ID and App Secret

2. **Configure Environment Variables**
   Rename the existing `.env.example` file in the root directory to `.env`:
   ```bash
   mv .env.example .env
   ```
   Then, open the `.env` file and fill in your credentials:
   ```
   VITE_RECLAIM_APP_ID=your_app_id_here
   VITE_RECLAIM_APP_SECRET=your_app_secret_here
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Configure Providers**
   - Open `src/screens/Desktop/Desktop.tsx`
   - Update the `dataSources` array with your provider IDs from the Reclaim Developer Portal
   - Each data source should have:
     - `name`: Display name for the data source
     - `icon`: Icon component or image
     - `providerId`: Your provider ID from the Reclaim Developer Portal

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:5173](http://localhost:5173)

6. **Build for Production**
   ```bash
   npm run build
   ```

## Available Data Sources

The project includes several pre-configured data sources:
- X (Twitter) user profile
- Coinbase KYC
- GitHub username
- Gmail Account
- YouTube Creator Analytics
- Steam Counter Strike Inventory
- LinkedIn user profile
- Amazon Last 2 order details
- Swiggy Order analytics
- Zomato Order analytics
- Flipkart Order history
- Spotify user-artist overview
- LinkedIn verifications

## Support

For any issues or questions, please visit the [Reclaim Protocol Documentation](https://docs.reclaimprotocol.org) or contact support.
