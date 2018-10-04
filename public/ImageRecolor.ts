import IRGBColorSpace from './models/IRGBColorSpace';
import RGBColorSpace from './models/RGBColorSpace';
import ColorSpaceConverter from './ColorSpaceConverter';
import ICIELABColorSpace from './models/ICIELABColorSpace';

export default class ImageRecolor {
    private __canvas: HTMLCanvasElement;

    private constructor(canvas: HTMLCanvasElement) {
        this.__canvas = canvas;
    }

    public static create(canvas: HTMLCanvasElement): ImageRecolor {
        return new ImageRecolor(canvas);
    }

    public convertColorToLab(): void {
        const context: CanvasRenderingContext2D = this.__canvas.getContext('2d');
        const image: HTMLImageElement = new Image();
        image.src = 'http://localhost:8080/assets/flower.jpg';
        image.crossOrigin = 'Anonymous';
        image.onload = imageLoadHandler.bind(this);

        function imageLoadHandler() {
            this.__canvas.width = image.width;
            this.__canvas.height = image.height;
            context.drawImage(image, 0, 0);

            this.__recolorRgbToLab(this.__canvas, context);
        }
    }

    private __recolorRgbToLab(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
        const imageData: ImageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data: Uint8ClampedArray = imageData.data;

        let i: number;
        let len: number;
        let rgb: IRGBColorSpace;
        let lab: ICIELABColorSpace;
        for (i = 0, len = data.length; i < len; i += 4) {
            rgb = new RGBColorSpace(
                data[i],
                data[i + 1],
                data[i + 2]
            );

            lab = ColorSpaceConverter.rgbToLab(rgb);


            data[i] = (Math.abs(lab.b*2)/256)*255;
            data[i + 1] = (Math.abs(lab.a*2)/256)*255;
            data[i + 2] = (lab.L/100)*255;

            // console.log(data[i], lab.L);
            // console.log(data[i+1], lab.a);
            // console.log(data[i+2], lab.b);
        }

        context.putImageData(imageData, 0, 0);
    }

}