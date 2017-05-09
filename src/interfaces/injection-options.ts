/**
 * @copyright 2017 Anton Bakhurynskyi
 * @license Apache License, Version 2.0
 * @see NOTICE file
 */
import {InjectionFactory} from '../types/injection-factory';

/**
 * An interface representing the @Injection() decorator parameters.
 */
export interface InjectionOptions {
  factory: InjectionFactory,
}
