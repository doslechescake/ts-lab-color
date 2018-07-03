export default class StartupHandler {
    private constructor() {}

    public static success(): void {
        const wrapperElement: HTMLDivElement = document.createElement('div');
        const textElement: HTMLParagraphElement = document.createElement('p');

        textElement.textContent = 'The app has been started successfully';

        wrapperElement.appendChild(textElement);
        document.body.appendChild(wrapperElement);
    }

    public static error(error: Error): void {
        console.log(error);
    }
}