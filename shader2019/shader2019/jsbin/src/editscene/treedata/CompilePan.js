var materialui;
(function (materialui) {
    var TexItem = Pan3d.TexItem;
    var MaterialBaseParam = Pan3d.MaterialBaseParam;
    var Scene_data = Pan3d.Scene_data;
    var ConstItem = Pan3d.ConstItem;
    var TextureManager = Pan3d.TextureManager;
    var CompilePan = /** @class */ (function () {
        function CompilePan() {
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
        CompilePan.prototype.initReg = function () {
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
        CompilePan.prototype.compile = function ($priorityList, $materialTree) {
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
            $materialTree.hasFresnel = this.hasFresnel;
            ;
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
            return resultStr;
        };
        CompilePan.prototype.getMaxFc = function () {
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
        CompilePan.prototype.makeFc = function (fcNum) {
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
        CompilePan.prototype.getGLSLStr = function () {
            var mainStr = "";
            for (var i = 0; i < this.strVec.length; i++) {
                mainStr += this.strVec[i] + "\n";
            }
            var perStr = "precision mediump float;\n";
            var hasParticleColor = false;
            var texStr = "";
            for (i = 0; i < this.texVec.length; i++) {
                if (this.texVec[i].type == 3) {
                    texStr += "uniform samplerCube fs" + this.texVec[i].id + ";\n";
                }
                else {
                    texStr += "uniform sampler2D fs" + this.texVec[i].id + ";\n";
                }
                if (this.texVec[i].isParticleColor) {
                    hasParticleColor = true;
                }
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
            if (this.lightProbe || this.directLight) {
                varyStr += "varying vec3 v2;\n";
            }
            else if (this.useLightMap) {
                varyStr += "varying vec2 v2;\n";
            }
            if (this.hasVertexColor) {
                varyStr += "varying vec4 v2;\n";
            }
            if (this.usePbr) {
                varyStr += "varying vec3 v1;\n";
                if (!this.useNormal) {
                    varyStr += "varying vec3 v4;\n";
                }
                else {
                    varyStr += "varying mat3 v4;\n";
                }
            }
            else if (this.fogMode != 0) {
                varyStr += "varying vec3 v1;\n";
            }
            if (this.useNormal) {
                varyStr += "varying vec3 v7;\n";
            }
            if (hasParticleColor) {
                varyStr += "varying vec2 v1;\n";
            }
            var beginStr = "void main(void){\n\n";
            var endStr = "\n}";
            var resultStr = perStr + texStr + constStr + varyStr + beginStr + mainStr + endStr;
            console.log("-------------------!");
            console.log(resultStr);
            console.log("-------------------");
            return resultStr;
        };
        CompilePan.prototype.getFragmentTex = function ($nodeTreeTex) {
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
        CompilePan.prototype.getFragmentTemp = function () {
            for (var i = 0; i < this.fragmentTempList.length; i++) {
                if (!this.fragmentTempList[i].inUse) {
                    this.fragmentTempList[i].inUse = true;
                    return this.fragmentTempList[i];
                }
            }
            return null;
        };
        CompilePan.prototype.processTexNode = function ($node) {
            var str = "";
            var input = $node.inputVec[0];
            var regtex = this.getFragmentTex($node);
            var regtemp = this.getFragmentTemp();
            //"vec4 infoUv = texture2D(s_texture, v_texCoord.xy);\n" +
            var resultStr;
            if (regtemp.hasInit) {
                resultStr = materialui.CompileTwo.FT + regtemp.id;
            }
            else {
                resultStr = materialui.CompileTwo.VEC4 + materialui.CompileTwo.SPACE + materialui.CompileTwo.FT + regtemp.id;
                regtemp.hasInit = true;
            }
            if (input.parentNodeItem) {
                var pNode = input.parentNodeItem.node;
                //str = TEX +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id +CompileTwo. COMMA+ pNode.getComponentID(input.parentNodeItem.id) +CompileTwo. COMMA+ FS + regtex.id +CompileTwo. SPACE + getTexType(NodeTreeTex($node).wrap);
                str = resultStr + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + materialui.CompileTwo.texture2D + materialui.CompileTwo.LEFT_PARENTH + materialui.CompileTwo.FS + regtex.id + materialui.CompileTwo.COMMA + pNode.getComponentID(input.parentNodeItem.id) + materialui.CompileTwo.RIGHT_PARENTH + materialui.CompileTwo.END;
            }
            else {
                //str = TEX +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id +CompileTwo. COMMA+CompileTwo. VI+ defaultUvReg.id +CompileTwo. COMMA+ FS + regtex.id +CompileTwo. SPACE + getTexType(NodeTreeTex($node).wrap);
                str = resultStr + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + materialui.CompileTwo.texture2D + materialui.CompileTwo.LEFT_PARENTH + materialui.CompileTwo.FS + regtex.id + materialui.CompileTwo.COMMA + materialui.CompileTwo.VI + this.defaultUvReg.id + materialui.CompileTwo.RIGHT_PARENTH + materialui.CompileTwo.END;
            }
            if ($node.permul) {
                str += materialui.CompileTwo.LN + materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.XYZ + materialui.CompileTwo.SPACE + materialui.CompileTwo.MUL_EQU_MATH + materialui.CompileTwo.SPACE + materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.W + materialui.CompileTwo.END;
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
        CompilePan.prototype.processDynamicNode = function ($node, opCode) {
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
                resultStr = materialui.CompileTwo.VEC4 + materialui.CompileTwo.SPACE + materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + materialui.CompileTwo.DEFAULT_VEC4 + materialui.CompileTwo.END + materialui.CompileTwo.LN;
                regtemp.hasInit = true;
            }
            //"vec4 info = infoUv * infoLight;\n" +
            if (input0.type == materialui.MaterialItemType.VEC4 || input1.type == materialui.MaterialItemType.VEC4) {
                //str = opCode +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + COMMA;
                if (!regtemp.hasInit) {
                    resultStr = materialui.CompileTwo.VEC4 + materialui.CompileTwo.SPACE;
                    regtemp.hasInit = true;
                }
                str = materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE;
            }
            else if (output.type == materialui.MaterialItemType.FLOAT) {
                //str = opCode +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + X + COMMA;
                str = materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.X + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE;
            }
            else if (output.type == materialui.MaterialItemType.VEC2) {
                //str = opCode +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + XY + COMMA;
                str = materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.XY + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE;
            }
            else if (output.type == materialui.MaterialItemType.VEC3) {
                //str = opCode +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id +CompileTwo.XYZ+ COMMA;
                str = materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.XYZ + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE;
            }
            str += pNode0.getComponentID(input0.parentNodeItem.id);
            str += materialui.CompileTwo.SPACE + opCode + materialui.CompileTwo.SPACE;
            str += pNode1.getComponentID(input1.parentNodeItem.id);
            str = resultStr + str + materialui.CompileTwo.END;
            input0.hasCompiled = true;
            input1.hasCompiled = true;
            pNode0.releaseUse();
            pNode1.releaseUse();
            $node.regResultTemp = regtemp;
            $node.shaderStr = str;
            this.strVec.push(str);
        };
        CompilePan.prototype.processNode = function ($node) {
            switch ($node.type) {
                case materialui.NodeTree.VEC3:
                case materialui.NodeTree.FLOAT:
                case materialui.NodeTree.VEC2:
                    this.processVec3Node($node);
                    break;
                case materialui.NodeTree.TEX:
                    this.processTexNode($node);
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
                    //   processTimeNode($node);
                    break;
                case materialui.NodeTree.SIN:
                    //   processStaticNode($node, SIN);
                    break;
                case materialui.NodeTree.LERP:
                    //  processLerpNode($node);
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
                    this.processFresnel($node);
                    break;
                case materialui.NodeTree.REFRACTION:
                    // processRefraction($node);
                    break;
                case materialui.NodeTree.PANNER:
                    // processPanner($node);
                    break;
                case materialui.NodeTree.MIN:
                    //   processMathMinNode($node);
                    break;
            }
        };
        CompilePan.prototype.preSetNormal = function () {
            for (var i = this.priorityList.length - 1; i >= 0; i--) {
                var treelist = this.priorityList[i];
                for (var j = 0; j < treelist.length; j++) {
                    if (treelist[j].type == materialui.NodeTree.OP) {
                        var inputMetallic = treelist[j].inputVec[1];
                        var inputSpecular = treelist[j].inputVec[2];
                        var inputRoughness = treelist[j].inputVec[3];
                        var inputNormal = treelist[j].inputVec[4];
                        if (inputMetallic.parentNodeItem || inputSpecular.parentNodeItem || inputRoughness.parentNodeItem) {
                            this.usePbr = true;
                        }
                        else {
                            this.usePbr = false;
                        }
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
        CompilePan.prototype.processFresnel = function ($node) {
            this.preSetNormal();
            var str = "";
            //var input0:NodeTreeInputItem = $node.inputVec[0];
            var input1 = $node.inputVec[0];
            var input2 = $node.inputVec[1];
            //var pNode0:NodeTree = input0.parentNodeItem.node;
            var pNode1 = input1.parentNodeItem.node;
            var pNode2 = input2.parentNodeItem.node;
            //			var output:NodeTreeOutoutItem = $node.outputVec[0];
            var regtemp = this.getFragmentTemp();
            if (!regtemp.hasInit) {
                str = materialui.CompileTwo.VEC4 + materialui.CompileTwo.SPACE + materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + materialui.CompileTwo.DEFAULT_VEC4 + materialui.CompileTwo.END;
                regtemp.hasInit = true;
                this.strVec.push(str);
            }
            var normalID;
            if (this.usePbr) {
                if (this.useNormal) {
                    normalID = 7;
                }
                else {
                    normalID = this.defaultTangent.id;
                }
            }
            else {
                normalID = this.defaultTangent.id;
            }
            //sub ft0.xyz,fc2.xyz,v1.xyz
            //normalize ft0.xyz,ft0.xyz
            //dp3 ft0.x,ft0.xyz,v4.xyz
            //str =CompileTwo. FT+ regtemp.id +CompileTwo.XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + FC + ONE +CompileTwo.XYZ+CompileTwo. SPACE +CompileTwo.SUB_MATH+CompileTwo. SPACE + VI + defaultPtReg.id +CompileTwo.XYZ+ END + LN;
            str = materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.XYZ + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + this.camposStr + materialui.CompileTwo.SPACE + materialui.CompileTwo.SUB_MATH + materialui.CompileTwo.SPACE + materialui.CompileTwo.VI + this.defaultPtReg.id + materialui.CompileTwo.XYZ + materialui.CompileTwo.END + materialui.CompileTwo.LN;
            str += materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.XYZ + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + materialui.CompileTwo.NRM + materialui.CompileTwo.LEFT_PARENTH + materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.XYZ + materialui.CompileTwo.RIGHT_PARENTH + materialui.CompileTwo.END + materialui.CompileTwo.LN;
            str += materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.X + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + materialui.CompileTwo.DOT + materialui.CompileTwo.LEFT_PARENTH + materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.XYZ + materialui.CompileTwo.COMMA + materialui.CompileTwo.VI + normalID + materialui.CompileTwo.XYZ + materialui.CompileTwo.RIGHT_PARENTH + materialui.CompileTwo.END + materialui.CompileTwo.LN;
            //sub ft0.x,fc0.x,ft0.x
            //add ft0.x,ft0.x,fc5.y
            //sat ft0.x,ft0.x
            //mul ft0.x,ft0.x,fc5.x
            //			str += SUB +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + X + COMMA + FC + ZERO + X + COMMA +CompileTwo. FT+ regtemp.id + X + LN;
            //			str += ADD +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + X + COMMA +CompileTwo. FT+ regtemp.id + X + COMMA + pNode2.getComponentID(input2.parentNodeItem.id) + LN;
            //			str += SAT +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + X + COMMA +CompileTwo. FT+ regtemp.id + X + LN;
            //			str += MUL +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + X + COMMA +CompileTwo. FT+ regtemp.id + X + COMMA + pNode1.getComponentID(input1.parentNodeItem.id);
            str += materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.X + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + "1.0" + materialui.CompileTwo.SPACE + materialui.CompileTwo.SUB_MATH + materialui.CompileTwo.SPACE + materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.X + materialui.CompileTwo.SPACE + materialui.CompileTwo.ADD_MATH + materialui.CompileTwo.SPACE + pNode2.getComponentID(input2.parentNodeItem.id) + materialui.CompileTwo.END + materialui.CompileTwo.LN;
            str += materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.X + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + materialui.CompileTwo.TEX_WRAP_CLAMP + materialui.CompileTwo.LEFT_PARENTH + materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.X + materialui.CompileTwo.COMMA + "0.0" + materialui.CompileTwo.COMMA + "1.0" + materialui.CompileTwo.RIGHT_PARENTH + materialui.CompileTwo.END + materialui.CompileTwo.LN;
            str += materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.X + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + materialui.CompileTwo.FT + regtemp.id + materialui.CompileTwo.X + materialui.CompileTwo.SPACE + materialui.CompileTwo.MUL_MATH + materialui.CompileTwo.SPACE + pNode1.getComponentID(input1.parentNodeItem.id) + materialui.CompileTwo.END;
            input2.hasCompiled = true;
            input1.hasCompiled = true;
            pNode2.releaseUse();
            pNode1.releaseUse();
            $node.regResultTemp = regtemp;
            $node.shaderStr = str;
            this.strVec.push(str);
            this.hasFresnel = true;
        };
        CompilePan.prototype.traceFt = function () {
            return;
        };
        Object.defineProperty(CompilePan.prototype, "killStr", {
            get: function () {
                return "fc[" + this._killID + "].x";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompilePan.prototype, "timeStr", {
            get: function () {
                return "fc[" + this._timeID + "].y";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompilePan.prototype, "fogdataXStr", {
            get: function () {
                return "fc[" + this._fogdataID + "].z";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompilePan.prototype, "fogdataYStr", {
            get: function () {
                return "fc[" + this._fogdataID + "].w";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompilePan.prototype, "fogcolorStr", {
            get: function () {
                return "fc[" + this._fogcolorID + "].xyz";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompilePan.prototype, "camposStr", {
            get: function () {
                return "fc[" + this._camposID + "].xyz";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompilePan.prototype, "scalelightmapStr", {
            get: function () {
                return "fc[" + this._scalelightmapID + "].x";
            },
            enumerable: true,
            configurable: true
        });
        CompilePan.prototype.processVec3Node = function ($node) {
            var str = "";
            this.setFragmentConst($node);
            this.addConstItem($node);
        };
        CompilePan.prototype.addConstItem = function ($node) {
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
        CompilePan.prototype.setFragmentConst = function ($nodeTree) {
            for (var i = this._fcBeginID; i < this.fragmentConstList.length; i++) {
                var tf = this.fragmentConstList[i].getUse($nodeTree);
                if (tf) {
                    break;
                }
            }
        };
        CompilePan.prototype.processOpNode = function ($node) {
            //diffuse
            this.lightProbe = $node.lightProbe;
            this.directLight = $node.directLight;
            this.noLight = $node.noLight;
            this.fogMode = $node.fogMode;
            this.scaleLightMap = $node.scaleLightMap;
            var str = "";
            var inputDiffuse = $node.inputVec[0];
            var inputNormal = $node.inputVec[2];
            if (inputNormal.parentNodeItem) {
                this.useNormal = true;
            }
            else {
                this.useNormal = false;
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
                    resultStr = materialui.CompileTwo.FT + regtempLightMap.id;
                }
                else {
                    resultStr = materialui.CompileTwo.VEC4 + materialui.CompileTwo.SPACE + materialui.CompileTwo.FT + regtempLightMap.id;
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
                    str = resultStr + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + materialui.CompileTwo.texture2D + materialui.CompileTwo.LEFT_PARENTH + materialui.CompileTwo.FS + regtexLightMap.id + materialui.CompileTwo.COMMA + materialui.CompileTwo.VI + this.defaultLightUvReg.id + materialui.CompileTwo.RIGHT_PARENTH + materialui.CompileTwo.END + materialui.CompileTwo.LN;
                    if (this.scaleLightMap) {
                        str += materialui.CompileTwo.FT + regtempLightMap.id + materialui.CompileTwo.XYZ + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + materialui.CompileTwo.FT + regtempLightMap.id + materialui.CompileTwo.XYZ + materialui.CompileTwo.SPACE + materialui.CompileTwo.MUL_MATH + materialui.CompileTwo.SPACE + materialui.CompileTwo.scalelight + materialui.CompileTwo.END;
                    }
                    else {
                        str += materialui.CompileTwo.FT + regtempLightMap.id + materialui.CompileTwo.XYZ + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + materialui.CompileTwo.FT + regtempLightMap.id + materialui.CompileTwo.XYZ + materialui.CompileTwo.SPACE + materialui.CompileTwo.MUL_MATH + materialui.CompileTwo.SPACE + "2.0" + materialui.CompileTwo.END;
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
                    str = resultStr + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + materialui.CompileTwo.VEC4 + materialui.CompileTwo.LEFT_PARENTH + pNodeDiffuse.getComponentID(inputDiffuse.parentNodeItem.id) + materialui.CompileTwo.COMMA + "1.0" + materialui.CompileTwo.RIGHT_PARENTH + materialui.CompileTwo.END;
                }
                else {
                }
                this.strVec.push(str);
                pNodeDiffuse.releaseUse();
                regOp = this.getFragmentTemp(); //输出用临时寄存器
                if (!regOp.hasInit) {
                    str = materialui.CompileTwo.VEC4 + materialui.CompileTwo.SPACE + materialui.CompileTwo.FT + regOp.id + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + materialui.CompileTwo.DEFAULT_VEC4 + materialui.CompileTwo.END;
                    regOp.hasInit = true;
                    this.strVec.push(str);
                }
                if (this.usePbr) {
                }
                else {
                    //ft2.xyz = ft0.xyz * ft1.xyz
                    //str =  MUL +CompileTwo. SPACE +CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+ pNodeDiffuse.getComponentID(inputDiffuse.parentNodeItem.id) +CompileTwo. COMMA+CompileTwo. FT+ regtempLightMap.id + XYZ;
                    //str =CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. MUL_MATH+CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+ END;
                    //str =  MOV +CompileTwo. SPACE +CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempLightMap.id + XYZ;
                    str = materialui.CompileTwo.FT + regOp.id + materialui.CompileTwo.XYZ + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + materialui.CompileTwo.FT + regtempLightMap.id + materialui.CompileTwo.XYZ + materialui.CompileTwo.END;
                }
                inputDiffuse.hasCompiled = true;
                //pNodeDiffuse.releaseUse();
                this.strVec.push(str);
                regtempLightMap.inUse = false;
            }
            //alpha
            str = "";
            var inputAlpha = $node.inputVec[7];
            if (!inputAlpha.parentNodeItem) {
                //str = MOV +CompileTwo. SPACE +CompileTwo. FT+ regOp.id + W +CompileTwo. COMMA+ FC + ZERO + X;
                //op.w = 1
                str = materialui.CompileTwo.FT + regOp.id + materialui.CompileTwo.W + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + materialui.CompileTwo.ONE_FLOAT + materialui.CompileTwo.END;
            }
            else {
            }
            this.strVec.push(str);
            //kill
            str = "";
            var regtempFog;
            str = "";
            //"gl_FragColor = infoUv;\n" +
            str = materialui.CompileTwo.FO + materialui.CompileTwo.SPACE + materialui.CompileTwo.EQU + materialui.CompileTwo.SPACE + materialui.CompileTwo.FT + regOp.id + materialui.CompileTwo.END;
            this.strVec.push(str);
            this.backCull = $node.backCull;
            this.blendMode = $node.blendMode;
            this.writeZbuffer = $node.writeZbuffer;
            this.normalScale = $node.normalScale;
        };
        CompilePan.prototype.initBaseFc = function () {
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
        return CompilePan;
    }());
    materialui.CompilePan = CompilePan;
})(materialui || (materialui = {}));
//# sourceMappingURL=CompilePan.js.map