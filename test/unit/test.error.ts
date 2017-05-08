/**
 * @copyright 2017 Anton Bakhurynskyi
 * @license Apache License, Version 2.0
 * @see NOTICE file
 */

export class TestError extends Error {
  constructor(message?: string) {
    (!!message) ? super(message) : super();
    this.message = message;
    this.name = this.constructor.name;
  }
}
