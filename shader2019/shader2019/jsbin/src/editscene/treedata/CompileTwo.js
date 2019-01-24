var materialui;
(function (materialui) {
    var Scene_data = Pan3d.Scene_data;
    var MaterialBaseParam = Pan3d.MaterialBaseParam;
    var TexItem = Pan3d.TexItem;
    var TextureCube = Pan3d.TextureCube;
    var ConstItem = Pan3d.ConstItem;
    var CubemapLoad = Pan3d.CubemapLoad;
    var TextureManager = Pan3d.TextureManager;
    var CompileTwo = /** @class */ (function () {
        function CompileTwo() {
            this.timeSpeed = 0;
            this.killNum = 0;
            this.roughness = 0;
            this.normalScale = 0;
            this._killID = 0;
            this._timeID = 0;
            this._fogdataID = 0;
            this._camposID = 0;
            this._fogcolorID = 0;
            this._scalelightmapID = 0;
            this._fcBeginID = 0;
            this.initReg();
            new Vector3D;
            this.defaultUvReg = new materialui.RegisterItem(0);
            this.defaultPtReg = new materialui.RegisterItem(1);
            this.defaultLightUvReg = new materialui.RegisterItem(2);
            this.defaultLutReg = new materialui.RegisterItem(3);
            this.defaultTangent = new materialui.RegisterItem(4);
            this.defatultV5 = new materialui.RegisterItem(5);
            this.defatultV6 = new materialui.RegisterItem(6);
        }
        CompileTwo.prototype.initReg = function () {
            this.fragmentTempList = new Array;
            this.fragmentTexList = new Array;
            this.fragmentConstList = new Array;
            for (var i = 0; i < 8; i++) {
                this.fragmentTempList.push(new materialui.RegisterItem(i));
                this.fragmentTexList.push(new materialui.RegisterItem(i));
            }
            for (i = 0; i < 28; i++) {
                this.fragmentConstList.push(new materialui.RegisterItem(i));
            }
        };
        CompileTwo.prototype.compile = function ($priorityList, $materialTree) {
            materialui.NodeTree.jsMode = true;
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
            this.cubeTextItem = null;
            this.initBaseFc();
            this.funNodeStr = "";
            this.FunDic = {};
            for (var i = this.priorityList.length - 1; i >= 0; i--) {
                var treelist = this.priorityList[i];
                for (var j = 0; j < treelist.length; j++) {
                    this.processNode(treelist[j]);
                }
            }
            var resultStr = this.getGLSLStr();
            $materialTree.shaderStr = resultStr;
            $materialTree.constList = this.constVec;
            $materialTree.texList = this.texVec;
            $materialTree.cubeTextItem = this.cubeTextItem;
            var $materialBaseParam = new MaterialBaseParam();
            $materialBaseParam.setData($materialTree, []);
            $materialTree.fcNum = this.getMaxFc();
            $materialTree.fcData = this.makeFc($materialTree.fcNum);
            $materialTree.hasTime = this.hasTime;
            ;
            $materialTree.hasVertexColor = this.hasVertexColor;
            ;
            $materialTree.usePbr = this.usePbr;
            ;
            $materialTree.useNormal = this.useNormal;
            ;
            $materialTree.roughness = 0;
            $materialTree.useDynamicIBL = this.useDynamicIBL;
            ;
            $materialTree.lightProbe = this.lightProbe;
            ;
            $materialTree.useKill = this.useKill;
            ;
            $materialTree.directLight = this.directLight;
            ;
            $materialTree.noLight = this.noLight;
            ;
            $materialTree.fogMode = this.fogMode;
            ;
            $materialTree.scaleLightMap = this.scaleLightMap;
            ;
            $materialTree.skyBoxTextId = this.skyBoxTextId;
            $materialTree.hasSkyBox = this.hasSkyBox;
            return resultStr;
        };
        CompileTwo.prototype.getMaxFc = function () {
            var maxID = 0;
            if (this.constVec.length) {
                maxID = this.constVec[this.constVec.length - 1].id + 1;
            }
            else {
                if (this._fcBeginID > 0) {
                    maxID = this._fcBeginID;
                }
            }
            return maxID;
        };
        CompileTwo.prototype.makeFc = function (fcNum) {
            var fcIDAry = [this._camposID, this._fogcolorID, this._scalelightmapID];
            var fcData = new Float32Array(fcNum * 4);
            if (this.hasTime || this.useKill || this.fogMode != 0) { //fc0
                if (this.useKill) {
                    fcData[0] = this.killNum;
                }
                if (this.fogMode != 0) {
                    fcData[2] = Scene_data.fogData[0];
                    fcData[3] = Scene_data.fogData[1];
                }
            }
            if (this.usePbr || this.fogMode == 1) {
                var idx = fcIDAry[0] * 4;
                fcData[0 + idx] = Scene_data.cam3D.x;
                fcData[1 + idx] = Scene_data.cam3D.y;
                fcData[2 + idx] = Scene_data.cam3D.z;
            }
            if (this.fogMode != 0) {
                var idx = fcIDAry[1] * 4;
                fcData[0 + idx] = Scene_data.fogColor[0];
                fcData[1 + idx] = Scene_data.fogColor[1];
                fcData[2 + idx] = Scene_data.fogColor[2];
            }
            for (var i = 0; i < this.constVec.length; i++) {
                this.constVec[i].creat(fcData);
            }
            return fcData;
        };
        CompileTwo.prototype.getGLSLStr = function () {
            var mainStr = "";
            for (var i = 0; i < this.strVec.length; i++) {
                mainStr += this.strVec[i] + "\n";
            }
            var perStr = "precision mediump float;\n";
            var hasParticleColor = false;
            var texStr = "";
            for (i = 0; i < this.texVec.length; i++) {
                if (this.texVec[i].type == TexItem.CUBEMAP) {
                    texStr += "uniform samplerCube fs" + this.texVec[i].id + ";\n";
                }
                else {
                    texStr += "uniform sampler2D fs" + this.texVec[i].id + ";\n";
                }
            }
            if (this.cubeTextItem) {
                texStr += "uniform samplerCube skyBoxCube; \n";
            }
            var constStr = "";
            var maxID = 0;
            if (this.constVec.length) {
                maxID = this.constVec[this.constVec.length - 1].id + 1;
            }
            else {
                if (this._fcBeginID > 0) {
                    maxID = this._fcBeginID;
                }
            }
            this.fcNum = maxID;
            if (this.fcNum > 0) {
                constStr += "uniform vec4 fc[" + (this.fcNum) + "];\n";
            }
            var varyStr = "";
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
            var beginStr = "void main(void){\n";
            if (this.useNormal) {
                var inputNormal = this.getInputNormal();
                if (inputNormal.parentNodeItem) {
                    beginStr += "vec3 normalVec = normalpic(" + "texture2D(fs" + inputNormal.parentNodeItem.node.regResultTex.id + ",v0).xyz)" + CompileTwo.END + "\n";
                }
                else {
                    beginStr += "vec3 normalVec = " + "N.xyz" + CompileTwo.END + "\n";
                }
            }
            var endStr = "\n}";
            var resultStr = perStr + texStr + constStr + varyStr + this.funNodeStr + beginStr + mainStr + endStr;
            return resultStr;
        };
        CompileTwo.prototype.getInputNormal = function () {
            for (var i = this.priorityList.length - 1; i >= 0; i--) {
                var treelist = this.priorityList[i];
                for (var j = 0; j < treelist.length; j++) {
                    if (treelist[j].type == materialui.NodeTree.OP) {
                        return treelist[j].inputVec[1];
                    }
                }
            }
            return null;
        };
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
        CompileTwo.prototype.getFragmentTex = function ($nodeTreeTex) {
            if ($nodeTreeTex === void 0) { $nodeTreeTex = null; }
            for (var i = 0; i < this.fragmentTexList.length; i++) {
                if (!this.fragmentTexList[i].inUse) {
                    this.fragmentTexList[i].inUse = true;
                    this.fragmentTexList[i].url = "";
                    return this.fragmentTexList[i];
                }
            }
            return null;
        };
        CompileTwo.prototype.getFragmentTemp = function () {
            for (var i = 0; i < this.fragmentTempList.length; i++) {
                if (!this.fragmentTempList[i].inUse) {
                    this.fragmentTempList[i].inUse = true;
                    return this.fragmentTempList[i];
                }
            }
            return null;
        };
        CompileTwo.prototype.processTexCubeNode = function ($node) {
            this.hasSkyBox = true;
            var texItem = new TextureCube;
            texItem.url = $node.url;
            texItem.isDynamic = $node.isDynamic;
            texItem.paramName = $node.paramName;
            texItem.isMain = $node.isMain;
            texItem.wrap = $node.wrap;
            texItem.filter = $node.filter;
            texItem.mipmap = $node.mipmap;
            texItem.permul = $node.permul;
            TextureManager.getInstance().getTexture(Scene_data.fileRoot + texItem.url, function ($texture) {
                texItem.textureRes = $texture;
            });
            LoadManager.getInstance().load(Scene_data.fileRoot + texItem.url, LoadManager.IMG_TYPE, function ($img, $info) {
                texItem.cubeTextWebgl = CubemapLoad.makeTempCubeTextture($img);
            });
            this.cubeTextItem = texItem;
        };
        CompileTwo.prototype.processTex3DNode = function ($node) {
            var str = "";
            var input = $node.inputVec[0];
            var regtex = this.getFragmentTex($node);
            var regtemp = this.getFragmentTemp();
            var resultStr;
            if (regtemp.hasInit) {
                resultStr = CompileTwo.FT + regtemp.id;
            }
            else {
                resultStr = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id;
                regtemp.hasInit = true;
            }
            if (input.parentNodeItem) {
                var pNode = input.parentNodeItem.node;
                str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + "textureCube" + CompileTwo.LEFT_PARENTH + CompileTwo.FS + regtex.id + CompileTwo.COMMA + pNode.getComponentID(input.parentNodeItem.id) + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
            }
            $node.regResultTemp = regtemp;
            $node.regResultTex = regtex;
            $node.shaderStr = str;
            this.strVec.push(str);
            var texItem = new TexItem;
            texItem.id = regtex.id;
            texItem.url = $node.url;
            texItem.isDynamic = $node.isDynamic;
            texItem.paramName = $node.paramName;
            texItem.isMain = $node.isMain;
            texItem.wrap = $node.wrap;
            texItem.filter = $node.filter;
            texItem.mipmap = $node.mipmap;
            texItem.permul = $node.permul;
            texItem.type = TexItem.CUBEMAP;
            TextureManager.getInstance().getTexture(Scene_data.fileRoot + texItem.url, function ($texture) {
                texItem.textureRes = $texture;
                LoadManager.getInstance().load(Scene_data.fileRoot + texItem.url, LoadManager.IMG_TYPE, function ($img, $info) {
                    texItem.textureRes.texture = CubemapLoad.makeTempCubeTextture($img);
                });
            });
            this.texVec.push(texItem);
            input.hasCompiled = true;
            if (pNode) {
                pNode.releaseUse();
            }
        };
        CompileTwo.prototype.processTexNode = function ($node) {
            var str = "";
            var input = $node.inputVec[0];
            var regtex = this.getFragmentTex($node);
            var regtemp = this.getFragmentTemp();
            //"vec4 infoUv = texture2D(s_texture, v_texCoord.xy);\n" +
            var resultStr;
            if (regtemp.hasInit) {
                resultStr = CompileTwo.FT + regtemp.id;
            }
            else {
                resultStr = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id;
                regtemp.hasInit = true;
            }
            if (input.parentNodeItem) {
                var pNode = input.parentNodeItem.node;
                //str = TEX +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id +CompileTwo. COMMA+ pNode.getComponentID(input.parentNodeItem.id) +CompileTwo. COMMA+ FS + regtex.id +CompileTwo. SPACE + getTexType(NodeTreeTex($node).wrap);
                str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.texture2D + CompileTwo.LEFT_PARENTH + CompileTwo.FS + regtex.id + CompileTwo.COMMA + pNode.getComponentID(input.parentNodeItem.id) + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
            }
            else {
                //str = TEX +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id +CompileTwo. COMMA+CompileTwo. VI+ defaultUvReg.id +CompileTwo. COMMA+ FS + regtex.id +CompileTwo. SPACE + getTexType(NodeTreeTex($node).wrap);
                str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.texture2D + CompileTwo.LEFT_PARENTH + CompileTwo.FS + regtex.id + CompileTwo.COMMA + CompileTwo.VI + this.defaultUvReg.id + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
            }
            if ($node.permul) {
                str += CompileTwo.LN + CompileTwo.FT + regtemp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_EQU_MATH + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.W + CompileTwo.END;
            }
            $node.regResultTemp = regtemp;
            $node.regResultTex = regtex;
            $node.shaderStr = str;
            this.strVec.push(str);
            var texItem = new TexItem;
            texItem.id = regtex.id;
            texItem.url = $node.url;
            texItem.isDynamic = $node.isDynamic;
            texItem.paramName = $node.paramName;
            texItem.isMain = $node.isMain;
            texItem.wrap = $node.wrap;
            texItem.filter = $node.filter;
            texItem.mipmap = $node.mipmap;
            texItem.permul = $node.permul;
            TextureManager.getInstance().getTexture(Scene_data.fileRoot + texItem.url, function ($texture) {
                texItem.textureRes = $texture;
            });
            this.texVec.push(texItem);
            input.hasCompiled = true;
            if (pNode) {
                pNode.releaseUse();
            }
        };
        CompileTwo.prototype.processFunNode = function ($node) {
            var $nodeTreeFun = $node;
            var str = "";
            var input0 = $node.inputVec[0];
            var type0 = input0.type;
            var pNode0 = input0.parentNodeItem.node;
            var output = $node.outputVec[0];
            var regtemp = this.getFragmentTemp();
            var resultStr = "";
            if (!regtemp.hasInit) { //vec4(0,0,0,0)
                resultStr = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END + CompileTwo.LN;
                regtemp.hasInit = true;
            }
            if (output.type == materialui.MaterialItemType.FLOAT) {
                str = CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            }
            else if (output.type == materialui.MaterialItemType.VEC2) {
                str = CompileTwo.FT + regtemp.id + CompileTwo.XY + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            }
            else if (output.type == materialui.MaterialItemType.VEC3) {
                str = CompileTwo.FT + regtemp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            }
            else {
                str = CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            }
            str = resultStr + str;
            var $kfuncstr = $nodeTreeFun.funName + "(";
            for (var i = 0; i < $node.inputVec.length; i++) {
                var $inputNodeTreeInputItem = $node.inputVec[i];
                $inputNodeTreeInputItem.hasCompiled = true;
                $inputNodeTreeInputItem.parentNodeItem.node.releaseUse();
                var kkkk = $inputNodeTreeInputItem.parentNodeItem.node.getComponentID($inputNodeTreeInputItem.parentNodeItem.id);
                $kfuncstr += kkkk;
                if (i < $node.inputVec.length - 1) {
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
                this.FunDic[$nodeTreeFun.funName] = $nodeTreeFun;
            }
        };
        CompileTwo.prototype.processDynamicNode = function ($node, opCode) {
            var str = "";
            var input0 = $node.inputVec[0];
            var input1 = $node.inputVec[1];
            var type0 = input0.type;
            var type1 = input1.type;
            var pNode0 = input0.parentNodeItem.node;
            var pNode1 = input1.parentNodeItem.node;
            var output = $node.outputVec[0];
            var regtemp = this.getFragmentTemp();
            var resultStr = "";
            //"vec4 ft0 = vec4(0,0,0,0);
            if (!regtemp.hasInit && !(input0.type == materialui.MaterialItemType.VEC4 || input1.type == materialui.MaterialItemType.VEC4)) { //vec4(0,0,0,0)
                resultStr = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END + CompileTwo.LN;
                regtemp.hasInit = true;
            }
            //"vec4 info = infoUv * infoLight;\n" +
            if (input0.type == materialui.MaterialItemType.VEC4 || input1.type == materialui.MaterialItemType.VEC4) {
                //str = opCode +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + COMMA;
                if (!regtemp.hasInit) {
                    resultStr = CompileTwo.VEC4 + CompileTwo.SPACE;
                    regtemp.hasInit = true;
                }
                str = CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            }
            else if (output.type == materialui.MaterialItemType.FLOAT) {
                //str = opCode +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + X + COMMA;
                str = CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            }
            else if (output.type == materialui.MaterialItemType.VEC2) {
                //str = opCode +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + XY + COMMA;
                str = CompileTwo.FT + regtemp.id + CompileTwo.XY + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            }
            else if (output.type == materialui.MaterialItemType.VEC3) {
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
        };
        CompileTwo.prototype.processNode = function ($node) {
            switch ($node.type) {
                case materialui.NodeTree.VEC3:
                case materialui.NodeTree.FLOAT:
                case materialui.NodeTree.VEC2:
                    this.processVec3Node($node);
                    break;
                case materialui.NodeTree.TEX:
                    this.processTexNode($node);
                    break;
                case materialui.NodeTree.TEX3D:
                    this.processTex3DNode($node);
                    break;
                case materialui.NodeTree.TEXCUBE:
                    this.processTexCubeNode($node);
                    break;
                case materialui.NodeTree.FUN:
                    this.processFunNode($node);
                    break;
                case materialui.NodeTree.MUL:
                    this.processDynamicNode($node, "*");
                    break;
                case materialui.NodeTree.ADD:
                    this.processDynamicNode($node, "+");
                    break;
                case materialui.NodeTree.SUB:
                    this.processDynamicNode($node, "-");
                    break;
                case materialui.NodeTree.DIV:
                    this.processDynamicNode($node, "/");
                    break;
                case materialui.NodeTree.OP:
                    this.processOpNode($node);
                    break;
                case materialui.NodeTree.TIME:
                    this.processTimeNode($node);
                    break;
                case materialui.NodeTree.SIN:
                    this.processStaticNode($node, CompileTwo.SIN);
                    break;
                case materialui.NodeTree.COS:
                    this.processStaticNode($node, CompileTwo.COS);
                    break;
                case materialui.NodeTree.NORMAL:
                    this.useNormal = true;
                    break;
                case materialui.NodeTree.PTCOLOR:
                    //  processParticleColor($node);
                    break;
                case materialui.NodeTree.VERCOLOR:
                    //  hasVertexColor = true;
                    break;
                case materialui.NodeTree.HEIGHTINFO:
                    //  processHeightInfo($node);
                    break;
                case materialui.NodeTree.FRESNEL:
                    break;
                case materialui.NodeTree.REFRACTION:
                    // processRefraction($node);
                    break;
                case materialui.NodeTree.PANNER:
                    this.processPanner($node);
                    break;
                case materialui.NodeTree.MIN:
                    //   processMathMinNode($node);
                    break;
            }
        };
        CompileTwo.prototype.processTimeNode = function ($node) {
            var str = "";
            var regtemp = this.getFragmentTemp();
            var pNode = new materialui.NodeTreeFloat;
            pNode.type = materialui.NodeTree.FLOAT;
            pNode.constValue = $node.speed;
            this.processVec3Node(pNode);
            if (!regtemp.hasInit) {
                str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END;
                regtemp.hasInit = true;
                this.strVec.push(str);
            }
            //str =  FT + regtemp.id + X + SPACE + EQU + SPACE + FC + ZERO + W + SPACE +  MUL_MATH + SPACE + pNode.getComponentID(0) + END;
            str = CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + this.timeStr + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + pNode.getComponentID(0) + CompileTwo.END;
            this.strVec.push(str);
            $node.regResultTemp = regtemp;
            this.hasTime = true;
            this.timeSpeed = 0.001;
        };
        CompileTwo.prototype.processStaticNode = function ($node, opCode) {
            var str = "";
            var input = $node.inputVec[0];
            var pNode = input.parentNodeItem.node;
            var regtemp = this.getFragmentTemp();
            if (!regtemp.hasInit) { //vec4(0,0,0,0)
                str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END + CompileTwo.LN;
                regtemp.hasInit = true;
            }
            // ft0.x = sin(ft1.x);
            str += CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + opCode + CompileTwo.LEFT_PARENTH + pNode.getComponentID(input.parentNodeItem.id) + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
            //str += opCode + SPACE + FT + regtemp.id + X + COMMA + pNode.getComponentID(input.parentNodeItem.id);
            input.hasCompiled = true;
            pNode.releaseUse();
            $node.regResultTemp = regtemp;
            $node.shaderStr = str;
            this.strVec.push(str);
        };
        CompileTwo.prototype.processPanner = function ($node) {
            var str = "";
            var input1 = $node.inputVec[0];
            var input2 = $node.inputVec[1];
            var regtemp = this.getFragmentTemp();
            if (!regtemp.hasInit) {
                str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END;
                regtemp.hasInit = true;
                this.strVec.push(str);
            }
            //var regtemp2:RegisterItem = getFragmentTemp();
            // ft0.xy = v0.xy * fc5.xy
            var pNode1;
            if (input1.parentNodeItem) {
                pNode1 = input1.parentNodeItem.node;
                //str += MUL + SPACE + FT + regtemp.id + XY + COMMA + VI + defaultUvReg.id + XY + COMMA + pNode1.getComponentID(input1.parentNodeItem.id) + LN;
                str = CompileTwo.FT + regtemp.id + CompileTwo.XY + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.VI + this.defaultUvReg.id + CompileTwo.XY + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + pNode1.getComponentID(input1.parentNodeItem.id) + CompileTwo.END + CompileTwo.LN;
            }
            else {
                pNode1 = new materialui.NodeTreeVec2;
                pNode1.type = materialui.NodeTree.VEC2;
                pNode1.constValue = $node.coordinateValue;
                this.processVec3Node(pNode1);
                //str += MUL + SPACE + FT + regtemp.id + XY + COMMA + VI + defaultUvReg.id + XY + COMMA + pNode1.getComponentID(0) + LN;
                str = CompileTwo.FT + regtemp.id + CompileTwo.XY + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.VI + this.defaultUvReg.id + CompileTwo.XY + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + pNode1.getComponentID(0) + CompileTwo.END + CompileTwo.LN;
            }
            //str += MOV + SPACE + FT + regtemp.id + Z + COMMA + FC + ZERO + W + LN;
            //ft1.zw = fc5.zw * ft0.z
            var pNode2;
            if (input2.parentNodeItem) {
                pNode2 = input2.parentNodeItem.node;
                //str += FT + regtemp.id + ZW + SPACE + EQU + SPACE + pNode2.getComponentID(input2.parentNodeItem.id) + SPACE + MUL_MATH + SPACE + FC + ZERO + W + END +LN;
                str += CompileTwo.FT + regtemp.id + CompileTwo.ZW + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + pNode2.getComponentID(input2.parentNodeItem.id) + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + this.timeStr + CompileTwo.END + CompileTwo.LN;
            }
            else {
                pNode2 = new materialui.NodeTreeVec2;
                pNode2.type = materialui.NodeTree.VEC2;
                pNode2.constValue = $node.speedValue;
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
        };
        CompileTwo.prototype.preSetNormal = function () {
            for (var i = this.priorityList.length - 1; i >= 0; i--) {
                var treelist = this.priorityList[i];
                for (var j = 0; j < treelist.length; j++) {
                    if (treelist[j].type == materialui.NodeTree.OP) {
                        var inputNormal = treelist[j].inputVec[2];
                        if (inputNormal.parentNodeItem) {
                            this.useNormal = true;
                        }
                        else {
                            this.useNormal = false;
                        }
                        return;
                    }
                }
            }
        };
        CompileTwo.prototype.traceFt = function () {
            return;
        };
        Object.defineProperty(CompileTwo.prototype, "killStr", {
            get: function () {
                return "fc[" + this._killID + "].x";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompileTwo.prototype, "timeStr", {
            get: function () {
                return "fc[" + this._timeID + "].y";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompileTwo.prototype, "fogdataXStr", {
            get: function () {
                return "fc[" + this._fogdataID + "].z";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompileTwo.prototype, "fogdataYStr", {
            get: function () {
                return "fc[" + this._fogdataID + "].w";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompileTwo.prototype, "fogcolorStr", {
            get: function () {
                return "fc[" + this._fogcolorID + "].xyz";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompileTwo.prototype, "camposStr", {
            get: function () {
                return "fc[" + this._camposID + "].xyz";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompileTwo.prototype, "scalelightmapStr", {
            get: function () {
                return "fc[" + this._scalelightmapID + "].x";
            },
            enumerable: true,
            configurable: true
        });
        CompileTwo.prototype.processVec3Node = function ($node) {
            var str = "";
            this.setFragmentConst($node);
            this.addConstItem($node);
        };
        CompileTwo.prototype.addConstItem = function ($node) {
            if ($node.isDynamic) {
                console.log($node.paramName);
            }
            var constItem;
            var id = $node.regResultConst.id;
            for (var i = 0; i < this.constVec.length; i++) {
                if (this.constVec[i].id == id) {
                    constItem = this.constVec[i];
                }
            }
            if (!constItem) {
                constItem = new ConstItem;
                constItem.id = $node.regResultConst.id;
                this.constVec.push(constItem);
            }
            if ($node.type == materialui.NodeTree.VEC3) {
                if ($node.regConstIndex == 0) {
                    var v3d = $node.constVec3;
                    constItem.value.setTo(v3d.x, v3d.y, v3d.z);
                    if ($node.isDynamic) {
                        constItem.paramName0 = $node.paramName;
                        constItem.param0Type = 4;
                        constItem.param0Index = 0;
                    }
                }
            }
            else if ($node.type == materialui.NodeTree.FLOAT) {
                var num = $node.constValue;
                if ($node.regConstIndex == 0) {
                    constItem.value.x = num;
                    if ($node.isDynamic) {
                        constItem.paramName0 = $node.paramName;
                        constItem.param0Type = 1;
                        constItem.param0Index = 0;
                    }
                }
                else if ($node.regConstIndex == 1) {
                    constItem.value.y = num;
                    if ($node.isDynamic) {
                        constItem.paramName1 = $node.paramName;
                        constItem.param1Type = 1;
                        constItem.param1Index = 1;
                    }
                }
                else if ($node.regConstIndex == 2) {
                    constItem.value.z = num;
                    if ($node.isDynamic) {
                        constItem.paramName2 = $node.paramName;
                        constItem.param2Type = 1;
                        constItem.param2Index = 2;
                    }
                }
                else if ($node.regConstIndex == 3) {
                    constItem.value.w = num;
                    if ($node.isDynamic) {
                        constItem.paramName3 = $node.paramName;
                        constItem.param3Type = 1;
                        constItem.param3Index = 3;
                    }
                }
            }
            else if ($node.type == materialui.NodeTree.VEC2) {
                var vec2 = $node.constValue;
                if ($node.regConstIndex == 0) {
                    constItem.value.x = vec2.x;
                    constItem.value.y = vec2.y;
                    if ($node.isDynamic) {
                        constItem.paramName0 = $node.paramName;
                        constItem.param0Type = 2;
                        constItem.param0Index = 0;
                    }
                }
                else if ($node.regConstIndex == 1) {
                    constItem.value.y = vec2.x;
                    constItem.value.z = vec2.y;
                    if ($node.isDynamic) {
                        constItem.paramName1 = $node.paramName;
                        constItem.param1Type = 2;
                        constItem.param1Index = 1;
                    }
                }
                else if ($node.regConstIndex == 2) {
                    constItem.value.z = vec2.x;
                    constItem.value.w = vec2.y;
                    if ($node.isDynamic) {
                        constItem.paramName2 = $node.paramName;
                        constItem.param2Type = 2;
                        constItem.param2Index = 2;
                    }
                }
            }
        };
        CompileTwo.prototype.setFragmentConst = function ($nodeTree) {
            for (var i = this._fcBeginID; i < this.fragmentConstList.length; i++) {
                var tf = this.fragmentConstList[i].getUse($nodeTree);
                if (tf) {
                    break;
                }
            }
        };
        CompileTwo.prototype.processOpNode = function ($node) {
            //diffuse
            this.lightProbe = $node.lightProbe;
            this.directLight = $node.directLight;
            this.noLight = $node.noLight;
            this.fogMode = $node.fogMode;
            this.scaleLightMap = $node.scaleLightMap;
            var str = "";
            var inputDiffuse = $node.inputVec[0];
            var inputNormal = $node.inputVec[1];
            var skyboxInput = $node.inputVec[2];
            this.usePbr = false;
            if (inputNormal.parentNodeItem) {
                this.useNormal = true;
            }
            this.useDynamicIBL = $node.useDynamicIBL;
            var regOp;
            var texItem;
            this.traceFt();
            var hasDiffuse = false;
            if (inputDiffuse.parentNodeItem) { //漫反射部分
                hasDiffuse = true;
                var pNodeDiffuse = inputDiffuse.parentNodeItem.node; //diffuse输入节点
                var regtempLightMap = this.getFragmentTemp();
                var resultStr;
                if (regtempLightMap.hasInit) {
                    resultStr = CompileTwo.FT + regtempLightMap.id;
                }
                else {
                    resultStr = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id;
                    regtempLightMap.hasInit = true;
                }
                if (this.lightProbe) {
                }
                else if (this.directLight) {
                }
                else if (this.noLight) {
                }
                else {
                    var regtexLightMap = this.getFragmentTex();
                    // ve4 ft0 = texture2D(fs0,v1);
                    // ft0.xyz = ft0.xyz * 5.0;
                    str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.texture2D + CompileTwo.LEFT_PARENTH + CompileTwo.FS + regtexLightMap.id + CompileTwo.COMMA + CompileTwo.VI + this.defaultLightUvReg.id + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
                    if (this.scaleLightMap) {
                        str += CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + CompileTwo.scalelight + CompileTwo.END;
                    }
                    else {
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
                regOp = this.getFragmentTemp(); //输出用临时寄存器
                if (!regOp.hasInit) {
                    str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regOp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END;
                    regOp.hasInit = true;
                    this.strVec.push(str);
                }
                if (this.usePbr) {
                }
                else {
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
            var regtempFog;
            str = "";
            //"gl_FragColor = infoUv;\n" +
            str = CompileTwo.FO + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regOp.id + CompileTwo.END;
            this.strVec.push(str);
            this.backCull = $node.backCull;
            this.blendMode = $node.blendMode;
            this.writeZbuffer = $node.writeZbuffer;
            this.normalScale = $node.normalScale;
        };
        CompileTwo.prototype.initBaseFc = function () {
            var dataID = 0;
            var $useKill = false;
            var $hasTime = false;
            var $fogMode = 0;
            var $usePbr = false;
            //var $hasFresnel:Boolean = false;
            var $scaleLightMap = false;
            for (var i = this.priorityList.length - 1; i >= 0; i--) {
                var treelist = this.priorityList[i];
                for (var j = 0; j < treelist.length; j++) {
                    var node = treelist[j];
                    if (node.type == materialui.NodeTree.OP) {
                        var opnode = node;
                        $fogMode = opnode.fogMode;
                        $scaleLightMap = opnode.scaleLightMap;
                    }
                    else if (node.type == materialui.NodeTree.TIME || node.type == materialui.NodeTree.PANNER) {
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
        };
        CompileTwo.SPACE = " ";
        CompileTwo.COMMA = ",";
        CompileTwo.END = ";";
        CompileTwo.FC = "fc";
        CompileTwo.FT = "ft";
        CompileTwo.TEXTURE = "texture";
        CompileTwo.FS = "fs";
        CompileTwo.VI = "v";
        CompileTwo.OP = "op";
        CompileTwo.FO = "gl_FragColor";
        CompileTwo.XYZ = ".xyz";
        CompileTwo.XY = ".xy";
        CompileTwo.X = ".x";
        CompileTwo.Y = ".y";
        CompileTwo.Z = ".z";
        CompileTwo.W = ".w";
        CompileTwo.ZW = ".zw";
        CompileTwo.MOV = "mov";
        //public static ONE:string = "1";
        CompileTwo.ONE_FLOAT = "1.0";
        CompileTwo.ZERO = "[0]";
        CompileTwo.ONE = "[1]";
        CompileTwo.TWO = "[2]";
        CompileTwo.TWO_FLOAT = "2.0";
        CompileTwo.THREE = "3";
        CompileTwo.FOUR = "4";
        CompileTwo.LN = "\n";
        CompileTwo.texType = "<2d,linear,repeat>";
        CompileTwo.TEX_2D = "2d";
        //  public static TEX_CUBE: string = "cube";
        CompileTwo.TEX_LINEAR = "linear";
        CompileTwo.TEX_NEAREST = "nearest";
        CompileTwo.TEX_WRAP_REPEAT = "repeat";
        CompileTwo.TEX_WRAP_CLAMP = "clamp";
        CompileTwo.LEFT_BRACKET = "<";
        CompileTwo.RIGHT_BRACKET = ">";
        CompileTwo.texCubeType = "<cube,clamp,linear,mipnone>";
        CompileTwo.TEX = "tex";
        CompileTwo.ADD = "add";
        CompileTwo.SUB = "sub";
        CompileTwo.MUL = "mul";
        CompileTwo.DIV = "div";
        CompileTwo.ADD_MATH = "+";
        CompileTwo.SUB_MATH = "-";
        CompileTwo.MUL_MATH = "*";
        CompileTwo.MUL_EQU_MATH = "*=";
        CompileTwo.DIV_MATH = "/";
        CompileTwo.RCP = "rcp";
        CompileTwo.MIN = "min";
        CompileTwo.MAX = "max";
        CompileTwo.FRC = "frc";
        CompileTwo.SQT = "sqt";
        CompileTwo.RSQ = "rsq";
        CompileTwo.POW = "pow";
        CompileTwo.LOG = "log";
        CompileTwo.EXP = "exp";
        CompileTwo.NRM = "normalize";
        CompileTwo.SIN = "sin";
        CompileTwo.COS = "cos";
        CompileTwo.CRS = "crs";
        CompileTwo.DP3 = "dp3";
        CompileTwo.DOT = "dot";
        CompileTwo.DP4 = "dp4";
        CompileTwo.ABS = "abs";
        CompileTwo.NEG = "neg";
        CompileTwo.SAT = "sat";
        CompileTwo.LERP = "lerp";
        CompileTwo.KIL = "kil";
        CompileTwo.M33 = "m33";
        CompileTwo.VEC4 = "vec4";
        CompileTwo.VEC3 = "vec3";
        CompileTwo.VEC2 = "vec2";
        CompileTwo.EQU = "=";
        CompileTwo.texture2D = "texture2D";
        CompileTwo.textureCube = "textureCube";
        CompileTwo.LEFT_PARENTH = "(";
        CompileTwo.RIGHT_PARENTH = ")";
        CompileTwo.DEFAULT_VEC4 = "vec4(0,0,0,1)";
        CompileTwo.MIX = "mix";
        CompileTwo.REFLECT = "reflect";
        CompileTwo.IF = "if";
        CompileTwo.DISCARD = "{discard;}";
        CompileTwo.scalelight = "scalelight";
        return CompileTwo;
    }());
    materialui.CompileTwo = CompileTwo;
})(materialui || (materialui = {}));
//# sourceMappingURL=CompileTwo.js.map