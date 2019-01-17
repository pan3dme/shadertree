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
var filemodel;
(function (filemodel) {
    var BaseEvent = Pan3d.BaseEvent;
    var Module = Pan3d.Module;
    var BaseProcessor = Pan3d.BaseProcessor;
    var FileModelEvent = /** @class */ (function (_super) {
        __extends(FileModelEvent, _super);
        function FileModelEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FileModelEvent.SHOW_FILEMODEL_PANEL = "SHOW_FILEMODEL_PANEL"; //显示面板
        FileModelEvent.HIDE_FILEMODEL_PANEL = "HIDE_FILEMODEL_PANEL"; //显示面板
        return FileModelEvent;
    }(BaseEvent));
    filemodel.FileModelEvent = FileModelEvent;
    var FileModelModule = /** @class */ (function (_super) {
        __extends(FileModelModule, _super);
        function FileModelModule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FileModelModule.prototype.getModuleName = function () {
            return "FileModelModule";
        };
        FileModelModule.prototype.listProcessors = function () {
            return [new FileModelProcessor()];
        };
        return FileModelModule;
    }(Module));
    filemodel.FileModelModule = FileModelModule;
    var FileModelProcessor = /** @class */ (function (_super) {
        __extends(FileModelProcessor, _super);
        function FileModelProcessor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FileModelProcessor.prototype.getName = function () {
            return "FileModelProcessor";
        };
        FileModelProcessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof FileModelEvent) {
                var $leftEvent = $event;
                if ($leftEvent.type == FileModelEvent.SHOW_FILEMODEL_PANEL) {
                    this.showLeftPanel();
                }
                if ($leftEvent.type == FileModelEvent.HIDE_FILEMODEL_PANEL) {
                    this.hideLeftPanel();
                }
            }
        };
        FileModelProcessor.prototype.hideLeftPanel = function () {
            if (this.fileModelPanel) {
                this.fileModelPanel.hidePanel();
            }
        };
        FileModelProcessor.prototype.showLeftPanel = function () {
            if (!this.fileModelPanel) {
                this.fileModelPanel = new filemodel.FileModelPanel;
            }
            this.fileModelPanel.showPanel();
        };
        FileModelProcessor.prototype.listenModuleEvents = function () {
            return [
                new FileModelEvent(FileModelEvent.SHOW_FILEMODEL_PANEL),
                new FileModelEvent(FileModelEvent.HIDE_FILEMODEL_PANEL),
            ];
        };
        return FileModelProcessor;
    }(BaseProcessor));
    filemodel.FileModelProcessor = FileModelProcessor;
})(filemodel || (filemodel = {}));
//# sourceMappingURL=FileModelProcessor.js.map