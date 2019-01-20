module materialui {
    import TexItem = Pan3d.TexItem
    import MaterialBaseParam = Pan3d.MaterialBaseParam
    import Scene_data = Pan3d.Scene_data
    import ConstItem = Pan3d.ConstItem
    import TextureManager = Pan3d.TextureManager
    import TextureRes = Pan3d.TextureRes
    
    export class CompilePan {

       


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
        private hasFresnel: boolean;
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
            this.hasFresnel = false;
            this.useDynamicIBL = false;
            this.lightProbe = false;
            this.useLightMap = false;
            this.useKill = false;
            this.directLight = false;
            this.noLight = false;
            this.fogMode = 0;
            this.scaleLightMap = false;

            this.initBaseFc();

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
        
            var $materialBaseParam: MaterialBaseParam = new MaterialBaseParam()
            $materialBaseParam.setData($materialTree, []);

            $materialTree.fcNum = this.getMaxFc();
            $materialTree.fcData = this.makeFc($materialTree.fcNum);


            $materialTree.hasTime = this.hasTime;;
            $materialTree.hasVertexColor = this.hasVertexColor;;
            $materialTree.usePbr = this.usePbr;;
            $materialTree.useNormal = this.useNormal;;
            $materialTree.roughness = 0;
            $materialTree.hasFresnel = this.hasFresnel;;
            $materialTree.useDynamicIBL = this.useDynamicIBL;;
            $materialTree.lightProbe = this.lightProbe;;
            $materialTree.useKill = this.useKill;;
            $materialTree.directLight = this.directLight;;
            $materialTree.noLight = this.noLight;;
            $materialTree.fogMode = this.fogMode;;
            $materialTree.scaleLightMap = this.scaleLightMap;;

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
        private getGLSLStr(): string {
            var mainStr: string = "";
            for (var i: number = 0; i < this.strVec.length; i++) {
                mainStr += this.strVec[i] + "\n";
            }
            var perStr: string = "precision mediump float;\n";
            var hasParticleColor: boolean = false;
            var texStr: string = "";
            for (i = 0; i < this.texVec.length; i++) {
                if (this.texVec[i].type == 3) {
                    texStr += "uniform samplerCube fs" + this.texVec[i].id + ";\n";
                } else {
                    texStr += "uniform sampler2D fs" + this.texVec[i].id + ";\n";
                }
                if (this.texVec[i].isParticleColor) {
                    hasParticleColor = true;
                }
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
            if (this.lightProbe || this.directLight) {
                varyStr += "varying vec3 v2;\n";
            } else if (this.useLightMap) {
                varyStr += "varying vec2 v2;\n";
            }

            if (this.hasVertexColor) {
                varyStr += "varying vec4 v2;\n";
            }

            if (this.usePbr) {
                varyStr += "varying vec3 v1;\n";
                if (!this.useNormal) {
                    varyStr += "varying vec3 v4;\n";
                } else {
                    varyStr += "varying mat3 v4;\n";
                }

            } else if (this.fogMode != 0) {
                varyStr += "varying vec3 v1;\n";
            }
            if (this.useNormal) {
                varyStr += "varying vec3 v7;\n";
            }
            if (hasParticleColor) {
                varyStr += "varying vec2 v1;\n";
            }

            var beginStr: string = "void main(void){\n\n";
            var endStr: string = "\n}";
            var resultStr: string = perStr + texStr + constStr + varyStr + beginStr + mainStr + endStr;

            console.log("-------------------!")
            console.log(resultStr)
            console.log("-------------------")
            return resultStr;
        }
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
                    //   processTimeNode($node);
                    break;
                case NodeTree.SIN:
                    //   processStaticNode($node, SIN);
                    break;
                case NodeTree.LERP:
                    //  processLerpNode($node);
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
                    this.processFresnel($node);
                    break;
                case NodeTree.REFRACTION:
                    // processRefraction($node);
                    break;
                case NodeTree.PANNER:
                    // processPanner($node);
                    break;
                case NodeTree.MIN:
                    //   processMathMinNode($node);
                    break;
            }

        }
        private preSetNormal(): void {
            for (var i: number = this.priorityList.length - 1; i >= 0; i--) {
                var treelist: Array<NodeTree> = this.priorityList[i];
                for (var j: number = 0; j < treelist.length; j++) {
                    if (treelist[j].type == NodeTree.OP) {

                        var inputMetallic: NodeTreeInputItem = treelist[j].inputVec[1];
                        var inputSpecular: NodeTreeInputItem = treelist[j].inputVec[2];
                        var inputRoughness: NodeTreeInputItem = treelist[j].inputVec[3];
                        var inputNormal: NodeTreeInputItem = treelist[j].inputVec[4];

                        if (inputMetallic.parentNodeItem || inputSpecular.parentNodeItem || inputRoughness.parentNodeItem) {
                            this.usePbr = true;
                        } else {
                            this.usePbr = false;
                        }
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


        public processFresnel($node: NodeTree): void {


            this.preSetNormal();

            var str: string = ""
            //var input0:NodeTreeInputItem = $node.inputVec[0];
            var input1: NodeTreeInputItem = $node.inputVec[0];
            var input2: NodeTreeInputItem = $node.inputVec[1];


            //var pNode0:NodeTree = input0.parentNodeItem.node;
            var pNode1: NodeTree = input1.parentNodeItem.node;
            var pNode2: NodeTree = input2.parentNodeItem.node;

            //			var output:NodeTreeOutoutItem = $node.outputVec[0];

            var regtemp: RegisterItem = this.getFragmentTemp();

            if (!regtemp.hasInit) {
                str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END;
                regtemp.hasInit = true;
                this.strVec.push(str);
            }

            var normalID: number;
            if (this.usePbr) {
                if (this.useNormal) {
                    normalID = 7;
                } else {
                    normalID = this.defaultTangent.id;
                }
            } else {
                normalID = this.defaultTangent.id;
            }

            //sub ft0.xyz,fc2.xyz,v1.xyz
            //normalize ft0.xyz,ft0.xyz
            //dp3 ft0.x,ft0.xyz,v4.xyz

            //str =CompileTwo. FT+ regtemp.id +CompileTwo.XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + FC + ONE +CompileTwo.XYZ+CompileTwo. SPACE +CompileTwo.SUB_MATH+CompileTwo. SPACE + VI + defaultPtReg.id +CompileTwo.XYZ+ END + LN;
            str = CompileTwo.FT + regtemp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + this.camposStr + CompileTwo.SPACE + CompileTwo.SUB_MATH + CompileTwo.SPACE + CompileTwo.VI + this.defaultPtReg.id + CompileTwo.XYZ + CompileTwo.END + CompileTwo.LN;
            str += CompileTwo.FT + regtemp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.NRM + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtemp.id + CompileTwo.XYZ + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
            str += CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DOT + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtemp.id + CompileTwo.XYZ + CompileTwo.COMMA + CompileTwo.VI + normalID + CompileTwo.XYZ + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;


            //sub ft0.x,fc0.x,ft0.x
            //add ft0.x,ft0.x,fc5.y
            //sat ft0.x,ft0.x
            //mul ft0.x,ft0.x,fc5.x

            //			str += SUB +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + X + COMMA + FC + ZERO + X + COMMA +CompileTwo. FT+ regtemp.id + X + LN;
            //			str += ADD +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + X + COMMA +CompileTwo. FT+ regtemp.id + X + COMMA + pNode2.getComponentID(input2.parentNodeItem.id) + LN;
            //			str += SAT +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + X + COMMA +CompileTwo. FT+ regtemp.id + X + LN;
            //			str += MUL +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + X + COMMA +CompileTwo. FT+ regtemp.id + X + COMMA + pNode1.getComponentID(input1.parentNodeItem.id);

            str += CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + "1.0" + CompileTwo.SPACE + CompileTwo.SUB_MATH + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.ADD_MATH + CompileTwo.SPACE + pNode2.getComponentID(input2.parentNodeItem.id) + CompileTwo.END + CompileTwo.LN;
            str += CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.TEX_WRAP_CLAMP + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.COMMA + "0.0" + CompileTwo.COMMA + "1.0" + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
            str += CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + pNode1.getComponentID(input1.parentNodeItem.id) + CompileTwo.END;

            input2.hasCompiled = true;
            input1.hasCompiled = true;

            pNode2.releaseUse();
            pNode1.releaseUse();

            $node.regResultTemp = regtemp;
            $node.shaderStr = str;
            this.strVec.push(str);
            this.hasFresnel = true;
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
    
            var inputNormal: NodeTreeInputItem = $node.inputVec[2];
       

       

            if (inputNormal.parentNodeItem) {
                this.useNormal = true;
            } else {
                this.useNormal = false;
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
                } else {
          
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
                    //ft2.xyz = ft0.xyz * ft1.xyz
                    //str =  MUL +CompileTwo. SPACE +CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+ pNodeDiffuse.getComponentID(inputDiffuse.parentNodeItem.id) +CompileTwo. COMMA+CompileTwo. FT+ regtempLightMap.id + XYZ;
                    //str =CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. MUL_MATH+CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+ END;
                    //str =  MOV +CompileTwo. SPACE +CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempLightMap.id + XYZ;
                    str = CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.END;
                }

                inputDiffuse.hasCompiled = true;
                //pNodeDiffuse.releaseUse();

                this.strVec.push(str);

                regtempLightMap.inUse = false;
            


            }


            //alpha
            str = "";
            var inputAlpha: NodeTreeInputItem = $node.inputVec[7];
            if (!inputAlpha.parentNodeItem) {
                //str = MOV +CompileTwo. SPACE +CompileTwo. FT+ regOp.id + W +CompileTwo. COMMA+ FC + ZERO + X;
                //op.w = 1
                str = CompileTwo.FT + regOp.id + CompileTwo.W + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.ONE_FLOAT + CompileTwo.END;
            } else {
       
            }
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