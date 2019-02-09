var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Arpg2dGameStart = /** @class */ (function (_super) {
    __extends(Arpg2dGameStart, _super);
    function Arpg2dGameStart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Arpg2dGameStart.prototype.init = function () {
        var _this = this;
        Scene_data.fileRoot = "https://webpan.oss-cn-shanghai.aliyuncs.com/upfile/shadertree/";
        Scene_data.fileuiRoot = "res/";
        ModuleList.startup(); //启动所有模块
        Pan3d.UIData.Scale = 1;
        materialui.MtlUiData.Scale = 1;
        Pan3d.Engine.initPbr();
        Pan3d.GameMouseManager.getInstance().addMouseEvent();
        Pan3d.ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.SHOW_MATERIA_PANEL));
        Pan3d.ModuleEventManager.dispatchEvent(new popmodel.PopModelShowEvent(popmodel.PopModelShowEvent.SHOW_POP_MODEL_PANEL));
        //   Pan3d.ModuleEventManager.dispatchEvent(new folder.FolderEvent(folder.FolderEvent.SHOW_FOLDER_PANEL));
        Pan3d.UIData.resize = function () { _this.resize(); }; //更尺寸变化
    };
    Arpg2dGameStart.prototype.resize = function () {
        Pan3d.UIData.Scale = 1;
    };
    return Arpg2dGameStart;
}(Pan3d.GameStart));
//# sourceMappingURL=Arpg2dGameStart.js.map