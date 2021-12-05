# Integrations Automation of Test Project

## Installation

### Nodejs

> On Windows, download and install nodejs at https://nodejs.org/en/download/

> On Linux and Mac, recommended to use [nvm](https://github.com/nvm-sh/nvm#install--update-script)

After installation, open a new terminal then type `node -v` if nodejs has been installed successfully.

```shell
> node -v
v16.13.0 # this project was initialized with this node version
```

### Install npm packages

From a terminal, make sure you are standing under project root `integrations` folder. Run `npm install`. The installing should be no error.

### Setup environment

To set environment variables, create `.env` file under the root project directory and set proper values for variables. For more info, see [dotenv](https://www.npmjs.com/package/dotenv)

List of environment variables for current use:
```
TODOIST_API_BASE_URL=https://api.todoist.com/sync/v8
TODOIST_WEB_BASE_URL=https://todoist.com
TODOIST_PROJECT_ID=<project id>
TODOIST_API_TOKEN=<todoist api token>
TODOIST_USERNAME=<todoist user name>
TODOIST_PASSWORD=<todoist password>
GOOGLE_CLIENT_ID=<google client id>
GOOGLE_CLIENT_SECRETE=<google client secrete>
GOOGLE_REFRESH_TOKEN=<google refresh token>
SYNC_DURATION=10000
```

**Notes:** `SYNC_DURATION` might take longer to sync between Todoist and Google Calendar and via versa

### Run tests

Before running tests, make sure you environment variables are set with expected values.

> To run tests in cli mode, run `npm run test`

Feel free to add more test commands to `package.json` file under `integrations` folder