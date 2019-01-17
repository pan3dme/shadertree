var scene3d;
(function (scene3d) {
    var Scene3dInit = /** @class */ (function () {
        function Scene3dInit() {
        }
        Scene3dInit.initData = function () {
            //替换SceneManager场景管理对象；
            scene3d.OverrideSceneManager.initConfig();
            //替换Engine引擎对象；
            scene3d.OverrideEngine.initConfig();
            //初始化场景
            Pan3d.Engine.init(mainpan3d.canvas);
            scene3d.OverrideBloodManager.getInstance();
            Pan3d.Engine.resetSize(mainpan3d.canvas.width, mainpan3d.canvas.height); //设置canvas大小
            Pan3d.Engine.initPbr();
            Scene3dInit.isConfig = true; //完成
            Pan3d.SceneManager.getInstance().ready = true; //场景update可以
        };
        Scene3dInit.isConfig = false;
        return Scene3dInit;
    }());
    scene3d.Scene3dInit = Scene3dInit;
})(scene3d || (scene3d = {}));
//# sourceMappingURL=Scene3dInit.js.map