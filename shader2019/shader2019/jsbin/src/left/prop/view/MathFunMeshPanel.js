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
    var MathFunMeshPanel = /** @class */ (function (_super) {
        __extends(MathFunMeshPanel, _super);
        function MathFunMeshPanel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MathFunMeshPanel.prototype.getView = function () {
            var ary = [
                { Type: prop.ReflectionData.AgalFunUI, Label: "函数名:", FunKey: "constValue", target: this, Step: 0.01 },
            ];
            return ary;
        };
        Object.defineProperty(MathFunMeshPanel.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                this.mathFunNodeUI = this._data;
                this.refreshViewValue();
                this.setInputTxtPos();
            },
            enumerable: true,
            configurable: true
        });
        MathFunMeshPanel.prototype.setInputTxtPos = function () {
            var _this = this;
            if (!this.chatHtmlInput) {
                this.chatHtmlInput = document.createElement("textarea");
                this.chatHtmlInput.style.position = "absolute";
                this.chatHtmlInput.style["z-index"] = 100;
                this.chatHtmlInput.style.background = "transparent";
                this.chatHtmlInput.style.color = "#ffffff";
                document.body.appendChild(this.chatHtmlInput);
                this.chatHtmlInput.addEventListener("change", function (cevt) { _this.changeFile(cevt); });
            }
            this.chatHtmlInput.style.left = "10px";
            this.chatHtmlInput.style.top = this.top + 60 + "px";
            var tw = 280;
            var th = 280;
            var textSize = 100;
            this.chatHtmlInput.style.fontSize = String(12) + "px";
            this.chatHtmlInput.style.width = String(tw) + "px";
            this.chatHtmlInput.style.height = String(th) + "px";
            this.chatHtmlInput.value = this.mathFunNodeUI.nodeTree.funStr;
            this.resize();
        };
        MathFunMeshPanel.prototype.changeFile = function (evt) {
            var $agalStr = this.chatHtmlInput.value;
            if (materialui.NodeTreeFun.isNeedChangePanel($agalStr, this.mathFunNodeUI.nodeTree.funStr)) {
                this.mathFunNodeUI.inPutFunStr($agalStr);
            }
            else {
                this.mathFunNodeUI.nodeTree.funStr = $agalStr;
                this.changeData();
            }
        };
        MathFunMeshPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            if (this.chatHtmlInput) {
                this.chatHtmlInput.style.top = this.top + 60 + "px";
            }
        };
        MathFunMeshPanel.prototype.destory = function () {
            var _this = this;
            _super.prototype.destory.call(this);
            if (this.chatHtmlInput) {
                this.chatHtmlInput.removeEventListener("change", function (cevt) { _this.changeFile(cevt); });
                document.body.removeChild(this.chatHtmlInput);
                this.chatHtmlInput = null;
            }
        };
        Object.defineProperty(MathFunMeshPanel.prototype, "constValue", {
            get: function () {
                return this.mathFunNodeUI;
            },
            set: function (value) {
                this.changeData();
            },
            enumerable: true,
            configurable: true
        });
        MathFunMeshPanel.prototype.changeData = function () {
            ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
        };
        return MathFunMeshPanel;
    }(prop.MetaDataView));
    prop.MathFunMeshPanel = MathFunMeshPanel;
})(prop || (prop = {}));
//# sourceMappingURL=MathFunMeshPanel.js.map