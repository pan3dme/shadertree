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
var materialui;
(function (materialui) {
    var TimeNodeUI = /** @class */ (function (_super) {
        __extends(TimeNodeUI, _super);
        function TimeNodeUI() {
            var _this = _super.call(this) || this;
            _this._speed = 1;
            _this.gap = 20;
            _this.width = 162;
            _this.height = 65;
            _this.nodeTree = new materialui.NodeTreeTime;
            _this.nodeTree.ui = _this;
            _this.nodeTree.type = materialui.NodeTree.TIME;
            _this.outItem = new materialui.ItemMaterialUI("out", materialui.MaterialItemType.FLOAT, false);
            _this.addItems(_this.outItem);
            _this.drawTitleToFrame("Time");
            return _this;
        }
        Object.defineProperty(TimeNodeUI.prototype, "speed", {
            get: function () {
                return this._speed;
            },
            set: function (value) {
                this._speed = value;
                this.nodeTree.speed = this.speed;
            },
            enumerable: true,
            configurable: true
        });
        TimeNodeUI.prototype.setData = function (obj) {
            _super.prototype.setData.call(this, obj);
            this.speed = obj.speed;
            this.nodeTree.speed = this.speed;
        };
        return TimeNodeUI;
    }(materialui.BaseMaterialNodeUI));
    materialui.TimeNodeUI = TimeNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=TimeNodeUI.js.map