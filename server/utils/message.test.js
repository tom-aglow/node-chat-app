const expect = require('expect');
const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const { from, text, createdAt } = generateMessage('foo', 'bar');

    expect(from).toBe('foo');
    expect(text).toBe('bar');
    expect(createdAt).toBeA('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = 'john';
    const lat = 15;
    const lng = 20;
    const url = `https://google.com/maps?q=${lat},${lng}`;
    const msg = generateLocationMessage(from, {lat, lng});

    expect(msg).toInclude({from, url});
    expect(msg.createdAt).toBeA('number');
  });
});
