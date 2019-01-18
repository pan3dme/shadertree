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
    var UIRenderOnlyPicComponent = Pan3d.UIRenderOnlyPicComponent;
    var UIRenderComponent = Pan3d.UIRenderComponent;
    var UIAtlas = Pan3d.UIAtlas;
    var InteractiveEvent = Pan3d.InteractiveEvent;
    var Scene_data = Pan3d.Scene_data;
    var UIManager = Pan3d.UIManager;
    var ModuleEventManager = Pan3d.ModuleEventManager;
    var ByteArray = Pan3d.Pan3dByteArray;
    var Shader3D = Pan3d.Shader3D;
    var ProgrmaManager = Pan3d.ProgrmaManager;
    var BaseDiplay3dSprite = Pan3d.BaseDiplay3dSprite;
    var BloomUiShader = /** @class */ (function (_super) {
        __extends(BloomUiShader, _super);
        function BloomUiShader() {
            return _super.call(this) || this;
        }
        BloomUiShader.prototype.binLocation = function ($context) {
            $context.bindAttribLocation(this.program, 0, "v3Pos");
            $context.bindAttribLocation(this.program, 1, "v2uv");
        };
        BloomUiShader.prototype.getVertexShaderString = function () {
            var $str = "attribute vec3 v3Pos;" +
                "attribute vec3 v2uv;" +
                "uniform vec4 ui[50];" +
                "uniform vec4 ui2[50];" +
                "varying vec2 v_texCoord;" +
                "void main(void)" +
                "{" +
                "   vec4 data = ui2[int(v2uv.z)];" +
                "   v_texCoord = vec2(v2uv.x * data.x + data.z, v2uv.y * data.y + data.w);" +
                "   data = ui[int(v2uv.z)];" +
                "   vec3 pos = vec3(0.0,0.0,0.0);" +
                "   pos.xy = v3Pos.xy * data.zw * 2.0;" +
                "   pos.x += data.x * 2.0 - 1.0;" +
                "   pos.y += -data.y * 2.0 + 1.0;" +
                "   vec4 vt0= vec4(pos, 1.0);" +
                "   gl_Position = vt0;" +
                "}";
            return $str;
        };
        BloomUiShader.prototype.getFragmentShaderString = function () {
            var $str = " precision mediump float;\n" +
                "uniform sampler2D s_texture;\n" +
                "varying vec2 v_texCoord;\n" +
                "uniform vec3 uScale;\n" +
                "uniform vec3 uBias;\n" +
                "vec3 ii(vec3 c){vec3 ij=sqrt(c);\n" +
                "return(ij-ij*c)+c*(0.4672*c+vec3(0.5328));\n" +
                "}void main(void){\n" +
                "vec4 ik=texture2D(s_texture,v_texCoord);\n" +
                "vec3 c=ik.xyz;\n" +
                "c=c*uScale+uBias;\n" +
                "gl_FragColor.xyz=ii(c);\n" +
                "gl_FragColor=vec4(ik.x,ik.y,ik.z,1.0);\n" +
                "}";
            return $str;
        };
        BloomUiShader.BloomUiShader = "BloomUiShader";
        return BloomUiShader;
    }(Shader3D));
    left.BloomUiShader = BloomUiShader;
    var UishaderSprite = /** @class */ (function (_super) {
        __extends(UishaderSprite, _super);
        function UishaderSprite() {
            return _super.call(this) || this;
        }
        UishaderSprite.prototype.initModeStr = function ($vec, $index) {
            this.objData = new ObjData;
            this.objData.vertices = new Array();
            this.objData.indexs = new Array();
            this.objData.uvs = new Array();
            this.objData.tangents = new Array();
            this.objData.bitangents = new Array();
            this.objData.normals = new Array();
            for (var i = 0; i < $index.length; i++) {
                var $fcnum = 11;
                var $ind = $index[i];
                var a1 = $vec[$fcnum * $ind + 0] * 1;
                var a2 = $vec[$fcnum * $ind + 1] * 1;
                var a3 = $vec[$fcnum * $ind + 2] * 1;
                var u1 = $vec[$fcnum * $ind + 3];
                var u2 = $vec[$fcnum * $ind + 4];
                var T1 = $vec[$fcnum * $ind + 5];
                var T2 = $vec[$fcnum * $ind + 6];
                var B1 = $vec[$fcnum * $ind + 7];
                var B2 = $vec[$fcnum * $ind + 8];
                var N1 = $vec[$fcnum * $ind + 9];
                var N2 = $vec[$fcnum * $ind + 10];
                this.objData.vertices.push(a1, a2, a3);
                this.objData.uvs.push(u1, u2);
                this.pushTBN(this.objData.tangents, T1, T2);
                this.pushTBN(this.objData.bitangents, B1, B2);
                this.pushTBN(this.objData.normals, N1, N2);
            }
            for (var i = 0; i < $index.length; i++) {
                this.objData.indexs.push(i);
            }
            this.upToGpu();
            var dd = left.ModelShowModel.getInstance().selectShowDisp;
            dd.objData = this.objData;
        };
        UishaderSprite.prototype.pushTBN = function ($arr, $a, $b) {
            /*
            "bool ie = (id.y > (32767.1 / 65535.0)); \n" +
            "id.y=ie?(id.y-(32768.0/65535.0)):id.y;\n" +
                "vec3 r;\n" +
                "r.xy=(2.0*65535.0/32767.0)*id-vec2(1.0);\n" +
                "r.z=sqrt(clamp(1.0-dot(r.xy,r.xy),0.0,1.0));\n" +
                "r.z=ie?-r.z:r.z;\n" +
                */
            var id = new Vector2D($a / 65535, $b / 65535);
            var ie = id.y > (32767.1 / 65535.0);
            id.y = ie ? (id.y - (32768.0 / 65535.0)) : id.y;
            var r = new Vector3D();
            r.x = (2.0 * 65535.0 / 32767.0) * id.x - 1.0;
            r.y = (2.0 * 65535.0 / 32767.0) * id.y - 1.0;
            r.z = 1.0 - (r.x * r.x + r.y * r.y);
            r.z = Math.min(Math.max(r.z, 0), 1);
            r.z = Math.sqrt(r.z);
            r.z = ie ? -r.z : r.z;
            $arr.push(r.x, r.y, r.z);
        };
        UishaderSprite.prototype.upToGpu = function () {
            if (this.objData.indexs.length) {
                this.objData.treNum = this.objData.indexs.length;
                this.objData.vertexBuffer = Scene_data.context3D.uploadBuff3D(this.objData.vertices);
                this.objData.uvBuffer = Scene_data.context3D.uploadBuff3D(this.objData.uvs);
                this.objData.tangentBuffer = Scene_data.context3D.uploadBuff3D(this.objData.tangents);
                this.objData.bitangentBuffer = Scene_data.context3D.uploadBuff3D(this.objData.bitangents);
                this.objData.normalsBuffer = Scene_data.context3D.uploadBuff3D(this.objData.normals);
                this.objData.indexBuffer = Scene_data.context3D.uploadIndexBuff3D(this.objData.indexs);
            }
        };
        return UishaderSprite;
    }(BaseDiplay3dSprite));
    var modelShowRender = /** @class */ (function (_super) {
        __extends(modelShowRender, _super);
        function modelShowRender() {
            return _super.call(this) || this;
        }
        modelShowRender.prototype.initData = function () {
            this._uiList = new Array;
            this.objData = new ObjData();
            ProgrmaManager.getInstance().registe(BloomUiShader.BloomUiShader, new BloomUiShader);
            this.shader = ProgrmaManager.getInstance().getProgram(BloomUiShader.BloomUiShader);
            this.program = this.shader.program;
            this.uiProLocation = Scene_data.context3D.getLocation(this.program, "ui");
            this.ui2ProLocation = Scene_data.context3D.getLocation(this.program, "ui2");
        };
        modelShowRender.prototype.makeRenderDataVc = function ($vcId) {
            _super.prototype.makeRenderDataVc.call(this, $vcId);
            for (var i = 0; i < this.renderData2.length / 4; i++) {
                this.renderData2[i * 4 + 0] = 1;
                this.renderData2[i * 4 + 1] = -1;
                this.renderData2[i * 4 + 2] = 0;
                this.renderData2[i * 4 + 3] = 0;
            }
        };
        modelShowRender.prototype.update = function () {
            if (!this.visible || this._uiList.length == 0) {
                if (this.modelRenderList && this.modelRenderList.length) {
                }
                else {
                    return;
                }
            }
            Scene_data.context3D.setBlendParticleFactors(this.blenderMode);
            Scene_data.context3D.setProgram(this.program);
            this.setVc();
            Scene_data.context3D.setVa(0, 3, this.objData.vertexBuffer);
            Scene_data.context3D.setVa(1, 3, this.objData.uvBuffer);
            this.setTextureToGpu();
            Scene_data.context3D.setVc3fv(this.shader, "uScale", [3.51284, 3.51284, 3.51284]);
            Scene_data.context3D.setVc3fv(this.shader, "uScale", [1, 1, 1]);
            Scene_data.context3D.setVc3fv(this.shader, "uBias", [0, 0, 0]);
            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
            if (this.modelRenderList) {
                for (var i = 0; i < this.modelRenderList.length; i++) {
                    this.modelRenderList[i].update();
                }
            }
        };
        return modelShowRender;
    }(UIRenderOnlyPicComponent));
    left.modelShowRender = modelShowRender;
    var LeftPanel = /** @class */ (function (_super) {
        __extends(LeftPanel, _super);
        function LeftPanel() {
            var _this = _super.call(this) || this;
            _this.left = 0;
            _this.top = 0;
            _this.width = 300;
            _this._bottomRender = new UIRenderComponent;
            _this.addRender(_this._bottomRender);
            _this._midRender = new UIRenderComponent;
            _this.addRender(_this._midRender);
            _this._topRender = new UIRenderComponent;
            _this.addRender(_this._topRender);
            _this.modelPic = new modelShowRender();
            _this.addRender(_this.modelPic);
            _this.layer = 101;
            _this._topRender.uiAtlas = new UIAtlas();
            _this._topRender.uiAtlas.setInfo("pan/marmoset/uilist/left/left.txt", "pan/marmoset/uilist/left/left.png", function () { _this.loadConfigCom(); });
            return _this;
        }
        LeftPanel.prototype.initView = function () {
            var $ui = this.addChild(this.modelPic.getComponent("a_model_show"));
            this.modelPic.setImgUrl("pan/marmoset/uilist/1024.jpg");
            $ui.top = 10;
            $ui.left = 10;
            left.ModelShowModel.getInstance()._bigPic = this.modelPic;
            $ui.name = "modelPic";
            $ui.addEventListener(InteractiveEvent.Down, this.addStageMoveEvets, this);
            this.showModelPic = $ui;
        };
        LeftPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this.height = Scene_data.stageHeight;
            if (this.a_panel_bg) {
                this.a_panel_bg.width = this.width;
                this.a_panel_bg.height = this.height;
                this.a_left_line.x = this.width - 10;
                this.a_left_line.y = 0;
                this.a_left_line.height = this.height;
                this.showModelPic.width = this.width - 20;
                this.showModelPic.height = this.width - 20;
                this.a_compile_but.y = this.showModelPic.height + 20;
                this.a_input_dae.y = this.a_compile_but.y;
            }
        };
        LeftPanel.prototype.a_left_lineDown = function ($e) {
            this.a_left_line.data = new Vector2D($e.x, $e.y);
            this.lastWidth = this.width;
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.a_left_lineUp, this);
        };
        LeftPanel.prototype.a_left_lineUp = function ($e) {
            this.a_left_line.data = null;
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.a_left_lineUp, this);
        };
        LeftPanel.prototype.onMoveLine = function ($e) {
            var $select = UIManager.getInstance().getObjectsUnderPoint(new Vector2D($e.x, $e.y));
            if ($select == this.a_left_line) {
                Scene_data.canvas3D.style.cursor = "e-resize";
            }
            else {
                Scene_data.canvas3D.style.cursor = "auto";
            }
            if (this.a_left_line.data) {
                var $lastV2d = this.a_left_line.data;
                var Tx = ($e.x - $lastV2d.x);
                var $lastW = this.width;
                this.width = this.lastWidth + Tx;
                this.resize();
                prop.PropModel.getInstance().moveTop(this.width + 60);
                var $materialEvent = new materialui.MaterialEvent(materialui.MaterialEvent.SCENE_UI_TRUE_MOVE);
                $materialEvent.v2d = new Vector2D((this.width - $lastW) / materialui.MtlUiData.Scale, 0);
                ModuleEventManager.dispatchEvent($materialEvent);
            }
        };
        LeftPanel.prototype.addStageMoveEvets = function ($e) {
            this.lastCameRotation = new Vector2D(Scene_data.focus3D.rotationX, Scene_data.focus3D.rotationY);
            this.mouseXY = new Vector2D($e.x, $e.y);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onUp, this);
        };
        LeftPanel.prototype.onMove = function ($e) {
            var $n = new Vector2D($e.x - this.mouseXY.x, $e.y - this.mouseXY.y);
            Scene_data.focus3D.rotationX = this.lastCameRotation.x - $n.y;
            Scene_data.focus3D.rotationY = this.lastCameRotation.y - $n.x;
        };
        LeftPanel.prototype.onUp = function ($e) {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onUp, this);
        };
        LeftPanel.prototype.loadConfigCom = function () {
            this._bottomRender.uiAtlas = this._topRender.uiAtlas;
            this._midRender.uiAtlas = this._topRender.uiAtlas;
            this.modelPic.uiAtlas = this._topRender.uiAtlas;
            this.a_input_dae = this.addEvntBut("a_input_dae", this._topRender);
            this.a_compile_but = this.addEvntBut("a_compile_but", this._topRender);
            this.a_panel_bg = this.addChild(this._bottomRender.getComponent("a_panel_bg"));
            this.a_panel_bg.left = 0;
            this.a_panel_bg.top = 0;
            this.a_left_line = this.addChild(this._topRender.getComponent("a_left_line"));
            this.a_left_line.addEventListener(InteractiveEvent.Down, this.a_left_lineDown, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMoveLine, this);
            this.initView();
            this.resize();
            prop.PropModel.getInstance().moveTop(this.width + 60);
            var $materialEvent = new materialui.MaterialEvent(materialui.MaterialEvent.SCENE_UI_TRUE_MOVE);
            $materialEvent.v2d = new Vector2D(0, 0);
            ModuleEventManager.dispatchEvent($materialEvent);
        };
        LeftPanel.prototype.butClik = function (evt) {
            switch (evt.target) {
                case this.a_compile_but:
                    ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
                    break;
                case this.a_input_dae:
                    console.log("inputdae");
                    this.selectInputDae(evt);
                    //ModelShowModel.getInstance().changeWebModel();
                    break;
                default:
                    break;
            }
        };
        LeftPanel.prototype.selectInputDae = function (evt) {
            var _this = this;
            this._inputHtmlSprite = document.createElement('input');
            this._inputHtmlSprite.setAttribute('id', '_ef');
            this._inputHtmlSprite.setAttribute('type', 'file');
            this._inputHtmlSprite.setAttribute("style", 'visibility:hidden');
            this._inputHtmlSprite.click();
            this._inputHtmlSprite.value;
            this._inputHtmlSprite.addEventListener("change", function (cevt) { _this.changeFile(cevt); });
        };
        LeftPanel.prototype.readFeijiModel = function ($file) {
            var _this = this;
            console.log("临时对象", $file.name);
            this.uishaderSprite = new UishaderSprite;
            var $reader = new FileReader();
            $reader.readAsText($file);
            $reader.onload = function ($temp) {
                var $dd = $reader.result.split("|");
                _this.uishaderSprite.initModeStr(_this.getArrByStr($dd[0]), _this.getArrByStr($dd[1]));
            };
        };
        LeftPanel.prototype.getArrByStr = function ($dtstr) {
            var configText = $dtstr.split(",");
            var $dataArr = new Array();
            for (var i = 0; i < configText.length; i++) {
                $dataArr.push(Number(configText[i]));
            }
            return $dataArr;
        };
        LeftPanel.prototype.changeFile = function (evt) {
            var _this = this;
            for (var i = 0; i < this._inputHtmlSprite.files.length && i < 1; i++) {
                var simpleFile = this._inputHtmlSprite.files[i];
                if (!/image\/\w+/.test(simpleFile.type)) {
                    var $reader = new FileReader();
                    if (simpleFile.name.indexOf(".md5mesh") != -1) {
                        $reader.readAsText(simpleFile);
                        $reader.onload = function ($temp) {
                            left.ModelShowModel.getInstance().webmd5Sprite.addLocalMeshByStr($reader.result);
                        };
                        return;
                    }
                    if (simpleFile.name.indexOf(".md5anim") != -1) {
                        $reader.readAsText(simpleFile);
                        $reader.onload = function ($temp) {
                            left.ModelShowModel.getInstance().webmd5Sprite.addLocalAdimByStr($reader.result);
                        };
                        return;
                    }
                    if (simpleFile.name.indexOf("objs.txt") != -1) {
                        $reader.readAsText(simpleFile);
                        $reader.onload = function ($temp) {
                            left.ModelShowModel.getInstance().readTxtToModelBy($reader.result);
                        };
                    }
                    else {
                        // alert("objs.txt结尾对象0" + simpleFile.name);
                        $reader.readAsArrayBuffer(simpleFile);
                        $reader.onload = function ($temp) {
                            if (_this.isRoleFile($reader.result)) {
                                console.log("是角色", simpleFile.name);
                                filemodel.RoleChangeModel.getInstance().loadLocalFile($reader.result);
                                left.SceneRenderToTextrue.getInstance().viweLHnumber = 1000;
                            }
                            else {
                                alert("不确定类型");
                            }
                        };
                    }
                }
                else {
                    alert("请确保文件类型为图像类型");
                }
            }
            this._inputHtmlSprite = null;
        };
        /*
        private selectFileForRole(value: File, arrayBuffer: ArrayBuffer): void {
            var $roleRes: RoleRes = new RoleRes()
            $roleRes.load("nofilenonono.txt", () => {
                this.makeMeshData($roleRes)
                left.ModelShowModel.getInstance().changeRoleUrl($roleRes.roleUrl)
            })
            $roleRes.loadComplete(arrayBuffer);
 
        }
 
        private makeMeshData($roleRes: RoleRes): void {
            //比较差的方法存放并修改模型文件
            var $mesh: SkinMesh = MeshDataManager.getInstance().getMeshDataByLocalUrl($roleRes.roleUrl);
            var url: string = $roleRes.roleUrl;
          //  $mesh.loadMaterial();
            $mesh.setAction($roleRes.actionAry, url);
            $mesh.url = url;
            if ($roleRes.ambientLightColor) {
                $mesh.lightData = [[$roleRes.ambientLightColor.x, $roleRes.ambientLightColor.y, $roleRes.ambientLightColor.z],
                [$roleRes.nrmDircet.x, $roleRes.nrmDircet.y, $roleRes.nrmDircet.z],
                [$roleRes.sunLigthColor.x, $roleRes.sunLigthColor.y, $roleRes.sunLigthColor.z]];
            }
            $mesh.ready = true;
        }
        */
        LeftPanel.prototype.isRoleFile = function (arrayBuffer) {
            var $byte = new ByteArray(arrayBuffer);
            $byte.position = 0;
            var $version = $byte.readInt();
            var $url = $byte.readUTF();
            if ($url.indexOf("role/") != -1) {
                return true;
            }
            else {
                return false;
            }
        };
        LeftPanel.prototype.readVecFloat = function ($byte) {
            var $arr = new Array();
            var $len = $byte.readInt();
            for (var i = 0; i < $len; i++) {
                $arr.push($byte.readFloat());
            }
            return $arr;
        };
        LeftPanel.prototype.readVecInt = function ($byte) {
            var $arr = new Array();
            var $len = $byte.readInt();
            for (var i = 0; i < $len; i++) {
                $arr.push($byte.readInt());
            }
            return $arr;
        };
        return LeftPanel;
    }(UIPanel));
    left.LeftPanel = LeftPanel;
})(left || (left = {}));
//# sourceMappingURL=LeftPanel.js.map