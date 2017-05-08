/**
 * @copyright 2017 Anton Bakhurynskyi
 * @license Apache License, Version 2.0
 * @see NOTICE file
 */

/**
 * Represents an object which can be instantiated with "new" keyword.
 */
export type Constructable = {new(...args:any[]):any};

/**
 * Represents an injection factory function.
 */
export type InjectionFactory = () => object | Promise<object>;

/**
 * An interface representing the @Injection() decorator parameters.
 */
export interface InjectionOptions {
  factory: InjectionFactory,
}

/**
 * The @Injection() class decorator.
 * @param options {InjectionOptions} [optional]
 */
export declare function Injection(options?: InjectionOptions);

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
export declare function inject(): Promise<WeakMap<Constructable, object>>;

/**
 * An error thrown when an injection cycle encountered.
 */
export declare class InjectionCycleError extends Error {}

/**
 * An error thrown when an injection factory internal error occurs.
 */
export declare class InstantiationError extends Error {
  constructor(constructable: Constructable, message?: string);
}
