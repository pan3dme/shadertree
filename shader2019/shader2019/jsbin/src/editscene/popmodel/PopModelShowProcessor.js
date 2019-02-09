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
var popmodel;
(function (popmodel) {
    var BaseEvent = Pan3d.BaseEvent;
    var Module = Pan3d.Module;
    var BaseProcessor = Pan3d.BaseProcessor;
    var UIManager = Pan3d.UIManager;
    var PopModelShowEvent = /** @class */ (function (_super) {
        __extends(PopModelShowEvent, _super);
        function PopModelShowEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PopModelShowEvent.SHOW_POP_MODEL_PANEL = "SHOW_LEFT_PANEL"; //显示面板
        PopModelShowEvent.HIDE_POP_MODEL_PANEL = "HIDE_LEFT_PANEL"; //显示面板
        return PopModelShowEvent;
    }(BaseEvent));
    popmodel.PopModelShowEvent = PopModelShowEvent;
    var PopModelShowModule = /** @class */ (function (_super) {
        __extends(PopModelShowModule, _super);
        function PopModelShowModule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PopModelShowModule.prototype.getModuleName = function () {
            return "PopModelShowModule";
        };
        PopModelShowModule.prototype.listProcessors = function () {
            return [new PopModelShowProcessor()];
        };
        return PopModelShowModule;
    }(Module));
    popmodel.PopModelShowModule = PopModelShowModule;
    var PopModelShowProcessor = /** @class */ (function (_super) {
        __extends(PopModelShowProcessor, _super);
        function PopModelShowProcessor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PopModelShowProcessor.prototype.getName = function () {
            return "PopModelShowProcessor";
        };
        PopModelShowProcessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof PopModelShowEvent) {
                var $leftEvent = $event;
                if ($leftEvent.type == PopModelShowEvent.SHOW_POP_MODEL_PANEL) {
                    this.showLeftPanel();
                }
                if ($leftEvent.type == PopModelShowEvent.HIDE_POP_MODEL_PANEL) {
                    this.hideLeftPanel();
                }
            }
        };
        PopModelShowProcessor.prototype.hideLeftPanel = function () {
            if (this.popModelShowPanel) {
                UIManager.getInstance().removeUIContainer(this.popModelShowPanel);
            }
        };
        PopModelShowProcessor.prototype.showLeftPanel = function () {
            if (!this.popModelShowPanel) {
                this.popModelShowPanel = new popmodel.PopModelShowPanel;
            }
            if (!this.popModelShowPanel.hasStage) {
                UIManager.getInstance().addUIContainer(this.popModelShowPanel);
            }
        };
        PopModelShowProcessor.prototype.listenModuleEvents = function () {
            return [
                new PopModelShowEvent(PopModelShowEvent.SHOW_POP_MODEL_PANEL),
                new PopModelShowEvent(PopModelShowEvent.HIDE_POP_MODEL_PANEL),
            ];
        };
        return PopModelShowProcessor;
    }(BaseProcessor));
    popmodel.PopModelShowProcessor = PopModelShowProcessor;
})(popmodel || (popmodel = {}));
//# sourceMappingURL=PopModelShowProcessor.js.map