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
var Pan3d;
(function (Pan3d) {
    var ObjData = /** @class */ (function (_super) {
        __extends(ObjData, _super);
        function ObjData() {
            var _this = _super.call(this) || this;
            _this.vertices = new Array;
            _this.uvs = new Array;
            _this.indexs = new Array;
            _this.lightuvs = new Array;
            _this.normals = new Array;
            _this.tangents = new Array;
            _this.bitangents = new Array;
            _this._treNum = 0;
            /**顶点 uv lightuv normal 合成一个 va */
            _this.compressBuffer = false;
            _this.hasdispose = false;
            return _this;
        }
        Object.defineProperty(ObjData.prototype, "treNum", {
            get: function () {
                return this._treNum;
            },
            set: function (value) {
                this._treNum = value;
            },
            enumerable: true,
            configurable: true
        });
        ObjData.prototype.destory = function () {
            this.vertices.length = 0;
            this.vertices = null;
            this.uvs.length = 0;
            this.uvs = null;
            this.indexs.length = 0;
            this.indexs = null;
            this.lightuvs.length = 0;
            this.lightuvs = null;
            this.normals.length = 0;
            this.normals = null;
            this.tangents.length = 0;
            this.tangents = null;
            this.bitangents.length = 0;
            this.bitangents = null;
            if (this.vertexBuffer) {
                Pan3d.Scene_data.context3D.deleteBuffer(this.vertexBuffer);
                this.vertexBuffer = null;
            }
            if (this.uvBuffer) {
                Pan3d.Scene_data.context3D.deleteBuffer(this.uvBuffer);
                this.uvBuffer = null;
            }
            if (this.indexBuffer) {
                Pan3d.Scene_data.context3D.deleteBuffer(this.indexBuffer);
                this.indexBuffer = null;
            }
            if (this.lightUvBuffer) {
                Pan3d.Scene_data.context3D.deleteBuffer(this.lightUvBuffer);
                this.lightUvBuffer = null;
            }
            if (this.normalsBuffer) {
                Pan3d.Scene_data.context3D.deleteBuffer(this.normalsBuffer);
                this.normalsBuffer = null;
            }
            if (this.tangentBuffer) {
                Pan3d.Scene_data.context3D.deleteBuffer(this.tangentBuffer);
                this.tangentBuffer = null;
            }
            if (this.bitangentBuffer) {
                Pan3d.Scene_data.context3D.deleteBuffer(this.bitangentBuffer);
                this.bitangentBuffer = null;
            }
            this.hasdispose = true;
        };
        return ObjData;
    }(Pan3d.ResCount));
    Pan3d.ObjData = ObjData;
})(Pan3d || (Pan3d = {}));
//# sourceMappingURL=ObjData.js.map