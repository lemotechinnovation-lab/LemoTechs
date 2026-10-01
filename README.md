# LemoTechs

### Connecting customers, services, and everyday operations.

**LemoTechs** is a service and operations platform developed by **Leonard Masina** under **LemoTech Innovations**. It brings together customer-facing web experiences, backend services, administrative tools, and a mobile application.

The project explores how service bookings, cleaning workflows, shop operations, and driver coordination can work together in one platform.

## Project scope

The codebase includes components for:

- **Service bookings:** customer booking flows and booking state management.
- **Cleaning operations:** workflow coordination and service tracking.
- **Shop management:** orders, queues, and inventory tracking.
- **Driver coordination:** assignment, route optimisation, and tracking interfaces.
- **Business administration:** administrative, business, and franchise dashboard pages.
- **Integrations:** authentication, payments, notifications, and real-time communication.

The project is under development. The presence of a component does not imply that every related workflow is complete or validated for production.

## Technology stack

| Area | Technologies |
| --- | --- |
| Web application | React, TypeScript, Vite, Material UI |
| Backend API | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| Mobile application | React Native, Expo, TypeScript |
| Real-time communication | Socket.IO and SignalR-related integrations |
| External services | Firebase, Google Maps, PayFast, Stripe, Cloudinary, messaging providers |
| Deployment automation | Azure Pipelines |

## Repository guide

| Directory or file | Purpose |
| --- | --- |
| [frontend/](frontend/) | Customer-facing web application and business interfaces |
| [backend/](backend/) | API, application services, data access, and migrations |
| [admin-dashboard/](admin-dashboard/) | Dedicated administration dashboard |
| [mobile/LemoTechExpo/](mobile/LemoTechExpo/) | Expo mobile application |
| [azure-pipelines-unified.yml](azure-pipelines-unified.yml) | Azure pipeline configuration |

## Getting started

### Prerequisites

- Git.
- Node.js 20 or later and npm 10 or later for the web application and backend.
- PostgreSQL for database-backed backend functionality.
- External service configuration for the integrations you intend to use.
- An Expo-compatible development environment for mobile work.

### Clone the repository

```bash
git clone https://github.com/lemotechinnovation-lab/LemoTechs.git
cd LemoTechs
```

### Web application

```bash
cd frontend
npm install
cp env.example .env
```

Update `.env` with your development configuration, including the API URL and required Firebase or Google Maps values. Then start Vite:

```bash
npm run dev
```

On Windows, you can copy `env.example` to `.env` using File Explorer or PowerShell's `Copy-Item`.

### Backend API

From the repository root:

```bash
cd backend
npm install
```

Configure database access and the environment variables required by the backend before starting it. Review the [infrastructure notes](backend/src/infrastructure/README.md) and migration scripts before applying changes to a database.

```bash
npm run dev
```

### Administration dashboard

From the repository root:

```bash
cd admin-dashboard
npm install
npm run dev
```

### Mobile application

From the repository root:

```bash
cd mobile/LemoTechExpo
npm install
npm start
```

Run each component in its own terminal and configure its service connections as needed. These commands are starting points based on the repository scripts; they are not a claim that every component has been tested in a fresh environment.

## Development checks

The frontend and backend provide `npm run typecheck` and `npm run build`. The frontend also provides `npm run lint`. The backend's current `npm test` script is a placeholder.

Keep credentials in local environment configuration. Use development or sandbox accounts when evaluating external integrations.

## Feedback and contributions

Open an issue with the affected component, expected behaviour, and reproduction steps. For code contributions, use a focused branch and explain your changes and validation in the pull request.

## About the creator

Created by **Leonard Masina**, a software developer building practical products through full-stack engineering and API integration.

**Organisation:** [LemoTech Innovations](https://github.com/lemotechinnovation-lab)  
**Related project:** [LemoTick — trading automation and investor management](https://github.com/lemotechinnovation-lab/LemoTick)
