# Limble Metrics API

## Installation

### Docker

To set up the environment, you will need to first install [Docker](https://docs.docker.com/engine/install/).
This test uses Docker Compose to run everything.

### Backend Server

The backend server uses Node.js, but you don't need to have that installed on your machine.

You can install the dependencies by running:

```bash
docker compose run server npm i
```

Since we are using docker-compose, environment variables can be tweaked within `docker-compose.yml` such as the caching duration:

```bash
API_PORT: 3000
LOG_LEVEL: debug
```

Once the dependencies are installed, you can run then service with 3000 bound to your machine with:

```bash
docker compose up server
```

### Database

To bring up the database:

```bash
docker compose up -d db
```

Once it's ready to go, you can run the schema migrator to build the schema:

```bash
docker compose run migrate
```

If that fails (because of something like an already existing table), you can always start with a clean slate
by bringing the DB container down:

```bash
docker compose down
```

### Tests

Once the dependencies are installed, you can run unit or integration tests. Or both! However, you will need to have the seeded test db running if you try integration tests.

```bash
docker compose run server npm test
docker compose run server npm run tests:unit
docker compose run server npm run tests:integration
```

## Documentation

For API docs, see the [Documentation](https://html-preview.github.io/?url=https://github.com/ConnerAiken/limble-interview/blob/main/server/docs/index.html) that is generated within the server folder.
