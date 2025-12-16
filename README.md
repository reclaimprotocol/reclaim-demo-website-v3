# Reclaim SDK Demo Website

**Live Demo:** [https://www.try.reclaimprotocol.org/](https://www.try.reclaimprotocol.org/)

This demonstrates the integration of Reclaim Protocol's JS SDK for managing user data providers and verifications.

## Prerequisites

- Node.js
- A Reclaim Developer account (get it from [dev.reclaimprotocol.org](https://dev.reclaimprotocol.org))

## For developers 🤖

1. Read the code of [the start verification button](src/components/StartVerificationButton/index.tsx). This shows how
   verification request should be created.
2. [Verify page](src/app/verify/page.tsx) shows how reclaim verification request can be used to start verification on frontend.
3. [YourBackendUsingReclaim](src/service/reclaim.ts) shows how Reclaim SDK should be used to create, or modify requests and verify, validate the proofs.

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

4. **Run the Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:5173](http://localhost:5173)

5. **Build for Production**
   ```bash
   npm run build
   ```

## Support

For any issues or questions, please visit the [Reclaim Protocol Documentation](https://docs.reclaimprotocol.org) or contact support.

## License

MIT License
