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
    var ConstVec2NodeUI = /** @class */ (function (_super) {
        __extends(ConstVec2NodeUI, _super);
        function ConstVec2NodeUI() {
            var _this = _super.call(this) || this;
            _this.gap = 20;
            _this.width = 162;
            _this.height = 95;
            _this.gap = 20;
            _this.width = 162;
            _this.height = 65;
            _this._constValue = new Vector2D;
            _this.nodeTree = new materialui.NodeTreeVec2;
            _this.nodeTree.ui = _this;
            _this.nodeTree.type = materialui.NodeTree.VEC2;
            _this.outItem = new materialui.ItemMaterialUI("out", materialui.MaterialItemType.VEC2, false);
            _this.addItems(_this.outItem);
            _this.drawTitleToFrame("vec2");
            return _this;
        }
        Object.defineProperty(ConstVec2NodeUI.prototype, "constValue", {
            get: function () {
                return this._constValue;
            },
            set: function (value) {
                this._constValue = value;
                this.nodeTree.constValue = value;
                this.showDynamic();
            },
            enumerable: true,
            configurable: true
        });
        ConstVec2NodeUI.prototype.showDynamic = function () {
            /*
            if (nodeTree.isDynamic) {
                _titleLabel.text = "vec2<" + nodeTree.paramName + ">(" + getNumStr(_constValue.x) + "," + getNumStr(_constValue.y) + ")"
            } else {
                _titleLabel.text = "vec2(" + getNumStr(_constValue.x) + "," + getNumStr(_constValue.y) + ")"
            }
            */
            if (this.nodeTree.isDynamic) {
                this.drawTitleToFrame("vec2<" + this.nodeTree.paramName + ">(" + this.getNumStr(this._constValue.x) + "," + this.getNumStr(this._constValue.y) + ")");
            }
            else {
                this.drawTitleToFrame("vec2(" + this.getNumStr(this.constValue.x) + "," + this.getNumStr(this.constValue.y) + ")");
            }
        };
        ConstVec2NodeUI.prototype.getNumStr = function (num) {
            var n = Math.floor(num * 100) / 100;
            return n.toString();
        };
        return ConstVec2NodeUI;
    }(materialui.BaseMaterialNodeUI));
    materialui.ConstVec2NodeUI = ConstVec2NodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=ConstVec2NodeUI.js.map