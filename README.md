# Expresso

A persistent Express/SQLite API for managing a coffee shop's menus, menu items, employees and timesheets - a capstone project from the Codecademy "Building a Persistent API" course.

## About The Project

The project brief (from the course assignment): build all of the routing and database logic for an internal tool for a coffee shop called Expresso. The tool allows users to create, view, update and delete menus, menu items, employees and employees' timesheets. A React front-end and a Mocha test suite were provided by the course.

The full assignment specification (database table properties and expected route behavior) is preserved in [ASSIGNMENT.md](ASSIGNMENT.md).

## Built With

- Node.js / Express 4
- SQLite (sqlite3)
- React (front-end provided by the course starter)
- Mocha, Chai and Supertest (test suite provided by the course starter)

## Getting Started

### Prerequisites

- Node.js 26 LTS
- pnpm 7.33.7, matching the repository's existing lockfile format
- Python 3, make and a C/C++ compiler if SQLite needs to build from source

### Installation

```bash
pnpm install --frozen-lockfile
```

SQLite 6 prebuilt binaries are platform-dependent. On older Linux systems, a downloaded binary may fail with a glibc version error. Build the native module from source instead:

```bash
pnpm install --frozen-lockfile --ignore-scripts
npm_config_build_from_source=true pnpm rebuild sqlite3
```

The source build needs Node headers as well as the compiler prerequisites above. If headers are already installed locally, set `npm_config_nodedir` to their directory. Source compilation, not the incompatible prebuilt binary, was verified on the Linux test host.

### Running the server

```bash
node server.js
```

The server listens on `process.env.PORT`, or on port 4000 by default (where the provided front-end makes its requests). The API uses the root-level `database.sqlite` file; route files open it with `process.env.TEST_DATABASE || './database.sqlite'`.

### Running the tests

```bash
pnpm test
```

The test runner copies the two fixture databases and API into a temporary directory, runs all 89 original API tests there, and removes the directory. It also checks React server rendering and the inherited fetch implementation. Tests do not modify the tracked databases.

### Building the front-end

```bash
pnpm build
```

Webpack 5 and Babel 7 rebuild the tracked `public/js/bundle.js` and source map. React 15 and Router 4 are retained. The course frontend still expects its API at `http://localhost:4000/api`; the API server does not serve `index.html`. Serve the repository with a separate local static server to use the frontend.

A `seed.js` file is included to populate the database with sample data. It writes to the database and is not run by the tests.

### Dependency verification

The November 2026 refresh was verified on Node 26.13.0 with a fresh frozen pnpm install, source-built SQLite, all 89 API tests, the dependency smoke tests and a production frontend build. Both original and rebuilt browser bundles passed Chromium landing, hash-route navigation and employee create/read checks against the updated API using disposable databases. This is frontend parity, not a claim that the original SQLite 4 backend runs on Node 26: its native binding could not load there.

`pnpm audit` reported zero findings for this lockfile at verification time, down from 24 unique advisories before the refresh. This is a dependency scan, not a full security review. React 15 and Router 4 remain legacy software. The API has no new authentication or deployment configuration.

## License

ISC is declared in package.json; no license file is present in this repository.

## Contact

Dylan J. Gerrits - [GitHub](https://github.com/Dyrits)
