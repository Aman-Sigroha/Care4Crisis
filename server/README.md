# Care4Crisis Backend Server

This is the backend server for the Care4Crisis donation platform. It provides a REST API for user authentication, campaign management, donation processing, and blockchain transaction tracking.

## Tech Stack

- **Node.js & Express**: Server framework
- **PostgreSQL**: Database
- **JWT**: Authentication
- **bcrypt**: Password hashing
- **pg & pg-promise**: PostgreSQL client

## Setup Instructions

### Prerequisites

- Node.js (v14+ recommended)
- PostgreSQL (v12+ recommended)
- npm or yarn

### Local Development Setup

1. Clone the repository and navigate to the server directory:

```bash
git clone https://github.com/yourusername/Care4Crisis.git
cd Care4Crisis/server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the example:

```bash
cp env.example .env
```

4. Update the `.env` file with your database credentials and JWT secret.

5. Create the database:

```bash
npm run db:create
```

6. Run migrations to create tables:

```bash
npm run db:migrate
```

7. Seed the database with initial data (optional):

```bash
npm run db:seed
```

8. Start the development server:

```bash
npm run dev
```

### Production Deployment

For deployment to Render.com:

1. Create a new Web Service on Render
2. Use the GitHub repository
3. Set the build command: `npm install`
4. Set the start command: `npm start`
5. Add the required environment variables
6. Configure a PostgreSQL database
7. Deploy!

## Database Structure

The database consists of the following tables:

- **users**: User accounts
- **user_profiles**: Extended user profile information
- **ngos**: Non-profit organization details
- **campaigns**: Blockchain donation campaigns
- **donations**: Blockchain donation records
- **regular_donations**: Traditional donations
- **transactions**: Fund transfer transactions to NGOs
- **events**: Events organized by NGOs
- **event_registrations**: User registrations for events

## API Endpoints

### Authentication

- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: Login user

### User Management

- `GET /api/users/profile`: Get user profile
- `PUT /api/users/profile`: Update user profile
- `PUT /api/users/change-password`: Change user password

### Campaigns

- `GET /api/campaigns`: Get all campaigns
- `GET /api/campaigns/:id`: Get campaign details
- `POST /api/campaigns`: Create a new campaign (NGO only)
- `PUT /api/campaigns/:id`: Update campaign (NGO only)

### Donations

- `GET /api/donations`: Get user donations
- `POST /api/donations`: Record a new donation
- `GET /api/donations/campaign/:campaignId`: Get donations for a campaign

### NGOs

- `GET /api/ngos`: Get all NGOs
- `GET /api/ngos/:id`: Get NGO details
- `POST /api/ngos`: Register as an NGO (requires approval)
- `PUT /api/ngos/:id`: Update NGO profile

### Blockchain Transactions

- `GET /api/transactions`: Get all transactions
- `GET /api/transactions/:transactionHash`: Get transaction details
- `POST /api/transactions`: Record a new transaction

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 