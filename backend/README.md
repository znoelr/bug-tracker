# Bug Tracker backend

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A simple bug tracker designed to streamline issue tracking and resolution within your projects.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Features

- **Intuitive API:** Clean API for effortless issue tracking.
- **Swagger Documented:** Documentation available on `http://localhost:3000/api-docs`.
- **Search and Filter:** Easily search and filter issues based on various criteria.
- **Collaboration:** Collaborate with team members by assigning and discussing issues within the platform.

## Installation

To get started with Bug Tracker, follow these steps:

1. Clone the repository:

  ```bash
    git clone https://github.com/znoelr/bug-tracker.git
  ```

2. cd into the project
  ```
    cd bug-tracker/backend
  ```

3. Seed the db
  ```
    npx prisma seed
  ```

4. Start the backend project
  ```
    docker compose up
  ```

5. Open you browser and go to `http://localhost:3000`

## Usage

1. **Signin using an existing account:**
  - `admin` - `abcde$12345`
  - `developer` - `abcde$12345`
  - `manager` - `abcde$12345`
  - `tester` - `abcde$12345`

2. **Create a New Project:** Start by creating a new project and adding team members if necessary.

3. **Add Tasks/Issues:** Create issues within the project, providing a clear title, description, and assigning it to team members.

4. **Track Progress:** Monitor the status of issues, add comments for discussion, and update the status as tasks are completed.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
