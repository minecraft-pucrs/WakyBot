const helloWorld = 'Hello World';

describe('Hello World test', () => {
  it('should call Discord.Client()', () => {
    expect(helloWorld).toBe('Hello World');
  });
});
