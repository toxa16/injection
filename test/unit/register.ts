import * as assert from 'assert';
import {Register} from '../../src/register';
import {Constructable} from '../../src/types/constructable';
import {InjectionRecord} from '../../src/interfaces/injection-record';
import {InjectionFactory} from '../../src/types/injection-factory';
import {InjectionOptions} from '../../src/interfaces/injection-options';

/**
 * @copyright 2017 Anton Bakhurynskyi
 * @license Apache License, Version 2.0
 * @see NOTICE file
 */

class TestInjection1 {}
class TestInjection2 {}

class TestDependency1 {}
class TestDependency2 {}
class TestDependency3 {}

const testFactory1: InjectionFactory = function () {
  return undefined;
};



describe('Register', () => {

  describe('register()', () => {

    it('should register a constructor injection', () => {
      // initializing storage & register
      const testStorage: InjectionRecord[] = [];
      const register = new Register(testStorage);

      // initializing test record data
      const injection = TestInjection1;
      const dependencies: Constructable[] = [
        TestDependency1, TestDependency2, TestDependency3
      ];
      const options: InjectionOptions = undefined;

      // executing register()
      register.register(injection, dependencies, options);

      // asserting
      const expectedRecord: InjectionRecord = {
        constructor: injection,
        dependencies: dependencies,
        factory: undefined,
      };
      const actualRecord: InjectionRecord = testStorage[0];

      assert.deepEqual(
        actualRecord.constructor,
        expectedRecord.constructor,
        'Test injection constructor should be registered'
      );
      assert.deepEqual(
        actualRecord.dependencies,
        expectedRecord.dependencies,
        'All injection dependencies should be registered'
      );
      assert.strictEqual(
        actualRecord.factory,
        expectedRecord.factory,
        'Injection factory should be undefined'
      );
    });


    it('should register a factory injection', () => {
      // initializing storage & register
      const testStorage: InjectionRecord[] = [];
      const register = new Register(testStorage);

      // initializing test record data
      const injection = TestInjection1;
      const dependencies: Constructable[] = [
        TestDependency1, TestDependency2, TestDependency3
      ];
      const options: InjectionOptions = { factory: testFactory1 };

      // executing register()
      register.register(injection, dependencies, options);

      // asserting
      const expectedRecord: InjectionRecord = {
        constructor: injection,
        dependencies: dependencies,
        factory: options.factory,
      };
      const actualRecord: InjectionRecord = testStorage[0];

      assert.deepEqual(
        actualRecord.constructor,
        expectedRecord.constructor,
        'Test injection constructor should be registered'
      );
      assert.deepEqual(
        actualRecord.dependencies, [],
        'Injection constructor dependencies should not be registered'
      );
      assert.strictEqual(
        actualRecord.factory,
        expectedRecord.factory,
        'Injection factory should be registered'
      );
    });


    it('should register multiple injections', () => {
      // initializing storage & register
      const testStorage: InjectionRecord[] = [];
      const register = new Register(testStorage);

      // executing register()
      register.register(TestInjection1, [], undefined);
      register.register(TestInjection2, [TestDependency1], undefined);
      register.register(TestDependency1, [], undefined);

      // asserting
      const expectedLength = 3;
      const actualLength = testStorage.length;
      assert.strictEqual(actualLength, expectedLength);
    });


    it(
      'should throw SyntaxError on registering the same ' +
      'injection for second time',
      () => {
        // initializing storage & register
        const testStorage: InjectionRecord[] = [];
        const register = new Register(testStorage);

        // executing register()
        register.register(TestInjection1, [], undefined);

        // asserting error
        assert.throws(function () {
          register.register(TestInjection1, [],
            { factory: testFactory1 });
        }, SyntaxError);
      }
    );

  });

});
