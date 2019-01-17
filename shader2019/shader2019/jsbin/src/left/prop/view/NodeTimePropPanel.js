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
var prop;
(function (prop) {
    var ModuleEventManager = Pan3d.ModuleEventManager;
    var NodeTimePropPanel = /** @class */ (function (_super) {
        __extends(NodeTimePropPanel, _super);
        function NodeTimePropPanel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NodeTimePropPanel.prototype.getView = function () {
            var ary = [
                { Type: prop.ReflectionData.NumberInput, Label: "x:", FunKey: "constValue", target: this, Step: 0.01 },
            ];
            return ary;
        };
        Object.defineProperty(NodeTimePropPanel.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                this.timeNodeUI = this._data;
                this.refreshViewValue();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeTimePropPanel.prototype, "constValue", {
            get: function () {
                return this.timeNodeUI.speed;
            },
            set: function (value) {
                this.timeNodeUI.speed = value;
                this.changeData();
            },
            enumerable: true,
            configurable: true
        });
        NodeTimePropPanel.prototype.changeData = function () {
            ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
        };
        return NodeTimePropPanel;
    }(prop.MetaDataView));
    prop.NodeTimePropPanel = NodeTimePropPanel;
})(prop || (prop = {}));
//# sourceMappingURL=NodeTimePropPanel.js.map