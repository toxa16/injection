/**
 * @copyright 2017 Anton Bakhurynskyi
 * @license Apache License, Version 2.0
 * @see NOTICE file
 */
import 'reflect-metadata';
import {register} from './register';
import {Constructable} from './types/constructable';
import {InjectionOptions} from './interfaces/injection-options';

/**
 * The @Injection() class decorator.
 * @param options {InjectionOptions} [optional]
 */
export function Injection(options?: InjectionOptions) {
  return function (constructor: Constructable) {
    const paramTypes: Constructable[] =
      Reflect.getMetadata('design:paramtypes', constructor) || [];
    register.register(constructor, paramTypes, options);
  }
}
