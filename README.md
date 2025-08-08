# Yeabuddy Web

Workout tracking for gymbros. Monorepo with ASP.NET Core backend and React + Tailwind frontend.

## Apps
- API: ASP.NET Core Web API in `src/api`
- Frontend: React + Vite in `frontend`

## Getting Started

### Prerequisites
- .NET 8 SDK+
- Node.js 18+ and npm

### Backend
```
dotnet restore
cd src/api
dotnet run
```
API defaults to http://localhost:5100.

### Frontend
```
cd frontend
npm install
npm run dev
```
App runs at http://localhost:5173.

### Project Structure
- Domain models in `src/domain`
- Application services in `src/application`
- API controllers in `src/api`

### License
MIT
