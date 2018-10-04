import IRGBColorSpace from './IRGBColorSpace';

export default class RGBColorSpace implements IRGBColorSpace {
    public r: number;
    public g: number;
    public b: number;

    public constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}