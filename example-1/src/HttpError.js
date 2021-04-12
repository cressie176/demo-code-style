class HttpError extends Error {

  constructor({ code, error }) {
    super(`Error ${code}`);
    this.code = code;
    this.error = error;
  }
}

module.exports = HttpError;