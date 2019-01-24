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
    var Vec3PropMeshPanel = /** @class */ (function (_super) {
        __extends(Vec3PropMeshPanel, _super);
        function Vec3PropMeshPanel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Vec3PropMeshPanel.prototype.getView = function () {
            var ary = [
                { Type: prop.ReflectionData.NumberInput, Label: "x:", FunKey: "constXValue", target: this, Step: 0.1 },
                { Type: prop.ReflectionData.NumberInput, Label: "y:", FunKey: "constYValue", target: this, Step: 0.1 },
                { Type: prop.ReflectionData.NumberInput, Label: "z:", FunKey: "constZValue", target: this, Step: 0.1 },
            ];
            return ary;
        };
        Object.defineProperty(Vec3PropMeshPanel.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                this.constVec3NodeUI = this._data;
                this._ve3d = this.constVec3NodeUI.constValue;
                this.refreshViewValue();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec3PropMeshPanel.prototype, "constXValue", {
            get: function () {
                return this._ve3d.x;
            },
            set: function (value) {
                this._ve3d.x = value;
                this.constVec3NodeUI.constValue = this._ve3d;
                this.changeData();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec3PropMeshPanel.prototype, "constYValue", {
            get: function () {
                return this._ve3d.y;
            },
            set: function (value) {
                this._ve3d.y = value;
                this.constVec3NodeUI.constValue = this._ve3d;
                this.changeData();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec3PropMeshPanel.prototype, "constZValue", {
            get: function () {
                return this._ve3d.z;
            },
            set: function (value) {
                this._ve3d.z = value;
                this.constVec3NodeUI.constValue = this._ve3d;
                this.changeData();
            },
            enumerable: true,
            configurable: true
        });
        Vec3PropMeshPanel.prototype.changeData = function () {
            ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
        };
        return Vec3PropMeshPanel;
    }(prop.MetaDataView));
    prop.Vec3PropMeshPanel = Vec3PropMeshPanel;
})(prop || (prop = {}));
//# sourceMappingURL=Vec3PropMeshPanel.js.map