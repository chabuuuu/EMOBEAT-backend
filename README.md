# Overview of EMOBEAT MUSIC BACKEND Project

The **EMOBEAT MUSIC BACKEND** project is a backend system built using **Node.js** with the **Express.js**.

It follows **Dependency Injection (DI)** principles via **InversifyJS** and implements the **Repository Pattern** with **TypeORM** for database management.

The project is designed to support features for managing music data, artists, albums, genres, instruments, and other related components.

## System Architecture

![alt text](https://res.cloudinary.com/practicaldev/image/fetch/s--CDARQ4Hj--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/of739v9cu7namgc9m2am.jpg)

The system is organized following the **Controller → Service → Repository → Entity** model, with the main components described below:

1. **Models (Entities)**:

   - Define database tables using TypeORM classes, e.g., `Artist`, `Album`, `Music`, `Orchestra` etc.
   - These models are directly mapped to database tables.

2. **Repositories**:

   - Handle database interactions and perform CRUD operations using TypeORM.
   - Examples: `ArtistRepository`, `AlbumRepository`, `MusicRepository`, etc.

3. **Services**:

   - Process business logic and combine data from multiple repositories if needed.
   - Examples: `ArtistService`, `AlbumService`, `MusicService`, etc.

4. **Controllers**:

   - Handle HTTP requests from clients and call the corresponding services to execute business logic.
   - Examples: `ArtistController`, `AlbumController`, `MusicController`, etc.

5. **Containers**:

   - Combine components (controllers, services, repositories) using Dependency Injection.
   - Examples: `ArtistContainer`, `AlbumContainer`, `MusicContainer`, etc.

6. **Routes**:
   - Define API endpoints and map URLs to corresponding controllers.
   - Examples: `artist.route.ts`, `album.route.ts`, `music.route.ts`, etc.

## Key Features

- **Artist Management**:

  - Create, update, delete, and search for artists.
  - Link artists with genres, instruments, orchestras, and periods.

- **Album Management**:

  - Create, update, delete, and search for albums.
  - Link albums with songs and genres.

- **Music Management**:

  - Create, update, delete, and search for songs.
  - Link songs with artists, albums, genres, instruments, periods, and categories.

- **Genre Management**:

  - Create, update, delete, and search for genres.

- **Instrument Management**:

  - Create, update, delete, and search for instruments.

- **Orchestra Management**:

  - Create, update, delete, and search for orchestras.

## Tools and Technologies Used

- **Node.js**: The main platform for building the backend.
- **Express.js**: Framework for building RESTful APIs.
- **TypeORM**: ORM for database management.
- **InversifyJS**: Library for Dependency Injection.
- **Docker**: For packaging and deploying the application.
- **GitHub Actions**: CI/CD integration for automated builds and deployments.
- **PostgreSQL**: Database management system.

## CI/CD Workflow

- **Build and Publish Docker Image**:
  - Automatically build Docker images from the source code and push them to Docker Hub.
- **Deploy to Server**:
  - Remove old containers and start new containers on a different port.
  - Perform health checks on the new container before switching.
  - Reload Nginx to point to the new container.

## Usage Guide

### Development

- Run the application in development mode:

  ```bash
  npm run start:dev
  ```

- Generate migrations automatically:

  ```bash
  npm run migration:generate
  ```

- Apply migrations:
  ```bash
  npm run migration:run
  ```

### Production

- Build and run the application:
  ```bash
  npm run build
  npm run start:prod
  ```

### Create a New Module

- Automatically generate components (service, controller, repository, container, route):
  ```bash
  npm run create:module
  ```

### Lint source

```
npm run lint
```

Lint fix:

```
npm run lint:fix
```

### Format source

Check:

```
npm run prettier
```

Apply format:

```
npm run prettier:fix
```

### Commit message guideline

#### Commit Message Format

Each commit message consists of a header, a body and a footer. The header has a special format that includes a type, a scope and a subject:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The header is mandatory and the scope of the header is optional.

The <type> word should be one of the rules items you have written in your .commitlintrc.json file and the <scope> is the module/component you are working on.

Samples:

```
docs(changelog): update changelog to beta.5
```

```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

#### Type

Must be one of the following:

- build: Changes that affect the build system or external
- dependencies (example scopes: gulp, broccoli, npm)
- ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- docs: Documentation only changes
- feat: A new feature
- fix: A bug fix
- perf: A code change that improves performance
- refactor: A code change that neither fixes a bug nor adds a feature
- style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- test: Adding missing tests or correcting existing tests

## Author

- **Haphuthinh**: Lead developer of the project.

This project provides a robust, scalable, and maintainable backend platform suitable for managing music-related data.
# Emobeat-backend
