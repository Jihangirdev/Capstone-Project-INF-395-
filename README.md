# StartupHub

StartupHub is a full-stack web application that connects startups and investors in one platform.

## Problem Statement

Many early-stage startups have difficulty presenting their ideas, finding interested investors, and managing communication in one place. At the same time, investors need a simple way to browse startup projects and interact with them.

StartupHub solves this by providing a platform where users can register, explore startup ideas, create their own startup profiles, apply to startups, and save interesting startups to favorites.

The main idea is to create a single web-app that unifies both startups and investors

## Features

* User registration and login with JWT authentication
* Role-based user accounts
* View all startups
* Search and filter startups by category and stage
* View startup details
* Create a startup
* Apply to a startup
* View personal applications
* Update application status
* Manage user profile
* Add and remove favorite startups
* Protected routes for authenticated users
* Swagger/OpenAPI support in backend

## Technology Stack

### Frontend

* React
* Vite
* React Router
* Tailwind CSS
* Framer Motion
* Lucide React

### Backend

* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA
* PostgreSQL
* JWT Authentication
* Springdoc OpenAPI

## Project Structure

```bash
Capstone-Project-INF-395-/
├── backend/
│   ├── src/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
├── AUDIT.md
└── README.md
```

## Frontend Pages

* Welcome Page
* Authentication Page
* Startups Page
* Startup Detail Page
* Create Startup Page
* Profile Page
* Favorites Page

## Backend Configuration

The backend runs on:

```bash
http://localhost:8080
```

The frontend runs on:

```bash
http://localhost:5173
```

The frontend is configured to proxy API requests from:

```bash
/api
```

to:

```bash
http://localhost:8080
```

## Usage

1. Start PostgreSQL.
2. Run the Spring Boot backend.
3. Run the Vite frontend.
4. Open the app in the browser at `http://localhost:5173`.
5. Register a new account or log in.
6. Explore startups, create your own startup, apply to projects, and manage favorites.

## API Overview

Main API groups used in the project:

* `/api/auth` — authentication
* `/api/users` — user profile and user startups
* `/api/startups` — startup listing, details, creation, and applications
* `/api/applications` — current user applications and status updates
* `/api/favorites` — favorite startups

## Developers

* Jetesuly Jihangir
* Ospanov Miras

## Notes

This project was created as a final project for INF-395.

## License
