// tests/example.test.ts
describe('Example test suite', () => {
  it('should add numbers correctly', () => {
    const sum = (a: number, b: number) => a + b;
    expect(sum(2, 3)).toBe(5);
  });
});