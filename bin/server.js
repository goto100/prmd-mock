#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const koa = require('koa');
const Ajv = require('ajv');
const validate = require('../lib/validate');
const mock = require('../lib/mock');
const hrefToPath = require('../lib/utils').hrefToPath;

const app = koa();
app.use(require('koa-body')());
const ajv = new Ajv();
const router = new (require('koa-router'))();
const schemaPath = path.join(process.cwd(), 'schemata');
if (!fs.existsSync(schemaPath)) {
	throw new Error('no schemata found');
	process.exit(1);
}
const files = fs.readdirSync(schemaPath);
files.forEach(file => {
	if (path.extname(file) !== '.json') {
		return;
	}
	const name = path.basename(file, '.json');
	const schema = require(path.join(schemaPath, file));
	delete schema.$schema;
  const schemaId = '/' + schema.id;
  ajv.addSchema(schema, schemaId);

  ;(schema.links || []).forEach(link => {
    router[link.method.toLowerCase()](hrefToPath(link.href), validate(ajv, link), mock(ajv, schemaId, link));
  });
});

app.use(router.routes());

const server = app.listen(8001, () => {
	console.log(`Server listening on port ${server.address().port}`);
});
