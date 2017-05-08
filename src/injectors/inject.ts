import {injectInternal} from './inject-internal';
import {register} from '../register';
import {Constructable} from '../types/constructable';

/**
 * @copyright 2017 Anton Bakhurynskyi
 * @license Apache License, Version 2.0
 * @see NOTICE file
 */

/**
 * Injects dependencies and instantiates all injections registered
 * with @Injection() decorator. Returns asynchronously a WeakMap of
 * instantiated injections with injection constructor as a map key.
 * Throws errors when an injection cycle encountered or when an
 * injection factory internal error occurs.
 *
 * @return {Promise<WeakMap<Constructable, Object>>} a WeakMap of
 * injection instances (asynchronous)
 *
 * @throws {InjectionCycleError} when an injection cycle encountered
 * @throws {InstantiationError} when an injection factory internal
 * error occurs
 */
export function inject(): Promise<WeakMap<Constructable, object>> {
  const records = register.get();
  return injectInternal(records);
}
