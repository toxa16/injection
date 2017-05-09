/**
 * @copyright 2017 Anton Bakhurynskyi
 * @license Apache License, Version 2.0
 * @see NOTICE file
 */
import {Constructable} from './types/constructable';
import {register} from './register';

/**
 * Registers a constructor injection. For internal use in decorators
 * that are meant to implement the @Injection decorator functionality
 * (constructor injections only).
 *
 * @param constructor {Constructable} an injection class constructor
 * @param dependencies {Constructable[]} array of injection
 * dependencies. Blank array [] by default.
 *
 * @since 0.1.1
 */
export function registerInjection(
  constructor: Constructable,
  dependencies: Constructable[] = [],
): void {

  register.register(constructor, dependencies, undefined);

}
