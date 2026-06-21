export class BadRequestError extends Error {
  statusCode = 400

  constructor(message: string) {
    super(message)
    this.name = 'BadRequestError'
  }
}

export class NotFoundError extends Error {
  statusCode = 404

  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class GoneError extends Error {
  statusCode = 410

  constructor(message: string) {
    super(message)
    this.name = 'GoneError'
  }
}
