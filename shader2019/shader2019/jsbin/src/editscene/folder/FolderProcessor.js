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
var folder;
(function (folder) {
    var BaseEvent = Pan3d.BaseEvent;
    var Module = Pan3d.Module;
    var BaseProcessor = Pan3d.BaseProcessor;
    var UIManager = Pan3d.UIManager;
    var FileListPanel = filelist.FileListPanel;
    var BaseFolderWindow = basefolderwin.BaseFolderWindow;
    var OssFolderPanel = ossfolder.OssFolderPanel;
    var FolderEvent = /** @class */ (function (_super) {
        __extends(FolderEvent, _super);
        function FolderEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FolderEvent.SHOW_FOLDER_PANEL = "SHOW_FOLDER_PANEL";
        FolderEvent.FILE_LIST_PANEL_CHANG = "FILE_LIST_PANEL_CHANG";
        FolderEvent.LIST_DIS_ALL_FILE = "LIST_DIS_ALL_FILE";
        return FolderEvent;
    }(BaseEvent));
    folder.FolderEvent = FolderEvent;
    var FolderModule = /** @class */ (function (_super) {
        __extends(FolderModule, _super);
        function FolderModule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FolderModule.prototype.getModuleName = function () {
            return "FolderModule";
        };
        FolderModule.prototype.listProcessors = function () {
            return [new FolderProcessor()];
        };
        return FolderModule;
    }(Module));
    folder.FolderModule = FolderModule;
    var FolderProcessor = /** @class */ (function (_super) {
        __extends(FolderProcessor, _super);
        function FolderProcessor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FolderProcessor.prototype.getName = function () {
            return "FolderProcessor";
        };
        FolderProcessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof FolderEvent) {
                var _folderEvent = $event;
                if (_folderEvent.type == FolderEvent.SHOW_FOLDER_PANEL) {
                    if (!this._baseFolderWindow) {
                        this._baseFolderWindow = new BaseFolderWindow();
                    }
                    UIManager.getInstance().addUIContainer(this._baseFolderWindow);
                    if (!this._folderPanel) {
                        this._folderPanel = new OssFolderPanel();
                    }
                    UIManager.getInstance().addUIContainer(this._folderPanel);
                    if (!this._fileListPanel) {
                        this._fileListPanel = new FileListPanel();
                    }
                    UIManager.getInstance().addUIContainer(this._fileListPanel);
                }
                if (_folderEvent.type == FolderEvent.FILE_LIST_PANEL_CHANG) {
                    var base = _folderEvent.data;
                    this._folderPanel.panelEventChanger(new Pan3d.Rectangle(base.x, base.y, base.width, base.height));
                    var leftw = this._folderPanel.getPageRect().width;
                    this._fileListPanel.panelEventChanger(new Pan3d.Rectangle(base.x + leftw, base.y, base.width - leftw, base.height));
                }
                if (_folderEvent.type == FolderEvent.LIST_DIS_ALL_FILE) {
                    this._fileListPanel.refrishPath(String(_folderEvent.data));
                }
            }
        };
        FolderProcessor.prototype.listenModuleEvents = function () {
            return [
                new FolderEvent(FolderEvent.SHOW_FOLDER_PANEL),
                new FolderEvent(FolderEvent.FILE_LIST_PANEL_CHANG),
                new FolderEvent(FolderEvent.LIST_DIS_ALL_FILE),
            ];
        };
        return FolderProcessor;
    }(BaseProcessor));
    folder.FolderProcessor = FolderProcessor;
})(folder || (folder = {}));
//# sourceMappingURL=FolderProcessor.js.map