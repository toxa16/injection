import 'reflect-metadata';
import {InjectionRecord} from './interfaces/injection-record';
import {Constructable} from './types/constructable';
import {InjectionFactory} from './types/injection-factory';
import {InjectionOptions} from './interfaces/injection-options';

/**
 * @copyright 2017 Anton Bakhurynskyi
 * @license Apache License, Version 2.0
 * @see NOTICE file
 */

/**
 * Injection record storage. Treat this as an external storage.
 * @type {InjectionRecord[]}
 */
const storage: InjectionRecord[] = [];

/**
 * Injection register class.
 */
export class Register {

  constructor(private storage: InjectionRecord[]) {}

  /**
   * Registers an injection.
   * @param constructor
   * @param dependencies
   * @param options
   */
  register(
    constructor: Constructable,
    dependencies: Constructable[],
    options: InjectionOptions,
  ): void {

    let factory: InjectionFactory = undefined;
    let _dependencies: Constructable[] = dependencies;
    if (options) {
      factory = options.factory;
      _dependencies = [];
    }
    const record: InjectionRecord = {
      constructor, dependencies: _dependencies, factory
    };

    const hasRegistered = this.storage
      .some(record => record.constructor === constructor);

    if (hasRegistered) {
      throw new SyntaxError(
        `Duplicate @Injection() decorator on ${constructor.name}`);
    } else {
      this.storage.push(record);
    }

  }

  /**
   * Returns an array of registered injections.
   * @return {InjectionRecord[]}
   */
  get(): InjectionRecord[] {
    return this.storage;
  }

}

/**
 * Injection register instance. Treat it as an external component.
 * @type {Register}
 */
export const register = new Register(storage);
