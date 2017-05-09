/**
 * @copyright 2017 Anton Bakhurynskyi
 * @license Apache License, Version 2.0
 * @see NOTICE file
 */
import {Constructable} from '../types/constructable';
import {InjectionFactory} from '../types/injection-factory';

/**
 * An interface representing a registered injection.
 */
export interface InjectionRecord {
  constructor: Constructable,
  dependencies: Constructable[],
  factory: InjectionFactory,
}
