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
    var Vec2PropMeshPanel = /** @class */ (function (_super) {
        __extends(Vec2PropMeshPanel, _super);
        function Vec2PropMeshPanel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Vec2PropMeshPanel.prototype.getView = function () {
            var ary = [
                { Type: prop.ReflectionData.NumberInput, Label: "x:", FunKey: "constXValue", target: this, Step: 0.1 },
                { Type: prop.ReflectionData.NumberInput, Label: "y:", FunKey: "constYValue", target: this, Step: 0.1 },
            ];
            return ary;
        };
        Object.defineProperty(Vec2PropMeshPanel.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                this.constVec2NodeUI = this._data;
                this._ve2d = this.constVec2NodeUI.constValue;
                this.refreshViewValue();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec2PropMeshPanel.prototype, "constXValue", {
            get: function () {
                return this._ve2d.x;
            },
            set: function (value) {
                this._ve2d.x = value;
                this.constVec2NodeUI.constValue = this._ve2d;
                this.changeData();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec2PropMeshPanel.prototype, "constYValue", {
            get: function () {
                return this._ve2d.y;
            },
            set: function (value) {
                this._ve2d.y = value;
                this.constVec2NodeUI.constValue = this._ve2d;
                this.changeData();
            },
            enumerable: true,
            configurable: true
        });
        Vec2PropMeshPanel.prototype.changeData = function () {
            ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
        };
        return Vec2PropMeshPanel;
    }(prop.MetaDataView));
    prop.Vec2PropMeshPanel = Vec2PropMeshPanel;
})(prop || (prop = {}));
//# sourceMappingURL=Vec2PropMeshPanel.js.map