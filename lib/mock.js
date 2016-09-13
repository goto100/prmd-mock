const jsf = require('json-schema-faker');

function deref(_schema, validate) {
  let schema = _schema;
  if (typeof schema === undefined) {
    throw new Error();
  }
  if (!validate.refs) {
    throw new Error(`cyclic dependency ${validate.root.schema.id} -> ${schema.$ref}`);
  }

  if (Array.isArray(schema)) {
    schema.forEach((item, i) => {
      schema[i] = deref(item, validate);
    });
    return schema;
  }

  if (typeof schema === 'object' && schema !== null) {
    if (schema.$ref) {
      const ref = schema.$ref.replace(/#\/?$/, ''); // { normalizeId } from 'ajv/lib/compile/resolve'
      const resolved = validate.refVal[validate.refs[ref]];
      if (typeof resolved === 'function') {
        return deref(resolved.schema, resolved);
      } else {
        return resolved;
      }
    }

    if (schema.properties) {
      Object.keys(schema.properties).forEach(key => {
        schema.properties[key] = deref(schema.properties[key], validate);
      });
    }
    if (schema.patternProperties) {
      Object.keys(schema.patternProperties).forEach(key => {
        schema.patternProperties[key] = deref(schema.patternProperties[key], validate);
      });
    }

    // won't deref $ref in definitions and links, this will make jsf try to deref it and throw errors,
    // just delete them, jsf don't need them.
    delete schema.definitions;
    delete schema.links;

    return schema;
  }

  return schema;
}

module.exports = function (ajv, schemaId, link) {
  return function * (next) {
    const validate = ajv.getSchema(schemaId);
    const mockSchema = deref(validate.schema, validate);
    if (link.rel !== 'empty') {
      let sample;
      if (link.rel === 'instances') {
        sample = jsf({
          type: 'array',
          items: mockSchema,
        });
      } else {
        sample = jsf(mockSchema);
      }
      this.body = sample;
    }
    yield next;
  }
}
