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
var basefolderwin;
(function (basefolderwin) {
    var UIRenderComponent = Pan3d.UIRenderComponent;
    var InteractiveEvent = Pan3d.InteractiveEvent;
    var Rectangle = Pan3d.Rectangle;
    var UIConatiner = Pan3d.UIConatiner;
    var UIMask = Pan3d.UIMask;
    var UIAtlas = Pan3d.UIAtlas;
    var BaseFolderWindow = /** @class */ (function (_super) {
        __extends(BaseFolderWindow, _super);
        function BaseFolderWindow() {
            var _this = _super.call(this) || this;
            _this.left = 300;
            _this._bottomRender = new UIRenderComponent;
            _this.addRender(_this._bottomRender);
            _this._topRender = new UIRenderComponent;
            _this.addRender(_this._topRender);
            _this._bottomRender.uiAtlas = new UIAtlas();
            _this._bottomRender.uiAtlas.setInfo("ui/folder/folder.txt", "ui/folder/folder.png", function () { _this.loadConfigCom(); });
            return _this;
        }
        BaseFolderWindow.prototype.mouseDown = function (evt) {
            this.mouseIsDown = true;
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.stageMouseMove, this);
        };
        BaseFolderWindow.prototype.stageMouseMove = function (evt) {
            this.mouseIsDown = false;
        };
        BaseFolderWindow.prototype.mouseUp = function (evt) {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.stageMouseMove, this);
        };
        BaseFolderWindow.prototype.loadConfigCom = function () {
            this._topRender.uiAtlas = this._bottomRender.uiAtlas;
            this.pageRect = new Rectangle(0, 0, 600, 500);
            this.folderMask = new UIMask();
            this.folderMask.level = 3;
            this.addMask(this.folderMask);
            this.a_bg = this.addEvntBut("a_bg", this._bottomRender);
            this.a_win_tittle = this.addChild(this._topRender.getComponent("a_win_tittle"));
            this.a_win_tittle.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);
            this.a_rigth_line = this.addChild(this._topRender.getComponent("a_rigth_line"));
            this.a_rigth_line.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);
            this.a_bottom_line = this.addChild(this._topRender.getComponent("a_bottom_line"));
            this.a_bottom_line.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);
            this.a_right_bottom = this.addChild(this._topRender.getComponent("a_right_bottom"));
            this.a_right_bottom.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);
            this.a_scroll_bar = this.addChild(this._topRender.getComponent("a_scroll_bar"));
            this.a_scroll_bar.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);
            this.refrishSize();
            this.a_scroll_bar.y = this.folderMask.y;
            this.setUiListVisibleByItem([this.a_scroll_bar], false);
        };
        BaseFolderWindow.prototype.refrishSize = function () {
            this.pageRect.width = Math.max(450, this.pageRect.width);
            this.pageRect.height = Math.max(100, this.pageRect.height);
            this.a_win_tittle.x = 0;
            this.a_win_tittle.y = 0;
            this.a_win_tittle.width = this.pageRect.width;
            this.folderMask.y = this.a_win_tittle.height;
            this.folderMask.x = 0;
            this.folderMask.width = this.pageRect.width - this.a_rigth_line.width;
            this.folderMask.height = this.pageRect.height - this.a_win_tittle.height - this.a_bottom_line.height;
            this.a_bg.x = 0;
            this.a_bg.y = 0;
            this.a_bg.width = this.pageRect.width;
            this.a_bg.height = this.pageRect.height;
            this.a_rigth_line.x = this.pageRect.width - this.a_rigth_line.width;
            this.a_rigth_line.y = this.a_win_tittle.height;
            this.a_rigth_line.height = this.pageRect.height - this.a_win_tittle.height - this.a_right_bottom.height;
            this.a_bottom_line.x = 0;
            this.a_bottom_line.y = this.pageRect.height - this.a_bottom_line.height;
            this.a_bottom_line.width = this.pageRect.width - this.a_right_bottom.width;
            this.a_right_bottom.x = this.pageRect.width - this.a_right_bottom.width;
            this.a_right_bottom.y = this.pageRect.height - this.a_right_bottom.height;
            this.a_scroll_bar.x = this.folderMask.x + this.folderMask.width - this.a_scroll_bar.width;
            this.resize();
            var pageSizeEvet = new folder.FolderEvent(folder.FolderEvent.FILE_LIST_PANEL_CHANG);
            this.pageRect.x = this.left;
            this.pageRect.y = this.top;
            pageSizeEvet.data = this.pageRect;
            Pan3d.ModuleEventManager.dispatchEvent(pageSizeEvet);
        };
        BaseFolderWindow.prototype.tittleMouseDown = function (evt) {
            this.mouseMoveTaget = evt.target;
            this.lastMousePos = new Vector2D(evt.x, evt.y);
            switch (this.mouseMoveTaget) {
                case this.a_win_tittle:
                    this.lastPagePos = new Vector2D(this.left, this.top);
                    break;
                case this.a_rigth_line:
                case this.a_bottom_line:
                case this.a_right_bottom:
                    this.lastPagePos = new Vector2D(this.pageRect.width, this.pageRect.height);
                    break;
                case this.a_scroll_bar:
                    this.lastPagePos = new Vector2D(0, this.a_scroll_bar.y);
                    break;
                default:
                    console.log("nonono");
                    break;
            }
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.mouseOnTittleMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.tittleMouseUp, this);
        };
        BaseFolderWindow.prototype.tittleMouseUp = function (evt) {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.mouseOnTittleMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.tittleMouseUp, this);
        };
        BaseFolderWindow.prototype.mouseOnTittleMove = function (evt) {
            switch (this.mouseMoveTaget) {
                case this.a_win_tittle:
                    this.left = this.lastPagePos.x + (evt.x - this.lastMousePos.x);
                    this.top = this.lastPagePos.y + (evt.y - this.lastMousePos.y);
                    this.pageRect.x = this.left;
                    this.pageRect.y = this.top;
                    break;
                case this.a_rigth_line:
                    this.pageRect.width = this.lastPagePos.x + (evt.x - this.lastMousePos.x);
                    break;
                case this.a_bottom_line:
                    this.pageRect.height = this.lastPagePos.y + (evt.y - this.lastMousePos.y);
                    break;
                case this.a_right_bottom:
                    this.pageRect.width = this.lastPagePos.x + (evt.x - this.lastMousePos.x);
                    this.pageRect.height = this.lastPagePos.y + (evt.y - this.lastMousePos.y);
                    break;
                case this.a_scroll_bar:
                    this.a_scroll_bar.y = this.lastPagePos.y + (evt.y - this.lastMousePos.y);
                    this.a_scroll_bar.y = Math.max(this.a_scroll_bar.y, this.folderMask.y);
                    this.a_scroll_bar.y = Math.min(this.a_scroll_bar.y, this.folderMask.y + this.folderMask.height - this.a_scroll_bar.height);
                    //  console.log(this.a_scroll_bar.y)
                    break;
                default:
                    console.log("nonono");
                    break;
            }
            this.refrishSize();
        };
        return BaseFolderWindow;
    }(UIConatiner));
    basefolderwin.BaseFolderWindow = BaseFolderWindow;
})(basefolderwin || (basefolderwin = {}));
//# sourceMappingURL=BaseFolderWindow.js.map