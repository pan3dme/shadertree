var TextEditStart = /** @class */ (function () {
    function TextEditStart() {
    }
    TextEditStart.initCanvas = function ($caves) {
        mainpan3d.canvas = $caves;
        Pan3d.Scene_data.fileRoot = "res/";
        Pan3d.Engine.init($caves);
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
        if (requestAnimationFrame) {
            requestAnimationFrame(TextEditStart.step);
        }
        TextEditStart.resetSize();
        var game = new Arpg2dGameStart();
        game.init();
    };
    TextEditStart.resetSize = function () {
        if (mainpan3d.canvas) {
            mainpan3d.canvas.width = document.body.clientWidth;
            mainpan3d.canvas.height = document.body.clientHeight;
            Pan3d.Engine.resetSize(mainpan3d.canvas.width, mainpan3d.canvas.height); //设置canvas大小
        }
    };
    TextEditStart.step = function (timestamp) {
        requestAnimationFrame(TextEditStart.step);
        TextEditStart.upFrame();
    };
    TextEditStart.upFrame = function () {
        Pan3d.Scene_data.context3D.update();
        Pan3d.Engine.update();
    };
    return TextEditStart;
}());
//# sourceMappingURL=TextEditStart.js.map