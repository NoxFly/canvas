const Canvas = require('../canvas');

const HEX = Canvas.__get__('HEX');

let Color = new HEX('#ffffff');

test('Hex to RGB', () => {
    const res = Color.toRGB();
    expect(res).toBeInstanceOf(Canvas.__get__('RGB'));
    expect(res.color).toMatchObject({r: 255, g: 255, b: 255});
});