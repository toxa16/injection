/**
 * @copyright 2017 Anton Bakhurynskyi
 * @license Apache License, Version 2.0
 * @see NOTICE file
 */

/**
 * Represents an injection factory function.
 */
export type InjectionFactory = () => object | Promise<object>;
