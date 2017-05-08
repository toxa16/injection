import * as assert from 'assert';
import {AssertionError} from 'assert';
import {injectInternal} from '../../src/injectors/inject-internal';
import {InjectionRecord} from '../../src/interfaces/injection-record';
import {InjectionCycleError} from '../../src/errors/injection-cycle.error';

/**
 * @copyright 2017 Anton Bakhurynskyi
 * @license Apache License, Version 2.0
 * @see NOTICE file
 */

describe('injectInternal()', () => {

  it(
    'should instantiate a constructor injection without dependencies',
    (done) => {
      // initializing
      const control = 'Control string.';
      class TestInjection {
        public prop = control;
      }
      const testStorage: InjectionRecord[] = [
        {
          constructor: TestInjection,
          dependencies: [],
          factory: undefined
        }
      ];

      // executing injectInternal()
      injectInternal(testStorage)
        .then(instanceMap => {
          const actualInstance = instanceMap.get(TestInjection);
          assert.ok(actualInstance instanceof TestInjection,
            'Returned instance map should contain ' +
            'the test injection instance');
          assert.strictEqual(actualInstance['prop'], control,
            'Returned instance should possess a property ' +
            'of the test injection class'
          );
          done();
        })
        .catch(done);
    }
  );

  it(
    'should instantiate a constructor injection ' +
    'with an unregistered dependency',
    (done) => {
      // initializing
      class TestDependency {
        public prop = 'Dummy string.';
      }
      class TestInjection {
        constructor(public d: TestDependency) {}
      }
      const testStorage: InjectionRecord[] = [
        {
          constructor: TestInjection,
          dependencies: [TestDependency],
          factory: undefined
        }
      ];

      // executing injectInternal()
      injectInternal(testStorage)
        .then(instanceMap => {
          const actualInstance = instanceMap.get(TestInjection);
          assert.ok(actualInstance instanceof TestInjection,
            'Returned instance map should contain ' +
            'the test injection instance');
          assert.strictEqual(actualInstance['d'], undefined,
            'Unregistered dependency should be undefined');
          done();
        })
        .catch(done);
    }
  );

  it(
    'should instantiate a constructor injection ' +
    'with a registered constructor dependency',
    (done) => {
      // initializing
      const control = { name: 'Control object.' };
      class TestDependency {
        public prop = control;
      }
      class TestInjection {
        constructor(public d: TestDependency) {}
      }

      const testStorage: InjectionRecord[] = [
        {
          constructor: TestInjection,
          dependencies: [TestDependency],
          factory: undefined
        },
        {
          constructor: TestDependency,
          dependencies: [],
          factory: undefined
        }
      ];

      // executing injectInternal()
      injectInternal(testStorage)
        .then(instanceMap => {
          const actualInstance = instanceMap.get(TestInjection);
          assert.ok(actualInstance['d'], 'Injection\'s dependency ' +
            'should be defined');
          assert.strictEqual(actualInstance['d']['prop'], control,
            'Returned instance should possess a property ' +
            'of the dependency instance'
          );
          done();
        })
        .catch(done);
    }
  );

  it(
    'should instantiate a constructor injection ' +
    'with a factory dependency',
    done => {
      const control = { name: 'Control object.' };
      class TestDependency {
        public prop;
      }
      class TestInjection {
        constructor(public d: TestDependency) {}
      }

      const testStorage: InjectionRecord[] = [
        {
          constructor: TestInjection,
          dependencies: [TestDependency],
          factory: undefined
        },
        {
          constructor: TestDependency,
          dependencies: [],
          factory: function () {
            return { prop: control };
          }
        }
      ];

      // executing injectInternal()
      injectInternal(testStorage)
        .then(instanceMap => {
          const actualInstance = instanceMap.get(TestInjection);
          assert.ok(actualInstance['d'], 'Injection\'s dependency ' +
            'should be defined');
          assert.strictEqual(actualInstance['d']['prop'], control,
            'Returned instance should possess a property ' +
            'of the dependency instance'
          );
          done();
        })
        .catch(done);
    }
  );

  it(
    'should instantiate several injections ' +
    'with common constructor dependency',
    (done) => {
      // initializing
      const control = 3e10;
      class TestDependency {
        public prop = control;
      }
      class TestInjection1 {
        constructor(public d: TestDependency) {}
      }
      class TestInjection2 {
        constructor(public d: TestDependency) {}
      }
      class TestInjection3 {
        constructor(public d: TestDependency) {}
      }

      const testStorage: InjectionRecord[] = [
        {
          constructor: TestInjection1,
          dependencies: [TestDependency],
          factory: undefined
        },
        {
          constructor: TestInjection2,
          dependencies: [TestDependency],
          factory: undefined
        },
        {
          constructor: TestInjection3,
          dependencies: [TestDependency],
          factory: undefined
        },
        {
          constructor: TestDependency,
          dependencies: [],
          factory: undefined
        }
      ];

      // executing injectInternal()
      injectInternal(testStorage)
        .then(instanceMap => {
          const instance1 = instanceMap.get(TestInjection1);
          const instance2 = instanceMap.get(TestInjection2);
          const instance3 = instanceMap.get(TestInjection3);

          // asserting dependency definition
          assert.ok(instance1['d'], 'First injection\'s ' +
            'dependency should be defined');
          assert.ok(instance2['d'], 'Second injection\'s ' +
            'dependency should be defined');
          assert.ok(instance3['d'], 'Third injection\'s ' +
            'dependency should be defined');

          // asserting dependency property access
          assert.strictEqual(instance1['d']['prop'], control,
            'First instance should possess a property ' +
            'of the dependency instance'
          );
          assert.strictEqual(instance2['d']['prop'], control,
            'Second instance should possess a property ' +
            'of the dependency instance'
          );
          assert.strictEqual(instance3['d']['prop'], control,
            'Third instance should possess a property ' +
            'of the dependency instance'
          );
          done();
        })
        .catch(done);
    }
  );

  it(
    'should instantiate an injection with several dependencies',
    done => {
      // initializing
      const control1 = 3e10;
      const control2 = 'Control string.';
      const control3 = { name: 'Control object.' };
      class TestDependency1 {
        public prop = control1;
      }
      class TestDependency2 {
        public prop = control2;
      }
      class TestDependency3 {
        public prop = control3;
      }
      class TestInjection {
        constructor(
          public d3: TestDependency3,
          public d1: TestDependency1,
          public d2: TestDependency2,
        ) {}
      }

      const testRecords: InjectionRecord[] = [
        {
          constructor: TestInjection,
          dependencies: [
            TestDependency3,
            TestDependency1,
            TestDependency2],
          factory: undefined
        },
        {
          constructor: TestDependency1,
          dependencies: [],
          factory: undefined
        },
        {
          constructor: TestDependency2,
          dependencies: [],
          factory: undefined
        },
        {
          constructor: TestDependency3,
          dependencies: [],
          factory: undefined
        },
      ];

      injectInternal(testRecords)
        .then(instanceMap => {
          const instance = instanceMap.get(TestInjection);

          assert.deepEqual(instance['d1']['prop'], control1);
          assert.deepEqual(instance['d2']['prop'], control2);
          assert.deepEqual(instance['d3']['prop'], control3);
          done();
        })
        .catch(done);
    }
  );

  it(
    'should instantiate an injection with transitive dependency',
    (done) => {
      // initializing
      const control = true;
      class TestDependency {
        public prop = control;
      }
      class TestTransitive {
        constructor(public d: TestDependency) {}
      }
      class TestInjection {
        constructor(public t: TestTransitive) {}
      }

      const testStorage: InjectionRecord[] = [
        {
          constructor: TestInjection,
          dependencies: [TestTransitive],
          factory: undefined
        },
        {
          constructor: TestTransitive,
          dependencies: [TestDependency],
          factory: undefined
        },
        {
          constructor: TestDependency,
          dependencies: [],
          factory: undefined
        }
      ];

      // executing injectInternal()
      injectInternal(testStorage)
        .then(instanceMap => {
          const instance = instanceMap.get(TestInjection);

          // asserting dependency definition
          assert.ok(instance['t'], 'Injection\'s ' +
            'transitive dependency should be defined');
          assert.ok(instance['t']['d'], 'Injection\'s ' +
            'root dependency should be defined');

          // asserting dependency property access
          assert.strictEqual(instance['t']['d']['prop'], control,
            'Injection instance should possess a property ' +
            'of the root dependency instance'
          );
          done();
        })
        .catch(done);
    }
  );


  it('should throw an error on injection cycle', done => {
    class TestInjection1 {
      constructor(private d: TestInjection3) {}
    }
    class TestInjection2 {
      constructor(private d: TestInjection1) {}
    }
    class TestInjection3 {
      constructor(private d: TestInjection2) {}
    }

    const testRecords: InjectionRecord[] = [
      {
        constructor: TestInjection1,
        dependencies: [TestInjection3],
        factory: undefined,
      },
      {
        constructor: TestInjection2,
        dependencies: [TestInjection1],
        factory: undefined,
      },{
        constructor: TestInjection3,
        dependencies: [TestInjection2],
        factory: undefined,
      },

    ];

    injectInternal(testRecords)
      .then(() => {
        assert.fail(undefined, undefined,
          `${InjectionCycleError.name} should be thrown`, undefined);
      })
      .catch(err => {
        if (err instanceof AssertionError) {
          throw err;
        }
        assert.equal(err.name, InjectionCycleError.name);
        done();
      })
      .catch(done)
  });

});
