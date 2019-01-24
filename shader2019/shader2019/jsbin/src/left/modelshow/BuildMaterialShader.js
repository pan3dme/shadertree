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
var left;
(function (left) {
    var MaterialShader = Pan3d.MaterialShader;
    var BuildMaterialShader = /** @class */ (function (_super) {
        __extends(BuildMaterialShader, _super);
        function BuildMaterialShader() {
            var _this = _super.call(this) || this;
            _this.name = "BuildMaterialShader";
            return _this;
        }
        BuildMaterialShader.prototype.buildParamAry = function ($material) {
            this.paramAry = [$material.usePbr, $material.useNormal, $material.hasFresnel,
                $material.useDynamicIBL, $material.lightProbe, $material.directLight,
                $material.noLight, $material.fogMode];
        };
        BuildMaterialShader.prototype.binLocation = function ($context) {
            $context.bindAttribLocation(this.program, 0, "v3Position");
            $context.bindAttribLocation(this.program, 1, "v2CubeTexST");
            var usePbr = this.paramAry[0];
            var useNormal = this.paramAry[1];
            var lightProbe = this.paramAry[4];
            var directLight = this.paramAry[5];
            var noLight = this.paramAry[6];
            if (useNormal) {
                $context.bindAttribLocation(this.program, 2, "v3Tangent");
                $context.bindAttribLocation(this.program, 3, "v3Bitangent");
                $context.bindAttribLocation(this.program, 4, "v3Normal");
            }
        };
        BuildMaterialShader.prototype.getVertexShaderString = function () {
            var usePbr = this.paramAry[0];
            var useNormal = this.paramAry[1];
            var hasFresnel = this.paramAry[2];
            var useDynamicIBL = this.paramAry[3];
            var lightProbe = this.paramAry[4];
            var directLight = this.paramAry[5];
            var noLight = this.paramAry[6];
            var fogMode = this.paramAry[7];
            var $str = "attribute vec3 v3Position;\n" +
                "attribute vec2 v2CubeTexST;\n" +
                "varying vec2 v0;\n";
            if (useNormal) {
                $str +=
                    "attribute vec3 v3Tangent;\n" +
                        "attribute vec3 v3Bitangent;\n" +
                        "attribute vec3 v3Normal;\n" +
                        "varying vec3 T;\n" +
                        "varying vec3 B;\n" +
                        "varying vec3 N;\n";
            }
            $str +=
                "uniform mat4 vpMatrix3D;\n" +
                    "uniform mat4 posMatrix3D;\n" +
                    "uniform mat3 rotationMatrix3D;\n";
            $str +=
                "varying highp vec3 vPos;\n";
            $str +=
                "void main(void){\n" +
                    "v0 = vec2(v2CubeTexST.x, v2CubeTexST.y);\n" +
                    "vec4 vt0= vec4(v3Position, 1.0);\n" +
                    "vt0 = posMatrix3D * vt0;\n";
            if (useNormal) {
                $str +=
                    "T = v3Tangent;\n" +
                        "B = v3Bitangent;\n" +
                        "N = v3Normal;\n";
            }
            $str += "vt0 = vpMatrix3D * vt0;\n";
            $str += "gl_Position = vt0;\n";
            $str += "vPos = v3Position;\n";
            $str += "}";
            return $str;
        };
        BuildMaterialShader.BuildMaterialShader = "BuildMaterialShader";
        return BuildMaterialShader;
    }(MaterialShader));
    left.BuildMaterialShader = BuildMaterialShader;
})(left || (left = {}));
//# sourceMappingURL=BuildMaterialShader.js.map