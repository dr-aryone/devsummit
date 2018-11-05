## Dependencies

You'll need `yarn` (assumed) or `npm`.
You'll also need the `gcloud` command available, with the NodeJS runtime for App Engine.

## Build Steps

1. Clone the project
1. Use `yarn` to install dependencies
1. Run `node app.js` (or `yarn serve`) to start the server for dev

## Deploy Steps

1. (temporarily) Run `yarn gcp-build`
1. Run `gcloud app deploy --project chromedevsummit-site --no-promote`
