import * as assert from 'assert';
import {InjectionFactory} from '../../src/types/injection-factory';
import {InjectionRecord} from '../../src/interfaces/injection-record';
import {instantiateFactories} from '../../src/injectors/instantiate-factories';
import {InstantiationError} from '../../src/errors/instantiation.error';
import {TestError} from './test.error';
import {AssertionError} from 'assert';

/**
 * @copyright 2017 Anton Bakhurynskyi
 * @license Apache License, Version 2.0
 * @see NOTICE file
 */

const control = 'Control string.';
const sym = Symbol('prop');
class TestInjection {
  public prop;
}
class TestInjection2 {
  public prop;
}

const testFactory1: InjectionFactory = function () {
  return { [sym]: control };
};
const testFactory2: InjectionFactory = function () {
  return Promise.resolve({ [sym]: control });
};
const testFactory3: InjectionFactory = function () {
  throw new TestError();
};
const testFactory4: InjectionFactory = function () {
  return Promise.reject(new TestError());
};


describe('instantiateFactories()', () => {

  it(
    'should instantiate a synchronous factory injection',
    done => {
      const record: InjectionRecord = {
        constructor: TestInjection,
        dependencies: [],
        factory: testFactory1
      };

      instantiateFactories([record])
        .then(instanceMap => {
          const instance = instanceMap.get(TestInjection);

          assert.ok(instance,
            'Returned map should contain a test injection instance');

          assert.strictEqual(instance[sym], control,
            'The instance should possess the test injection\'s ' +
            'property with a control value');
          done();
        })
        .catch(done);
    }
  );

  it(
    'should instantiate an asynchronous factory injection',
    done => {
      const record: InjectionRecord = {
        constructor: TestInjection,
        dependencies: [],
        factory: testFactory2
      };

      instantiateFactories([record])
        .then(instanceMap => {
          const instance = instanceMap.get(TestInjection);

          assert.ok(instance,
            'Returned map should contain a test injection instance');

          assert.strictEqual(instance[sym], control,
            'The instance should possess the test injection\'s ' +
            'property with a control value');
          done();
        })
        .catch(done);
    }
  );

  it('should instantiate several factory injections', done => {
    const record1: InjectionRecord = {
      constructor: TestInjection,
      dependencies: [],
      factory: testFactory1
    };
    const record2: InjectionRecord = {
      constructor: TestInjection2,
      dependencies: [],
      factory: testFactory2
    };

    const records = [record1, record2];

    instantiateFactories(records)
      .then(instanceMap => {
        for (const record of records) {
          assert.ok(instanceMap.get(record.constructor),
            `${record.constructor.name} should be instantiated`);
        }
        done();
      })
      .catch(done);
  });

  it(
    `should throw ${InstantiationError.name} on ` +
    `synchronous factory internal error`,
    done => {
      const record: InjectionRecord = {
        constructor: TestInjection,
        dependencies: [],
        factory: testFactory3,
      };

      instantiateFactories([record])
        .then(() => {
          assert.fail(undefined, undefined,
            `${InstantiationError.name} should be thrown`, undefined);
        })
        .catch(err => {
          if (err instanceof AssertionError) {
            throw err;
          }
          assert.strictEqual(err.name, InstantiationError.name);
          done();
        })
        .catch(done)
    }
  );

  it(
    `should throw ${InstantiationError.name} on ` +
    `asynchronous factory internal error`,
    done => {
      const record: InjectionRecord = {
        constructor: TestInjection,
        dependencies: [],
        factory: testFactory4,
      };

      instantiateFactories([record])
        .then(() => {
          assert.fail(undefined, undefined,
            `${InstantiationError.name} should be thrown`, undefined);
        })
        .catch(err => {
          if (err instanceof AssertionError) {
            throw err;
          }
          assert.strictEqual(err.name, InstantiationError.name);
          done();
        })
        .catch(done)
    }
  );

});
