module left {
    import MaterialShader = Pan3d.MaterialShader
    export class BuildMaterialShader extends MaterialShader {
        public static BuildMaterialShader: string = "BuildMaterialShader";
        constructor() {
            super();
            this.name = "BuildMaterialShader";
        }
        public buildParamAry($material: materialui.MaterialTree): void {
               this.paramAry = [$material.usePbr, $material.useNormal, $material.hasFresnel,
                $material.useDynamicIBL, $material.lightProbe, $material.directLight,
                $material.noLight, $material.fogMode];
        }
        public binLocation($context: WebGLRenderingContext): void {
            $context.bindAttribLocation(this.program, 0, "v3Position");
            $context.bindAttribLocation(this.program, 1, "v2CubeTexST");

            var usePbr: boolean = this.paramAry[0];
            var useNormal: boolean = this.paramAry[1];
            var lightProbe: boolean = this.paramAry[4];
            var directLight: boolean = this.paramAry[5];
            var noLight: boolean = this.paramAry[6];


            if (useNormal) {
                $context.bindAttribLocation(this.program, 2, "v3Tangent");
                $context.bindAttribLocation(this.program, 3, "v3Bitangent");
                $context.bindAttribLocation(this.program, 4, "v3Normal");
            }
        }
        public getVertexShaderString(): string {

            var usePbr: boolean = this.paramAry[0];
            var useNormal: boolean = this.paramAry[1];
            var hasFresnel: boolean = this.paramAry[2];
            var useDynamicIBL: boolean = this.paramAry[3];
            var lightProbe: boolean = this.paramAry[4];
            var directLight: boolean = this.paramAry[5];
            var noLight: boolean = this.paramAry[6];
            var fogMode: number = this.paramAry[7];

            var $str: string =
                "attribute vec3 v3Position;\n" +
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
                    "N = v3Normal;\n"
            }

            $str += "vt0 = vpMatrix3D * vt0;\n";
              

            $str += "gl_Position = vt0;\n";
            $str += "vPos = v3Position;\n";

            $str += "}";


            return $str


        }

    }
}