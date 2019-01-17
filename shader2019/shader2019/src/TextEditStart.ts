class TextEditStart {
    public static initCanvas($caves: HTMLCanvasElement): void {
        mainpan3d.canvas = $caves;
        Pan3d.Scene_data.fileRoot = "res/";




        Pan3d.Engine.init($caves);


        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
        if (requestAnimationFrame) {
            requestAnimationFrame(TextEditStart.step);
        }

        TextEditStart.resetSize()


        let game = new Arpg2dGameStart();
        game.init();

    }
    public static resetSize(): void {
        if (mainpan3d.canvas) {
            mainpan3d.canvas.width = document.body.clientWidth
            mainpan3d.canvas.height = document.body.clientHeight
            Pan3d.Engine.resetSize(mainpan3d.canvas.width, mainpan3d.canvas.height); //设置canvas大小
        }
    }
    private static step(timestamp): void {
        requestAnimationFrame(TextEditStart.step);
        TextEditStart.upFrame()
    }
    private static upFrame(): void {

        Pan3d.Scene_data.context3D.update()
        Pan3d.Engine.update();

    }
}