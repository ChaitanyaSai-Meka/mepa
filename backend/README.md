# Backend Services

## Docker Setup

### Build and Run

```bash
docker-compose up --build
```

### Stop Services

```bash
docker-compose down
```

### Environment Variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

### Services

- **api_service**: Port 5004
- **route_service**: Port 8001

### Import Stations

After starting services, import stations:

```bash
docker-compose exec api_service npm run import-stations
```
