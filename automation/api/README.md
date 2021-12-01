# API Automation of Test Project

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

From a terminal, make sure you are standing under project root `api` folder. Run `npm install`. The installing should be no error.

### Setup environment

There are many ways to setup environment variables (env vars). For best practice, either of following ways are recommended:

- Set env vars in `cypress.env.json` under project root folder. Remember to git ignore it if your project is under git source control. This helps to use different values on each machine. More importantly, it is to not reveal sensitive data such as credentials
- Set env vars from terminal. Remember to add `CYPRESS` prefix to any env var that you think cypress will use. For the reason, read [here](https://docs.cypress.io/guides/guides/environment-variables#Option-3-CYPRESS_)

For more options, read [here](https://docs.cypress.io/guides/guides/environment-variables)

List of environment variables for current use:
```
TODOIST_API_BASE_URL=https://api.todoist.com/sync/v8
TODOIST_API_TOKEN=<todoist api token>
TODOIST_PROJECT_ID=<todoist project id>
CLEAN_TODO_BEFORE_SUITE=1
```

### Run tests

Before running tests, make sure you environment variables are set with expected values.

> To run tests in cli mode, run `npm test`

> To run tests from ui, run `npm run cypress`. This command launches [cypress](https://www.cypress.io/) test runner

Feel free to add more test commands to `package.json` file under `api` folder