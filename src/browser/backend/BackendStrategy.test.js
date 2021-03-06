describe('BackendStrategy', () => {
  const BackendStrategy = require('./BackendStrategy').default;

  const strategy = new BackendStrategy({ type: 'test' });
  (Object.getOwnPropertyNames(BackendStrategy.prototype))
    .filter(key => key !== 'constructor')
    .forEach((key) => {
      describe(key, () => {
        it('shhould be abstract method', async () => {
          await strategy[key]().then(
            () => {
              throw new Error('Should not be resolved');
            },
            () => {},
          );
        });
      });
    });
});
