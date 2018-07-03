import IRGBColorSpace from './models/IRGBColorSpace';
import IXYZColorSpace from './models/IXYZColorSpace';
import ICIELABColorSpace from './models/ICIELABColorSpace';

class ColorSpaceConverter {
    private constructor() {}

    /**
     * Transformation from RGB to XYZ
     * @link: https://en.wikipedia.org/wiki/SRGB#The_sRGB_transfer_function_.28.22gamma.22.29
     * @link: http://www.ryanjuckett.com/programming/rgb-color-space-conversion/?start=2
     *
     * D65 defined values
     * @link: http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
     *
     */
    public static rgbToXyz(rgbColorSpace: IRGBColorSpace): IXYZColorSpace {
        let r: number = rgbColorSpace.r / 255;
        let g: number = rgbColorSpace.g / 255;
        let b: number = rgbColorSpace.b / 255;

        r = ColorSpaceConverter.rgbGammaCorrection(r);
        g = ColorSpaceConverter.rgbGammaCorrection(g);
        b = ColorSpaceConverter.rgbGammaCorrection(b);

        // D65/2° standard illuminant.
        const x: number = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
        const y: number = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
        const z: number = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;

        return {x, y, z};
    }


    /**
     * Transformation from XYZ to LAB (CIELab)
     * @link: https://en.wikipedia.org/wiki/CIELAB_color_space#Forward_transformation
     */
    public static xyzToLab(xyzColorSpace: IXYZColorSpace): ICIELABColorSpace {
        // Observer= 2°, Illuminant= D65
        const xNormalized: number = xyzColorSpace.x / 95.047;
        const yNormalized: number = xyzColorSpace.y / 100.000;
        const zNormalized: number = xyzColorSpace.z / 108.883;

        const x = ColorSpaceConverter.xyzGammaCorrection(xNormalized);
        const y = ColorSpaceConverter.xyzGammaCorrection(yNormalized);
        const z = ColorSpaceConverter.xyzGammaCorrection(zNormalized);

        const L: number = (116 * y) - 16;
        const a: number = 500 * (x - y);
        const b: number = 200 * (y - z);

        return {L, a, b};
    }

    public static rgbToLab(rgbColor: IRGBColorSpace): ICIELABColorSpace {
        return ColorSpaceConverter.xyzToLab(
            ColorSpaceConverter.rgbToXyz(rgbColor)
        );

    }

    public static compareRgbColors(firstRgbColor: IRGBColorSpace, secondRgbColor: IRGBColorSpace): any {
        const firstLabColor: ICIELABColorSpace = ColorSpaceConverter.rgbToLab(firstRgbColor);
        const secondLabColor: ICIELABColorSpace = ColorSpaceConverter.rgbToLab(secondRgbColor);

        return this.calculateDeltaE(firstLabColor, secondLabColor);
    }

    // DeltaE calculation for CIE 1976
    public static calculateDeltaE(firstLabColor: ICIELABColorSpace, secondLabColor: ICIELABColorSpace): any {
        return Math.sqrt(
            Math.pow(firstLabColor.L - secondLabColor.L, 2) +
            Math.pow(firstLabColor.a - secondLabColor.a, 2)
            + Math.pow(firstLabColor.b - secondLabColor.b, 2));
    }

    private static rgbGammaCorrection(color: number): number {
        return (color > 0.04045 ? Math.pow((color + 0.055) / 1.055, 2.4) : color / 12.92) * 100;
    }

    private static xyzGammaCorrection(value: number): number {
        return value > 0.008856 ? Math.cbrt(value) : (7.787 * value) + (16 / 116);
    }
}

export default ColorSpaceConverter;