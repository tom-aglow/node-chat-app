const expect = require('expect');
const { generateMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const { from, text, createdAt } = generateMessage('foo', 'bar');

    expect(from).toBe('foo');
    expect(text).toBe('bar');
    expect(createdAt).toBeA('number');
  });
});
