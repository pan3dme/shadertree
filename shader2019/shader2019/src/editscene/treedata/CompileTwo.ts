module materialui {
    import Scene_data = Pan3d.Scene_data
    import MaterialBaseParam = Pan3d.MaterialBaseParam
    import TexItem = Pan3d.TexItem
    import TextureCube = Pan3d.TextureCube
    import TextureRes = Pan3d.TextureRes
    import ConstItem = Pan3d.ConstItem
    import CubemapLoad = Pan3d.CubemapLoad
    import TextureManager = Pan3d.TextureManager
    
    export class CompileTwo {

        public static SPACE: string = " ";
        public static COMMA: string = ",";
        public static END: string = ";";
        public static FC: string = "fc";
        public static FT: string = "ft";
        public static TEXTURE: string = "texture";
        public static FS: string = "fs";
        public static VI: string = "v";
        public static OP: string = "op";
        public static FO: string = "gl_FragColor";
        public static XYZ: string = ".xyz";
        public static XY: string = ".xy";
        public static X: string = ".x";
        public static Y: string = ".y";
        public static Z: string = ".z";
        public static W: string = ".w";
        public static ZW: string = ".zw";
        public static MOV: string = "mov";
        //public static ONE:string = "1";
        public static ONE_FLOAT: string = "1.0";
        public static ZERO: string = "[0]";
        public static ONE: string = "[1]";
        public static TWO: string = "[2]";
        public static TWO_FLOAT: string = "2.0";
        public static THREE: string = "3";
        public static FOUR: string = "4";
        public static LN: string = "\n";
        public static texType: string = "<2d,linear,repeat>";
        public static TEX_2D: string = "2d";
      //  public static TEX_CUBE: string = "cube";
        public static TEX_LINEAR: string = "linear";
        public static TEX_NEAREST: string = "nearest";
        public static TEX_WRAP_REPEAT: string = "repeat";
        public static TEX_WRAP_CLAMP: string = "clamp";
        public static LEFT_BRACKET: string = "<";
        public static RIGHT_BRACKET: string = ">";
        public static texCubeType: string = "<cube,clamp,linear,mipnone>";

        public static TEX: string = "tex";
        public static ADD: string = "add";
        public static SUB: string = "sub";
        public static MUL: string = "mul";
        public static DIV: string = "div";
        public static ADD_MATH: string = "+";
        public static SUB_MATH: string = "-";
        public static MUL_MATH: string = "*";
        public static MUL_EQU_MATH: string = "*=";
        public static DIV_MATH: string = "/";
        public static RCP: string = "rcp";
        public static MIN: string = "min";
        public static MAX: string = "max";
        public static FRC: string = "frc";
        public static SQT: string = "sqt";
        public static RSQ: string = "rsq";
        public static POW: string = "pow";
        public static LOG: string = "log";
        public static EXP: string = "exp";
        public static NRM: string = "normalize";
        public static SIN: string = "sin";
        public static COS: string = "cos";
        public static CRS: string = "crs";
        public static DP3: string = "dp3";
        public static DOT: string = "dot";
        public static DP4: string = "dp4";
        public static ABS: string = "abs";
        public static NEG: string = "neg";
        public static SAT: string = "sat";
        public static LERP: string = "lerp";
        public static KIL: string = "kil";
        public static M33: string = "m33";

        public static VEC4: string = "vec4";
        public static VEC3: string = "vec3";
        public static VEC2: string = "vec2";
        public static EQU: string = "=";
        public static texture2D: string = "texture2D";
        public static textureCube: string = "textureCube";
        public static LEFT_PARENTH: string = "(";
        public static RIGHT_PARENTH: string = ")";
        public static DEFAULT_VEC4: string = "vec4(0,0,0,1)";
        public static MIX: string = "mix";
        public static REFLECT: string = "reflect";
        public static IF: string = "if";
        public static DISCARD: string = "{discard;}";
        public static scalelight: string = "scalelight";
        //public static fogdata:string = "fogdata";
        //public static fogcolor:string = "fogcolor";





        public priorityList: Array<Array<NodeTree>>;

        private fragmentTempList: Array<RegisterItem>;
        private fragmentTexList: Array<RegisterItem>;
        private fragmentConstList: Array<RegisterItem>;

        private defaultUvReg: RegisterItem;
        private defaultLightUvReg: RegisterItem;
        private defaultPtReg: RegisterItem;
        private defaultLutReg: RegisterItem;
        private defaultTangent: RegisterItem;
        private defatultV5: RegisterItem;
        private defatultV6: RegisterItem;
        //private defaultBinormal:RegisterItem;

        private strVec: Array<string>;
        private texVec: Array<TexItem>;
        private constVec: Array<ConstItem>;
        private hasTime: boolean;
        private timeSpeed: number = 0;
        private blendMode: number;
        private writeZbuffer: boolean;
        private backCull: boolean;
        private killNum: number = 0;
        private hasVertexColor: boolean;
        private usePbr: boolean;
        private useNormal: boolean;
        private roughness: number = 0;
 
        private hasSkyBox: boolean;
        private skyBoxTextId: number;
        private useDynamicIBL: boolean;
        private normalScale: number = 0;
        private lightProbe: boolean;
        private useLightMap: boolean;
        private directLight: boolean;
        private noLight: boolean;
        private fogMode: number;
        private scaleLightMap: boolean;
        private useKill: boolean;
        private fcNum: number;


        private _killID: number = 0;
        private _timeID: number = 0;
        private _fogdataID: number = 0;

        private _camposID: number = 0;

        private _fogcolorID: number = 0;
        private _scalelightmapID: number = 0;

        private _fcBeginID: number = 0;
        public constructor() {
            this.initReg();
            new Vector3D
            this.defaultUvReg = new RegisterItem(0);
            this.defaultPtReg = new RegisterItem(1);
            this.defaultLightUvReg = new RegisterItem(2);
            this.defaultLutReg = new RegisterItem(3);
            this.defaultTangent = new RegisterItem(4);

            this.defatultV5 = new RegisterItem(5);
            this.defatultV6 = new RegisterItem(6);
        }
        private initReg(): void {
            this.fragmentTempList = new Array
            this.fragmentTexList = new Array
            this.fragmentConstList = new Array
            for (var i: number = 0; i < 8; i++) {
                this.fragmentTempList.push(new RegisterItem(i));
                this.fragmentTexList.push(new RegisterItem(i));
            }

            for (i = 0; i < 28; i++) {
                this.fragmentConstList.push(new RegisterItem(i));
            }

        }

        public compile($priorityList: Array<Array<NodeTree>>, $materialTree: MaterialTree): string {

            NodeTree.jsMode = true;
            this.priorityList = $priorityList;
            this.strVec = new Array;
            this.texVec = new Array;
            this.constVec = new Array;
            this.hasTime = false;
            this.hasVertexColor = false;
            this.usePbr = false;
            this.useNormal = false;
            this.roughness = 0;
  
            this.useDynamicIBL = false;
            this.lightProbe = false;
            this.useLightMap = false;
            this.useKill = false;
            this.directLight = false;
            this.noLight = false;
            this.fogMode = 0;
            this.scaleLightMap = false;
            this.hasSkyBox = false;
            this.cubeTextItem = null
            this.initBaseFc();
            this.funNodeStr = ""
            this.FunDic = {}
            for (var i: number = this.priorityList.length - 1; i >= 0; i--) {
                var treelist: Array<NodeTree> = this.priorityList[i];
                for (var j: number = 0; j < treelist.length; j++) {
                    this.processNode(treelist[j]);
                }
            }
            var resultStr: string = this.getGLSLStr();
            $materialTree.shaderStr = resultStr;
            $materialTree.constList = this.constVec;
            $materialTree.texList = this.texVec;
            $materialTree.cubeTextItem = this.cubeTextItem;
            var $materialBaseParam: MaterialBaseParam = new MaterialBaseParam()
            $materialBaseParam.setData($materialTree, []);

            $materialTree.fcNum = this.getMaxFc();
            $materialTree.fcData = this.makeFc($materialTree.fcNum);


            $materialTree.hasTime = this.hasTime;;
            $materialTree.hasVertexColor = this.hasVertexColor;;
            $materialTree.usePbr = this.usePbr;;
            $materialTree.useNormal = this.useNormal;;
            $materialTree.roughness = 0;
 
            $materialTree.useDynamicIBL = this.useDynamicIBL;;
            $materialTree.lightProbe = this.lightProbe;;
            $materialTree.useKill = this.useKill;;
            $materialTree.directLight = this.directLight;;
            $materialTree.noLight = this.noLight;;
            $materialTree.fogMode = this.fogMode;;
            $materialTree.scaleLightMap = this.scaleLightMap;;
            $materialTree.skyBoxTextId = this.skyBoxTextId
            $materialTree.hasSkyBox = this.hasSkyBox
            
            return resultStr

        }
        private getMaxFc(): number {
            var maxID: number = 0;
            if (this.constVec.length) {
                maxID = this.constVec[this.constVec.length - 1].id + 1;
            } else {
                if (this._fcBeginID > 0) {
                    maxID = this._fcBeginID;
                }
            }
            return maxID
        }
        private makeFc(fcNum: number): Float32Array {

            var fcIDAry: Array<number> = [this._camposID, this._fogcolorID, this._scalelightmapID];
            var fcData: Float32Array = new Float32Array(fcNum * 4);

            if (this.hasTime || this.useKill || this.fogMode != 0) {//fc0
                if (this.useKill) {
                    fcData[0] = this.killNum;
                }
                if (this.fogMode != 0) {
                    fcData[2] = Scene_data.fogData[0];
                    fcData[3] = Scene_data.fogData[1];
                }
            }
            if (this.usePbr || this.fogMode == 1) {
                var idx: number = fcIDAry[0] * 4;
                fcData[0 + idx] = Scene_data.cam3D.x;
                fcData[1 + idx] = Scene_data.cam3D.y;
                fcData[2 + idx] = Scene_data.cam3D.z;
            }

            if (this.fogMode != 0) {
                var idx: number = fcIDAry[1] * 4;
                fcData[0 + idx] = Scene_data.fogColor[0];
                fcData[1 + idx] = Scene_data.fogColor[1];
                fcData[2 + idx] = Scene_data.fogColor[2];
            }
            for (var i: number = 0; i < this.constVec.length; i++) {
                this.constVec[i].creat(fcData);
            }
            return fcData

        }
        private funNodeStr: string
        private getGLSLStr(): string {


            var mainStr: string = "";
            for (var i: number = 0; i < this.strVec.length; i++) {
                mainStr += this.strVec[i] + "\n";
            }

            var perStr: string = "precision mediump float;\n";
        
            var hasParticleColor: boolean = false;
            var texStr: string = "";
            for (i = 0; i < this.texVec.length; i++) {
                if (this.texVec[i].type == TexItem.CUBEMAP) {
                    texStr += "uniform samplerCube fs" + this.texVec[i].id + ";\n";
                } else {
                    texStr += "uniform sampler2D fs" + this.texVec[i].id + ";\n";
                }
             
            }
      
            if (this.cubeTextItem) {
                texStr += "uniform samplerCube skyBoxCube; \n";
            }
      

            var constStr: string = "";
 

            var maxID: number = 0;
            if (this.constVec.length) {
                maxID = this.constVec[this.constVec.length - 1].id + 1;
            } else {
                if (this._fcBeginID > 0) {
                    maxID = this._fcBeginID;
                }
            }

            this.fcNum = maxID;

            if (this.fcNum > 0) {
                constStr += "uniform vec4 fc[" + (this.fcNum) + "];\n";
            }




            var varyStr: string = "";
            varyStr += "varying vec2 v0;\n";
            varyStr += "varying highp vec3 vPos;\n";
            varyStr += "uniform vec3 cam3DPos;\n";
            varyStr += "uniform vec4 uDiffuseCoefficients[9];\n";
        
            if (this.useNormal) {
                varyStr += "varying vec3 T;\n";
                varyStr += "varying vec3 B;\n";
                varyStr += "varying vec3 N;\n";


                varyStr += "vec3 normalpic(vec3 n) { \n" +
                    "n=2.0*n-vec3(1.0);\n" +
                    "return normalize(T*n.x+B*n.y+N*n.z);\n" +
                    "}\n";
            }
  

            var beginStr: string = "void main(void){\n";

            if (this.useNormal) {
                var inputNormal = this.getInputNormal();
                if (inputNormal.parentNodeItem) {
                    beginStr += "vec3 normalVec = normalpic(" + "texture2D(fs" + inputNormal.parentNodeItem.node.regResultTex.id + ",v0).xyz)" + CompileTwo.END + "\n";
                } else {
                    beginStr += "vec3 normalVec = " + "N.xyz" + CompileTwo.END + "\n";
                }
            }


            var endStr: string = "\n}";


           

            var resultStr: string = perStr + texStr + constStr + varyStr + this.funNodeStr + beginStr + mainStr + endStr;

            return resultStr;
        }
        private getInputNormal(): NodeTreeInputItem {
            for (var i: number = this.priorityList.length - 1; i >= 0; i--) {
                var treelist: Array<NodeTree> = this.priorityList[i];
                for (var j: number = 0; j < treelist.length; j++) {
                    if (treelist[j].type == NodeTree.OP) {
                        return treelist[j].inputVec[1]
                    }
                }
            }
            return null
        }
        //private getFunTree(): string {
        //    var $outstr: string = "vec3 ic(vec2 id){bool ie=(id.y>(32767.1/65535.0));\n" +
        //        "id.y=ie?(id.y-(32768.0/65535.0)):id.y;\n" +
        //        "vec3 r;\n" +
        //        "r.xy=(2.0*65535.0/32767.0)*id-vec2(1.0);\n" +
        //        "r.z=sqrt(clamp(1.0-dot(r.xy,r.xy),0.0,1.0));\n" +
        //        "r.z=ie?-r.z:r.z;\n" +
        //        "return r;\n" +
        //    "}\n"
        //    return $outstr
        //}
        public getFragmentTex($nodeTreeTex: NodeTreeTex = null): RegisterItem {
            for (var i: number = 0; i < this.fragmentTexList.length; i++) {
                if (!this.fragmentTexList[i].inUse) {
                    this.fragmentTexList[i].inUse = true;
                    this.fragmentTexList[i].url = "";
                    return this.fragmentTexList[i];
                }
            }
            return null;
        }
        public getFragmentTemp(): RegisterItem {
            for (var i: number = 0; i < this.fragmentTempList.length; i++) {
                if (!this.fragmentTempList[i].inUse) {
                    this.fragmentTempList[i].inUse = true;
                    return this.fragmentTempList[i];
                }
            }
            return null;
        }
        public processTexCubeNode($node: NodeTree): void {
            this.hasSkyBox = true
            var texItem: TextureCube = new TextureCube;
            texItem.url = (<NodeTreeTex>$node).url;
            texItem.isDynamic = (<NodeTreeTex>$node).isDynamic;
            texItem.paramName = (<NodeTreeTex>$node).paramName;
            texItem.isMain = (<NodeTreeTex>$node).isMain;
            texItem.wrap = (<NodeTreeTex>$node).wrap;
            texItem.filter = (<NodeTreeTex>$node).filter;
            texItem.mipmap = (<NodeTreeTex>$node).mipmap;
            texItem.permul = (<NodeTreeTex>$node).permul;
            TextureManager.getInstance().getTexture(Scene_data.fileRoot + texItem.url, ($texture: TextureRes) => {
                texItem.textureRes = $texture;

             
            });


   
            LoadManager.getInstance().load(Scene_data.fileRoot + texItem.url, LoadManager.IMG_TYPE, ($img: any, $info: any) => {

                texItem.cubeTextWebgl = CubemapLoad.makeTempCubeTextture($img)


            });
            this.cubeTextItem = texItem
        }
        public cubeTextItem: TextureCube
        public processTex3DNode($node: NodeTree): void {
            var str: string = ""
            var input: NodeTreeInputItem = $node.inputVec[0];
            var regtex: RegisterItem = this.getFragmentTex(<NodeTreeTex>$node);
            var regtemp: RegisterItem = this.getFragmentTemp();

     
            var resultStr: string;

            if (regtemp.hasInit) {
                resultStr = CompileTwo.FT + regtemp.id;
            } else {
                resultStr = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id;
                regtemp.hasInit = true;
            }
            if (input.parentNodeItem) {
                var pNode: NodeTree = input.parentNodeItem.node;
       
                str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + "textureCube" + CompileTwo.LEFT_PARENTH + CompileTwo.FS + regtex.id + CompileTwo.COMMA + pNode.getComponentID(input.parentNodeItem.id)+ CompileTwo.RIGHT_PARENTH + CompileTwo.END;
            } 
       
            $node.regResultTemp = regtemp;
            $node.regResultTex = regtex;
            $node.shaderStr = str;

            this.strVec.push(str);

            var texItem: TexItem = new TexItem;
            texItem.id = regtex.id;
            texItem.url = (<NodeTreeTex>$node).url;
            texItem.isDynamic = (<NodeTreeTex>$node).isDynamic;
            texItem.paramName = (<NodeTreeTex>$node).paramName;
            texItem.isMain = (<NodeTreeTex>$node).isMain;
            texItem.wrap = (<NodeTreeTex>$node).wrap;
            texItem.filter = (<NodeTreeTex>$node).filter;
            texItem.mipmap = (<NodeTreeTex>$node).mipmap;
            texItem.permul = (<NodeTreeTex>$node).permul;
            texItem.type = TexItem.CUBEMAP

            TextureManager.getInstance().getTexture(Scene_data.fileRoot + texItem.url, ($texture: TextureRes) => {
                texItem.textureRes = $texture;

                LoadManager.getInstance().load(Scene_data.fileRoot + texItem.url, LoadManager.IMG_TYPE, ($img: any, $info: any) => {

                    texItem.textureRes.texture = CubemapLoad.makeTempCubeTextture($img)


                });
            });
            this.texVec.push(texItem);

            input.hasCompiled = true;
            if (pNode) {
                pNode.releaseUse();
            }

        }
        public processTexNode($node: NodeTree): void {
            var str: string = ""
            var input: NodeTreeInputItem = $node.inputVec[0];
            var regtex: RegisterItem = this.getFragmentTex(<NodeTreeTex>$node);
            var regtemp: RegisterItem = this.getFragmentTemp();

            //"vec4 infoUv = texture2D(s_texture, v_texCoord.xy);\n" +

            var resultStr: string;

            if (regtemp.hasInit) {
                resultStr = CompileTwo.FT + regtemp.id;
            } else {
                resultStr = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id;
                regtemp.hasInit = true;
            }
            if (input.parentNodeItem) {
                var pNode: NodeTree = input.parentNodeItem.node;
                //str = TEX +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id +CompileTwo. COMMA+ pNode.getComponentID(input.parentNodeItem.id) +CompileTwo. COMMA+ FS + regtex.id +CompileTwo. SPACE + getTexType(NodeTreeTex($node).wrap);
                str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.texture2D + CompileTwo.LEFT_PARENTH + CompileTwo.FS + regtex.id + CompileTwo.COMMA + pNode.getComponentID(input.parentNodeItem.id) + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
            } else {
                //str = TEX +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id +CompileTwo. COMMA+CompileTwo. VI+ defaultUvReg.id +CompileTwo. COMMA+ FS + regtex.id +CompileTwo. SPACE + getTexType(NodeTreeTex($node).wrap);

                str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.texture2D + CompileTwo.LEFT_PARENTH + CompileTwo.FS + regtex.id + CompileTwo.COMMA + CompileTwo.VI + this.defaultUvReg.id + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
            }
            if ((<NodeTreeTex>$node).permul) {
                str += CompileTwo.LN + CompileTwo.FT + regtemp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_EQU_MATH + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.W + CompileTwo.END;
            }

            $node.regResultTemp = regtemp;
            $node.regResultTex = regtex;
            $node.shaderStr = str;

            this.strVec.push(str);

            var texItem: TexItem = new TexItem;
            texItem.id = regtex.id;
            texItem.url = (<NodeTreeTex>$node).url;
            texItem.isDynamic = (<NodeTreeTex>$node).isDynamic;
            texItem.paramName = (<NodeTreeTex>$node).paramName;
            texItem.isMain = (<NodeTreeTex>$node).isMain;
            texItem.wrap = (<NodeTreeTex>$node).wrap;
            texItem.filter = (<NodeTreeTex>$node).filter;
            texItem.mipmap = (<NodeTreeTex>$node).mipmap;
            texItem.permul = (<NodeTreeTex>$node).permul;

            TextureManager.getInstance().getTexture(Scene_data.fileRoot + texItem.url, ($texture: TextureRes) => {
                texItem.textureRes = $texture;
            });
            this.texVec.push(texItem);

            input.hasCompiled = true;
            if (pNode) {
                pNode.releaseUse();
            }

        }
        public processFunNode($node: NodeTree): void {
            var $nodeTreeFun: NodeTreeFun = <NodeTreeFun>$node;
     
            var str: string = ""
            var input0: NodeTreeInputItem = $node.inputVec[0];
            var type0: string = input0.type;
            var pNode0: NodeTree = input0.parentNodeItem.node;

            var output: NodeTreeOutoutItem = $node.outputVec[0];
            var regtemp: RegisterItem = this.getFragmentTemp();
            var resultStr: string = "";

            if (!regtemp.hasInit ) {//vec4(0,0,0,0)
                resultStr = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END + CompileTwo.LN;
                regtemp.hasInit = true;
            }
            if (output.type == MaterialItemType.FLOAT) {
                str = CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            } else if (output.type == MaterialItemType.VEC2) {
                str = CompileTwo.FT + regtemp.id + CompileTwo.XY + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            } else if (output.type == MaterialItemType.VEC3) {
                str = CompileTwo.FT + regtemp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            } else {
                str = CompileTwo.FT + regtemp.id  + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            }
            str = resultStr+ str;

            var $kfuncstr: string = $nodeTreeFun.funName+"("
            for (var i: number = 0; i < $node.inputVec.length; i++) {
                var $inputNodeTreeInputItem: NodeTreeInputItem = $node.inputVec[i];
                $inputNodeTreeInputItem.hasCompiled = true
                $inputNodeTreeInputItem.parentNodeItem.node.releaseUse()
                var kkkk: string = $inputNodeTreeInputItem.parentNodeItem.node.getComponentID($inputNodeTreeInputItem.parentNodeItem.id);
                $kfuncstr += kkkk
                if (i < $node.inputVec.length-1) {
                    $kfuncstr += ",";
                }
            }
            $kfuncstr += ")" + CompileTwo.END;

            str += $kfuncstr;

            $node.regResultTemp = regtemp;
            $node.shaderStr = str;
            this.strVec.push(str);

         
            if (!this.FunDic[$nodeTreeFun.funName]) {
                //函数只会添加一组
                this.funNodeStr += $nodeTreeFun.funStr;
                this.FunDic[$nodeTreeFun.funName] = $nodeTreeFun
            }  
        }
        private FunDic: any;
        public processDynamicNode($node: NodeTree, opCode: string): void {
            var str: string = ""
            var input0: NodeTreeInputItem = $node.inputVec[0];
            var input1: NodeTreeInputItem = $node.inputVec[1];
            var type0: string = input0.type;
            var type1: string = input1.type;

            var pNode0: NodeTree = input0.parentNodeItem.node;
            var pNode1: NodeTree = input1.parentNodeItem.node;

            var output: NodeTreeOutoutItem = $node.outputVec[0];

            var regtemp: RegisterItem = this.getFragmentTemp();

            var resultStr: string = "";

            //"vec4 ft0 = vec4(0,0,0,0);
            if (!regtemp.hasInit && !(input0.type == MaterialItemType.VEC4 || input1.type == MaterialItemType.VEC4)) {//vec4(0,0,0,0)
                resultStr = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END + CompileTwo.LN;
                regtemp.hasInit = true;
            }

            //"vec4 info = infoUv * infoLight;\n" +

            if (input0.type == MaterialItemType.VEC4 || input1.type == MaterialItemType.VEC4) {
                //str = opCode +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + COMMA;
                if (!regtemp.hasInit) {
                    resultStr = CompileTwo.VEC4 + CompileTwo.SPACE;
                    regtemp.hasInit = true;
                }
                str = CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            } else if (output.type == MaterialItemType.FLOAT) {
                //str = opCode +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + X + COMMA;
                str = CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            } else if (output.type == MaterialItemType.VEC2) {
                //str = opCode +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + XY + COMMA;
                str = CompileTwo.FT + regtemp.id + CompileTwo.XY + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            } else if (output.type == MaterialItemType.VEC3) {
                //str = opCode +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id +CompileTwo.XYZ+ COMMA;
                str = CompileTwo.FT + regtemp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            }

            str += pNode0.getComponentID(input0.parentNodeItem.id);

            str += CompileTwo.SPACE + opCode + CompileTwo.SPACE;

            str += pNode1.getComponentID(input1.parentNodeItem.id);

            str = resultStr + str + CompileTwo.END;


            input0.hasCompiled = true;
            input1.hasCompiled = true;
            pNode0.releaseUse();
            pNode1.releaseUse();

            $node.regResultTemp = regtemp;
            $node.shaderStr = str;
            this.strVec.push(str);
        }

        public processNode($node: NodeTree): void {
            switch ($node.type) {
                case NodeTree.VEC3:
                case NodeTree.FLOAT:
                case NodeTree.VEC2:
                    this.processVec3Node($node);
                    break;
                case NodeTree.TEX:
                    this.processTexNode($node);
                    break;
                case NodeTree.TEX3D:
                    this.processTex3DNode($node);
                    break;
                case NodeTree.TEXCUBE:
                    this.processTexCubeNode($node);
                    break;
                case NodeTree.FUN:
                    this.processFunNode($node);
                    break;
                case NodeTree.MUL:
                    this.processDynamicNode($node, "*");
                    break;
                case NodeTree.ADD:
                    this.processDynamicNode($node, "+");
                    break;
                case NodeTree.SUB:
                    this.processDynamicNode($node, "-");
                    break;
                case NodeTree.DIV:
                    this.processDynamicNode($node, "/");
                    break;
                case NodeTree.OP:
                    this.processOpNode($node);
                    break;
                case NodeTree.TIME:
                    this.processTimeNode($node);
                    break;
                case NodeTree.SIN:
                    this.processStaticNode($node, CompileTwo.SIN);
                    break;
                case NodeTree.COS:
                    this.processStaticNode($node, CompileTwo.COS);
                    break;
                case NodeTree.NORMAL:
                    this.useNormal = true
                    break;
                case NodeTree.PTCOLOR:
                    //  processParticleColor($node);
                    break;
                case NodeTree.VERCOLOR:
                    //  hasVertexColor = true;
                    break;
                case NodeTree.HEIGHTINFO:
                    //  processHeightInfo($node);
                    break;
                case NodeTree.FRESNEL:
                  
                    break;
                case NodeTree.REFRACTION:
                    // processRefraction($node);
                    break;
                case NodeTree.PANNER:
                    this.processPanner($node);
                    break;
                case NodeTree.MIN:
                    //   processMathMinNode($node);
                    break;
            }

        }
        public  processTimeNode($node: NodeTree): void {
            var str: string = ""
            var regtemp: RegisterItem = this.getFragmentTemp();

            var pNode: NodeTreeFloat = new NodeTreeFloat;
            pNode.type = NodeTree.FLOAT;
            pNode.constValue = (<NodeTreeTime>$node).speed;
            this.processVec3Node(pNode);

            if (!regtemp.hasInit) {
                str = CompileTwo.VEC4 + CompileTwo. SPACE + CompileTwo. FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo. DEFAULT_VEC4 + CompileTwo.END;
                regtemp.hasInit = true;
              this.  strVec.push(str);
            }


            //str =  FT + regtemp.id + X + SPACE + EQU + SPACE + FC + ZERO + W + SPACE +  MUL_MATH + SPACE + pNode.getComponentID(0) + END;
            str = CompileTwo. FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + this.timeStr + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + pNode.getComponentID(0) + CompileTwo. END;

            this.strVec.push(str);
            $node.regResultTemp = regtemp;
            this.hasTime = true;
            this.timeSpeed = 0.001;
        }
        private  processStaticNode($node: NodeTree, opCode: string): void {
            var str: string = "";
            var input: NodeTreeInputItem = $node.inputVec[0];
            var pNode: NodeTree = input.parentNodeItem.node;

            var regtemp: RegisterItem =this. getFragmentTemp();


            if (!regtemp.hasInit) {//vec4(0,0,0,0)
                str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo. SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo. END + CompileTwo. LN;
                regtemp.hasInit = true;
            }
            // ft0.x = sin(ft1.x);
            str += CompileTwo. FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo. EQU + CompileTwo. SPACE + opCode + CompileTwo.LEFT_PARENTH + pNode.getComponentID(input.parentNodeItem.id) + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
            //str += opCode + SPACE + FT + regtemp.id + X + COMMA + pNode.getComponentID(input.parentNodeItem.id);
            input.hasCompiled = true;
            pNode.releaseUse();

            $node.regResultTemp = regtemp;
            $node.shaderStr = str;
            this.strVec.push(str);
        }
        public processPanner($node: NodeTree): void {
            var str: string = "";
            var input1: NodeTreeInputItem = $node.inputVec[0];
            var input2: NodeTreeInputItem = $node.inputVec[1];


            var regtemp: RegisterItem = this.getFragmentTemp();

            if (!regtemp.hasInit) {
                str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END;
                regtemp.hasInit = true;
                this.strVec.push(str);
            }

            //var regtemp2:RegisterItem = getFragmentTemp();

            // ft0.xy = v0.xy * fc5.xy
            var pNode1: NodeTree;
            if (input1.parentNodeItem) {
                pNode1 = input1.parentNodeItem.node;
                //str += MUL + SPACE + FT + regtemp.id + XY + COMMA + VI + defaultUvReg.id + XY + COMMA + pNode1.getComponentID(input1.parentNodeItem.id) + LN;
                str = CompileTwo.FT + regtemp.id + CompileTwo.XY + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.VI + this.defaultUvReg.id + CompileTwo.XY + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + pNode1.getComponentID(input1.parentNodeItem.id) + CompileTwo.END + CompileTwo.LN;
            } else {
                pNode1 = new NodeTreeVec2;
                pNode1.type = NodeTree.VEC2;
                (<NodeTreeVec2>pNode1).constValue = (<NodeTreePanner>$node).coordinateValue;
                this.processVec3Node(pNode1);
                //str += MUL + SPACE + FT + regtemp.id + XY + COMMA + VI + defaultUvReg.id + XY + COMMA + pNode1.getComponentID(0) + LN;
                str = CompileTwo.FT + regtemp.id + CompileTwo.XY + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.VI + this.defaultUvReg.id + CompileTwo.XY + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + pNode1.getComponentID(0) + CompileTwo.END + CompileTwo.LN;
            }

            //str += MOV + SPACE + FT + regtemp.id + Z + COMMA + FC + ZERO + W + LN;
            //ft1.zw = fc5.zw * ft0.z
            var pNode2: NodeTree;
            if (input2.parentNodeItem) {
                pNode2 = input2.parentNodeItem.node;
                //str += FT + regtemp.id + ZW + SPACE + EQU + SPACE + pNode2.getComponentID(input2.parentNodeItem.id) + SPACE + MUL_MATH + SPACE + FC + ZERO + W + END +LN;
                str += CompileTwo.FT + regtemp.id + CompileTwo.ZW + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + pNode2.getComponentID(input2.parentNodeItem.id) + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + this.timeStr + CompileTwo.END + CompileTwo.LN;
            } else {
                pNode2 = new NodeTreeVec2;
                pNode2.type = NodeTree.VEC2;
                (<NodeTreeVec2>pNode2).constValue = (<NodeTreePanner>$node).speedValue;
                this.processVec3Node(pNode2);
                //str += FT + regtemp.id + ZW + SPACE + EQU + SPACE + pNode2.getComponentID(0) + SPACE + MUL_MATH + SPACE + FC + ZERO + W + END + LN;
                str += CompileTwo.FT + regtemp.id + CompileTwo.ZW + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + pNode2.getComponentID(0) + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + this.timeStr + CompileTwo.END + CompileTwo.LN;
            }
            //ft1.xy = ft1.xy + ft1.zw

            str += CompileTwo.FT + regtemp.id + CompileTwo.XY + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.XY + CompileTwo.SPACE + CompileTwo.ADD_MATH + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.ZW + CompileTwo.END;
            //str += ADD + SPACE + FT + regtemp.id + XY + COMMA + FT + regtemp.id + XY + COMMA + FT + regtemp2.id + XY;


            this.hasTime = true;
            this.timeSpeed = 0.001;

            $node.regResultTemp = regtemp;
            $node.shaderStr = str;
            this.strVec.push(str);
            pNode1.releaseUse();
            pNode2.releaseUse();
        }
        private preSetNormal(): void {
            for (var i: number = this.priorityList.length - 1; i >= 0; i--) {
                var treelist: Array<NodeTree> = this.priorityList[i];
                for (var j: number = 0; j < treelist.length; j++) {
                    if (treelist[j].type == NodeTree.OP) {

                   
                        var inputNormal: NodeTreeInputItem = treelist[j].inputVec[2];

                  
                        if (inputNormal.parentNodeItem) {
                            this.useNormal = true;
                        } else {
                            this.useNormal = false;
                        }
                        return;
                    }
                }
            }
        }


     
        private traceFt(): void {
            return;
        }
        private get killStr(): string {
            return "fc[" + this._killID + "].x";
        }

        private get timeStr(): string {
            return "fc[" + this._timeID + "].y";
        }

        private get fogdataXStr(): string {
            return "fc[" + this._fogdataID + "].z";
        }

        private get fogdataYStr(): string {
            return "fc[" + this._fogdataID + "].w";
        }

        private get fogcolorStr(): string {
            return "fc[" + this._fogcolorID + "].xyz";
        }

        private get camposStr(): string {
            return "fc[" + this._camposID + "].xyz";
        }
        private get scalelightmapStr(): string {
            return "fc[" + this._scalelightmapID + "].x";
        }
        public processVec3Node($node: NodeTree): void {
            var str: string = "";
            this.setFragmentConst($node);
            this.addConstItem($node);
        }
        public addConstItem($node: NodeTree): void {
            if ($node.isDynamic) {
                console.log($node.paramName);
            }
            var constItem: ConstItem;

            var id: number = $node.regResultConst.id;

            for (var i: number = 0; i < this.constVec.length; i++) {
                if (this.constVec[i].id == id) {
                    constItem = this.constVec[i];
                }
            }

            if (!constItem) {
                constItem = new ConstItem;
                constItem.id = $node.regResultConst.id;
                this.constVec.push(constItem);
            }


            if ($node.type == NodeTree.VEC3) {
                if ($node.regConstIndex == 0) {
                    var v3d: Vector3D = (<NodeTreeVec3>$node).constVec3;
                    constItem.value.setTo(v3d.x, v3d.y, v3d.z);
                    if ($node.isDynamic) {
                        constItem.paramName0 = $node.paramName;
                        constItem.param0Type = 4;
                        constItem.param0Index = 0;
                    }
                }
            } else if ($node.type == NodeTree.FLOAT) {
                var num: number = (<NodeTreeFloat>$node).constValue;
                if ($node.regConstIndex == 0) {
                    constItem.value.x = num;
                    if ($node.isDynamic) {
                        constItem.paramName0 = $node.paramName;
                        constItem.param0Type = 1;
                        constItem.param0Index = 0;
                    }
                } else if ($node.regConstIndex == 1) {
                    constItem.value.y = num;
                    if ($node.isDynamic) {
                        constItem.paramName1 = $node.paramName;
                        constItem.param1Type = 1;
                        constItem.param1Index = 1;
                    }
                } else if ($node.regConstIndex == 2) {
                    constItem.value.z = num;
                    if ($node.isDynamic) {
                        constItem.paramName2 = $node.paramName;
                        constItem.param2Type = 1;
                        constItem.param2Index = 2;
                    }
                } else if ($node.regConstIndex == 3) {
                    constItem.value.w = num;
                    if ($node.isDynamic) {
                        constItem.paramName3 = $node.paramName;
                        constItem.param3Type = 1;
                        constItem.param3Index = 3;
                    }
                }
            } else if ($node.type == NodeTree.VEC2) {
                var vec2: Vector2D = (<NodeTreeVec2>$node).constValue;
                if ($node.regConstIndex == 0) {
                    constItem.value.x = vec2.x;
                    constItem.value.y = vec2.y;
                    if ($node.isDynamic) {
                        constItem.paramName0 = $node.paramName;
                        constItem.param0Type = 2;
                        constItem.param0Index = 0;
                    }
                } else if ($node.regConstIndex == 1) {
                    constItem.value.y = vec2.x;
                    constItem.value.z = vec2.y;
                    if ($node.isDynamic) {
                        constItem.paramName1 = $node.paramName;
                        constItem.param1Type = 2;
                        constItem.param1Index = 1;
                    }
                } else if ($node.regConstIndex == 2) {
                    constItem.value.z = vec2.x;
                    constItem.value.w = vec2.y;
                    if ($node.isDynamic) {
                        constItem.paramName2 = $node.paramName;
                        constItem.param2Type = 2;
                        constItem.param2Index = 2;
                    }
                }
            }



        }
        public setFragmentConst($nodeTree: NodeTree): void {
            for (var i: number = this._fcBeginID; i < this.fragmentConstList.length; i++) {
                var tf: boolean = this.fragmentConstList[i].getUse($nodeTree);
                if (tf) {
                    break;
                }
            }
        }

        public processOpNode($node: NodeTree): void {
            //diffuse

            this.lightProbe = (<NodeTreeOP>$node).lightProbe;
            this.directLight = (<NodeTreeOP>$node).directLight;
            this.noLight = (<NodeTreeOP>$node).noLight;
            this.fogMode = (<NodeTreeOP>$node).fogMode;
            this.scaleLightMap = (<NodeTreeOP>$node).scaleLightMap;

            var str: string = "";
            var inputDiffuse: NodeTreeInputItem = $node.inputVec[0];
      
            var inputNormal: NodeTreeInputItem = $node.inputVec[1];
            var skyboxInput: NodeTreeInputItem = $node.inputVec[2];

          

            this.usePbr = false;

            if (inputNormal.parentNodeItem) {

                this.useNormal = true;
            } 
        



            this.useDynamicIBL = (<NodeTreeOP>$node).useDynamicIBL;

            var regOp: RegisterItem;
            var texItem: TexItem;

            this.traceFt();

            var hasDiffuse: boolean = false;
            if (inputDiffuse.parentNodeItem) {//漫反射部分

                hasDiffuse = true;

                var pNodeDiffuse: NodeTree = inputDiffuse.parentNodeItem.node;//diffuse输入节点

                var regtempLightMap: RegisterItem = this.getFragmentTemp();
                var resultStr: string;
                if (regtempLightMap.hasInit) {
                    resultStr = CompileTwo.FT + regtempLightMap.id;
                } else {
                    resultStr = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id;
                    regtempLightMap.hasInit = true;
                }

                if (this.lightProbe) {
          
                } else if (this.directLight) {
         
                } else if (this.noLight) {

                } else {
                    var regtexLightMap: RegisterItem = this.getFragmentTex();
                    // ve4 ft0 = texture2D(fs0,v1);
                    // ft0.xyz = ft0.xyz * 5.0;
                    str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.texture2D + CompileTwo.LEFT_PARENTH + CompileTwo.FS + regtexLightMap.id + CompileTwo.COMMA + CompileTwo.VI + this.defaultLightUvReg.id + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
                    if (this.scaleLightMap) {
                        str += CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + CompileTwo.scalelight + CompileTwo.END;
                    } else {
                        str += CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + "2.0" + CompileTwo.END;
                    }

                    //					str = TEX +CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. COMMA+CompileTwo. VI+ defaultLightUvReg.id +CompileTwo. COMMA+ FS + regtexLightMap.id +CompileTwo. SPACE + texType +CompileTwo. LN;
                    //					str += MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. COMMA+ FC + THREE + X;
                    this.strVec.push(str);
                    texItem = new TexItem;
                    texItem.id = regtexLightMap.id;
                    texItem.type = TexItem.LIGHTMAP;
                    this.texVec.push(texItem);
                    this.useLightMap = true;
                }

                if (this.noLight && !this.directLight) {
                    str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.VEC4 + CompileTwo.LEFT_PARENTH + pNodeDiffuse.getComponentID(inputDiffuse.parentNodeItem.id) + CompileTwo.COMMA + "1.0" + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
       
         
                }
                this.strVec.push(str);

                pNodeDiffuse.releaseUse();

         


                regOp = this.getFragmentTemp();//输出用临时寄存器

                if (!regOp.hasInit) {
                    str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regOp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END;
                    regOp.hasInit = true;
                    this.strVec.push(str);
                }

                if (this.usePbr) {
                   
                } else {
          
                    str = CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.END;
                }

                inputDiffuse.hasCompiled = true;
                //pNodeDiffuse.releaseUse();

                this.strVec.push(str);

                regtempLightMap.inUse = false;
              
            }

         

            //alpha
            str = "";
      
        
                //str = MOV +CompileTwo. SPACE +CompileTwo. FT+ regOp.id + W +CompileTwo. COMMA+ FC + ZERO + X;
                //op.w = 1
                str = CompileTwo.FT + regOp.id + CompileTwo.W + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.ONE_FLOAT + CompileTwo.END;
        
            this.strVec.push(str);

            //kill
            str = "";
  

            var regtempFog: RegisterItem;
          

            str = "";
            //"gl_FragColor = infoUv;\n" +
            str = CompileTwo.FO + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regOp.id + CompileTwo.END;
            this.strVec.push(str);



            this.backCull = (<NodeTreeOP>$node).backCull;
            this.blendMode = (<NodeTreeOP>$node).blendMode;
            this.writeZbuffer = (<NodeTreeOP>$node).writeZbuffer;
            this.normalScale = (<NodeTreeOP>$node).normalScale;
        }
        private initBaseFc(): void {
            var dataID: number = 0;


            var $useKill: Boolean = false;
            var $hasTime: Boolean = false;
            var $fogMode: number = 0;
            var $usePbr: Boolean = false;
            //var $hasFresnel:Boolean = false;
            var $scaleLightMap: Boolean = false;


            for (var i: number = this.priorityList.length - 1; i >= 0; i--) {
                var treelist: Array<NodeTree> = this.priorityList[i];
                for (var j: number = 0; j < treelist.length; j++) {

                    var node: NodeTree = treelist[j];
                    if (node.type == NodeTree.OP) {
                        var opnode: NodeTreeOP = node as NodeTreeOP;

                        $fogMode = opnode.fogMode;
                        $scaleLightMap = opnode.scaleLightMap;
                    
 

                        
                    } else if (node.type == NodeTree.TIME || node.type == NodeTree.PANNER) {
                        $hasTime = true;
                    }


                }
            }

            if ($useKill || $hasTime || $fogMode != 0) {
                dataID++;
            }
            if ($usePbr || $fogMode == 1) {
                this._camposID = dataID;
                dataID++;
            }
            if ($fogMode != 0) {
                this._fogcolorID = dataID;
                dataID++;
            }
            if ($scaleLightMap) {
                this._scalelightmapID = dataID;
                dataID++;
            }
            this._fcBeginID = dataID;

        }

    }
}