var scene2d;
(function (scene2d) {
    var Scene2dInit = /** @class */ (function () {
        function Scene2dInit() {
        }
        Scene2dInit.initData = function () {
            //替换SceneManager场景管理对象；
            scene2d.Override2dSceneManager.initConfig();
            //替换Engine引擎对象；
            scene2d.Override2dEngine.initConfig();
            Pan3d.Scene_data.fileRoot = " http://" + document.domain + "/res/";
            Pan3d.Engine.init(mainpan3d.canvas); //初始化场景
            Pan3d.Engine.resetSize(mainpan3d.canvas.width, mainpan3d.canvas.height); //设置canvas大小
            Pan3d.Engine.initPbr();
            Scene2dInit.isConfig = true; //完成
            Pan3d.SceneManager.getInstance().ready = true; //场景update可以
        };
        Scene2dInit.addGridLineSprite = function () {
            Pan3d.ProgrmaManager.getInstance().registe(Pan3d.LineDisplayShader.LineShader, new Pan3d.LineDisplayShader);
            Pan3d.SceneManager.getInstance().addDisplay(new Pan3d.GridLineSprite());
        };
        Scene2dInit.isConfig = false;
        return Scene2dInit;
    }());
    scene2d.Scene2dInit = Scene2dInit;
})(scene2d || (scene2d = {}));
//# sourceMappingURL=Scene2dInit.js.map