/**
 * @copyright 2017 Anton Bakhurynskyi
 * @license Apache License, Version 2.0
 * @see NOTICE file
 */

/**
 * An error thrown when an injection cycle encountered.
 */
export class InjectionCycleError extends Error {
  constructor(message?: string) {
    (!!message) ? super(message) : super();
    this.message = message;
    this.name = this.constructor.name;
  }
}
