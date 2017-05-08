### Stayer
Node.js & TypeScript framework for building REST APIs.

# Injection

This module implements dependency injection for Stayer 
framework. Can be used separately from the framework.

## Public API

@Injection decorator:
```
@Injection(options?: InjectionOptions)

```
Injection options:

```
interface InjectionOptions {
    factory: InjectionFactory,
}
```
Injection factory function type:

```
type InjectionFactory = () => object | Promise<object>;
```
Injector function:
```
function inject(): Promise<WeakMap<Constructable, object>>;
```
Constructable type:
```
type Constructable = {new(...args:any[]):any};
```
Errors
```
InjectionCycleError(message?: string)
InstantiationError(constructable: Constructable, message?: string)
```

## License

Copyright &copy; 2017 Anton Bakhurynskyi

Apache License, Version 2.0

See NOTICE file for more information.
