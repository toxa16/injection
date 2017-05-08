import {InjectionRecord} from '../interfaces/injection-record';
import {Constructable} from '../types/constructable';
import {InstantiationError} from '../errors/instantiation.error';

/**
 * @copyright 2017 Anton Bakhurynskyi
 * @license Apache License, Version 2.0
 * @see NOTICE file
 */

/**
 * Instantiates factory injections from given injection records array.
 *
 * @param records {InjectionRecord[]} factory injection records array
 *
 * @return {Promise<WeakMap<Constructable, object>>} a WeakMap of
 * factory injection instances (asynchronous)
 *
 * @throws {InstantiationError} when an injection factory internal
 * error occurs
 */
export function instantiateFactories(
  records: InjectionRecord[]
): Promise<WeakMap<Constructable, object>> {

  const factories = [];
  for (const record of records) {
    try {
      let factoryResult = record.factory();
      if (factoryResult instanceof Promise) {
        factoryResult = factoryResult.catch(err => {
          // TODO: log err
          throw new InstantiationError(record.constructor);
        });
      }
      factories.push(factoryResult);
    } catch (err) {
      // TODO: log err
      return Promise.reject(
        new InstantiationError(record.constructor));
    }

  }

  return Promise.all(factories)
    .then(factoryResults => {
      const instanceMap = new WeakMap<Constructable, object>();
      for (const record of records) {
        instanceMap.set(record.constructor, factoryResults.shift());
      }
      return instanceMap;
    });

}
