/**
 * @copyright 2017 Anton Bakhurynskyi
 * @license Apache License, Version 2.0
 * @see NOTICE file
 */

import {Constructable} from '../types/constructable';
import {instantiateFactories} from './instantiate-factories';
import {InjectionRecord} from '../interfaces/injection-record';
import {InjectionCycleError} from '../errors/injection-cycle.error';

/**
 * Instantiates injections with their dependencies from given
 * injection records array. Throws errors when injection cycle
 * encountered or when injection factory internal error occurs.
 *
 * @param records {InjectionRecord[]} injection record array
 *
 * @return {Promise<WeakMap<Constructable, Object>>} a WeakMap of
 * injection instances (asynchronous)
 *
 * @throws {InjectionCycleError} when an injection cycle encountered
 * @throws {InstantiationError} when an injection factory internal
 * error occurs, InstantiationError is rethrown
 */
export async function injectInternal(
  records: InjectionRecord[]
): Promise<WeakMap<Constructable, object>> {

  // selecting factory injections
  const factoryInjections = records.filter(record => {
    return !!record.factory;
  });

  // getting factory injections map
  const instanceMap = await instantiateFactories(factoryInjections);

  // deleting instantiated factory injection records
  for (const record of records) {
    if (instanceMap.has(record.constructor)) {
      const index = records.indexOf(record);
      records.splice(index, 1);
    }
  }

  // injecting & instantiating...
  while (records.length) {

    // selecting injections without registered dependencies
    const instantiationCandidates: InjectionRecord[] = [];
    for (const record of records) {
      let isCandidate: boolean = true;
      for (const dependency of record.dependencies) {
        const hasRegistered = records.some(r => {
          return r.constructor === dependency;
        });

        if (hasRegistered) {
          isCandidate = false;
          break;
        }
      }
      if (isCandidate) {
        // to instantiation candidates
        instantiationCandidates.push(record);
      }
    }

    // no candidates - injection cycle
    if (instantiationCandidates.length === 0) {
      let injectionList: string = records[0].constructor.name;
      for (let i = 1; i < records.length; i++) {
        injectionList += '-' + records[i].constructor.name;
      }
      throw new InjectionCycleError(
        'An injection cycle encountered among injections ' +
        injectionList);
    }

    // if there are instance candidates
    for (const candidate of instantiationCandidates) {
      const dependencies = candidate.dependencies;
      const args = [];
      for (const dependency of dependencies) {
        args.push(instanceMap.get(dependency));
      }
      const instance = new candidate.constructor(...args);
      instanceMap.set(candidate.constructor, instance);
      const index = records.indexOf(candidate);
      records.splice(index, 1);
    }
  }

  return instanceMap;
}
