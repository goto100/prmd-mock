# prmd-mock
mock server for prmd

## differents from `prmd stub`?

prmd-mock using [json-schema-faker](https://github.com/json-schema-faker/json-schema-faker) to generate random mock data, `prmd stub` just using the `example` in schema file.

## How to use it?

1. `npm install prmd-mock -g`
2. `cd YOUR_PROJECT_WHICH_HAS_SCHEMATA_FOLDER`
3. `prmd-mock`
4. visit `http://localhost:8001/` with the link hrefs in your schema files.
