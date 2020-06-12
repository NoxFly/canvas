const Canvas = require('../canvas');

const HEX = Canvas.__get__('HEX');

let Color = new HEX('#ffffff');

test('Hex to RGB', () => {
    const res = Color.toRGB();
    expect(res).toBeInstanceOf(Canvas.__get__('RGB'));
    expect(res.color).toMatchObject({r: 255, g: 255, b: 255});
});

describe('HEX to string', () => {
    let hex = new HEX('#aaa');

    it('should convert 3 character hexadecimal to 6 character hexadecimal', () => {
        expect(hex.toString()).toBe('#aaaaaa');
    });

    it('should return the same value', () => {
        hex.set('#fa9822');
        expect(hex.toString()).toBe('#fa9822');
    });
});
