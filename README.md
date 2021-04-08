# \<bah-utility\>

Brilliant Apps Hub utility service

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed globally.

```
$ npm install -g polymer-cli
```

## Local Development

The following command will run the server locally with [Browser-Sync](https://browsersync.io/) and will report any [ESLint](http://eslint.org/) errors.

```
$ npm run dev
```

## API Reference

Run following command to check for component's API docs. This would also run the server locally with [Browser-Sync](https://browsersync.io/) and will report any [ESLint](http://eslint.org/) errors.

```
$ npm run docs
```

## Running Tests

This package is configured to run [Web Component Tester](https://www.polymer-project.org/1.0/docs/tools/tests) tests.

```
$ polymer test
```
The results in your terminal should look like the following:
```
Installing and starting Selenium server for local browsers
Selenium server running on port 64529
Web server running on port 2000 and serving from /Users/anujparikh/Documents/Projects/Elution-Manager/polymer-webcomponent-seed
chrome 56                Beginning tests via http://localhost:2000/components/polymer-webcomponent-seed/generated-index.html?cli_browser_id=0
chrome failed to maximize
```
There should also be similar Chrome and Firefox browser reports that automatically pop up.

## Linting
This package is configured to run ESlint from the [DET Software Linting](https://github.build.ge.com/DET-Software/eslint-config-det) rules.

```
$ gulp lint
```