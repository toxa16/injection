import {Constructable} from '../types/constructable';

/**
 * @copyright 2017 Anton Bakhurynskyi
 * @license Apache License, Version 2.0
 * @see NOTICE file
 */

/**
 * An error thrown when an injection factory internal error occurs.
 */
export class InstantiationError extends Error {
  constructor(constructable: Constructable, message?: string) {
    if (!message) {
      message = `Injection factory internal error occurred ` +
        `while instantiating ${constructable.name}. ` +
        `See log files for more details`;
    }
    super(message);
    this.message = message;
    this.name = this.constructor.name;
  }
}
