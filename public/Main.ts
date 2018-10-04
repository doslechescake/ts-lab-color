import ColorSpaceConverter from './ColorSpaceConverter';
import StartupHandler from './StartupHandler';
import ImageRecolor from './ImageRecolor';

class Main {
    public static main(): void {
        const imageRecolor: ImageRecolor = ImageRecolor.create(
            document.querySelector('.js-image');
        );

        imageRecolor.convertColorToLab();

        console.log(ColorSpaceConverter.rgbToLab({r: 10, g: 144, b: 19}));
        console.log(ColorSpaceConverter.rgbToXyz({r: 10, g: 144, b: 19}));
        console.log(ColorSpaceConverter.xyzToLab({x: 0.2, y: 0.122, z: 0.89}));


        console.log(ColorSpaceConverter.compareRgbColors(
            {r: 10, g: 144, b: 19},
            {r: 68, g: 144, b: 10}
        ));

        console.log(ColorSpaceConverter.compareRgbColors(
            {r: 10, g: 144, b: 19},
            {r: 86, g: 10, b: 144}
        ));
    }
}

try {
    Main.main();
    StartupHandler.success();
} catch (error) {
    StartupHandler.error(error);
}
