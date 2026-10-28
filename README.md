# Expresso

A persistent Express/SQLite API for managing a coffee shop's menus, menu items, employees and timesheets - a capstone project from the Codecademy "Building a Persistent API" course.

## About The Project

The project brief (from the course assignment): build all of the routing and database logic for an internal tool for a coffee shop called Expresso. The tool allows users to create, view, update and delete menus, menu items, employees and employees' timesheets. A React front-end and a Mocha test suite were provided by the course.

The full assignment specification (database table properties and expected route behavior) is preserved in the commit history of this README.

## Built With

- Node.js / Express 4
- SQLite (sqlite3)
- React (front-end provided by the course starter)
- Mocha, Chai and Supertest (test suite provided by the course starter)

## Getting Started

### Prerequisites

- Node.js and npm

### Installation

```bash
npm install
```

### Running the server

```bash
node server.js
```

The server listens on `process.env.PORT`, or on port 4000 by default (where the provided front-end makes its requests). The API uses the root-level `database.sqlite` file; route files open it with `process.env.TEST_DATABASE || './database.sqlite'`.

### Running the tests

```bash
npm test
```

A `seed.js` file is included to populate the database with sample data.

## License

ISC is declared in package.json; no license file is present in this repository.

## Contact

Dylan J. Gerrits - [GitHub](https://github.com/Dyrits)
