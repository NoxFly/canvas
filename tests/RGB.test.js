const Canvas = require('../canvas');

const RGB = Canvas.__get__('RGB');

let Color = new RGB(100, 120, 200);

test('Get the red value', () => {
    expect(Color.r).toBe(100);
});

test('Get the green value', () => {
    expect(Color.g).toBe(120);
});

test('Get the blue value', () => {
    expect(Color.b).toBe(200);
});

test('Set red value', () => {
    Color.r = 220;
    expect(Color.r).toBe(220);
    Color.r = -10;
    expect(Color.r).toBe(0);
    Color.r = 300;
    expect(Color.r).toBe(255);
});

test('Get hexadecimal from RGB', () => {
    let rgb = new RGB(255, 255, 255);
    expect(rgb.toHEX().color.str).toBe('#ffffff');
    rgb.set(0, 0, 0);
    expect(rgb.toHEX().color.str).toBe('#000000');
});

test('Test RGB to string', () => {
    let rgb = new RGB(255, 255, 255);
    expect(rgb.toString()).toBe('rgb(255, 255, 255)');
    rgb.set(0, 0, 0);
    expect(rgb.toString()).toBe('rgb(0, 0, 0)');
    rgb.set(1, 10, 20);
    expect(rgb.toString()).toBe('rgb(1, 10, 20)');
});