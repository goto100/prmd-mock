module.exports = function (ajv, link) {
  return function * (next) {
    const method = link.method;
    if (['PUT', 'PATCH', 'POST'].indexOf(method) !== -1) {
      const validate = ajv.compile(link.schema);
      const valid = validate(this.request.body);
      if (!valid) this.throw(validate.errors[0].message, 422);
    }
    yield next;
  }
}
