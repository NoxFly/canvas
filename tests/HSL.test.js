const Canvas = require('../canvas');

const HSL = Canvas.__get__('HSL');

let Color = new HSL(240, 0.333, 0.118);

test('HSL to RGB', () => {
    const res = Color.toRGB();
    expect(res).toBeInstanceOf(Canvas.__get__('RGB'));
    expect(res.color).toMatchObject({r: 20, g: 20, b: 40});
});