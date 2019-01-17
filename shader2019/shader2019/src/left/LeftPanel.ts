module left {
    import UIRenderOnlyPicComponent = Pan3d.UIRenderOnlyPicComponent
    import UIRenderComponent = Pan3d.UIRenderComponent
    import UIAtlas = Pan3d.UIAtlas
    import UICompenent = Pan3d.UICompenent
    import InteractiveEvent = Pan3d.InteractiveEvent
    import Scene_data = Pan3d.Scene_data
    import UIManager = Pan3d.UIManager
    import ModuleEventManager = Pan3d.ModuleEventManager
    import ByteArray = Pan3d.Pan3dByteArray
    import SkinMesh = Pan3d.SkinMesh
    import RoleRes = Pan3d.RoleRes
    import MeshDataManager = Pan3d.MeshDataManager
    import ResManager = Pan3d.ResManager
    import Shader3D = Pan3d.Shader3D
    import ProgrmaManager = Pan3d.ProgrmaManager
    import BaseDiplay3dSprite = Pan3d.BaseDiplay3dSprite


    export class BloomUiShader extends Shader3D {
        static BloomUiShader: string = "BloomUiShader";
        constructor() {
            super();
    
        }
        binLocation($context: WebGLRenderingContext): void {
            $context.bindAttribLocation(this.program, 0, "v3Pos");
            $context.bindAttribLocation(this.program, 1, "v2uv");
        }
        getVertexShaderString(): string {
            var $str: string =
                "attribute vec3 v3Pos;" +
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
                "}"
            return $str


        }
        getFragmentShaderString(): string {
            var $str: string =
                " precision mediump float;\n" +
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


                "}"
            return $str

        }

    }
    class UishaderSprite extends BaseDiplay3dSprite {

        constructor() {
            super();

        }
        public initModeStr($vec: Array<number>, $index: Array<number>): void {


            this.objData = new ObjData;
            this.objData.vertices = new Array();
            this.objData.indexs = new Array();
            this.objData.uvs = new Array();
            this.objData.tangents = new Array();
            this.objData.bitangents = new Array();
            this.objData.normals = new Array();

            for (var i: number = 0; i < $index.length; i++) {
                var $fcnum: number = 11;
                var $ind: number = $index[i]
                var a1: number = $vec[$fcnum * $ind + 0] * 1;
                var a2: number = $vec[$fcnum * $ind + 1] * 1;
                var a3: number = $vec[$fcnum * $ind + 2] *1;

                var u1: number = $vec[$fcnum * $ind + 3];
                var u2: number = $vec[$fcnum * $ind + 4];

                var T1: number = $vec[$fcnum * $ind + 5];
                var T2: number = $vec[$fcnum * $ind + 6];
                var B1: number = $vec[$fcnum * $ind + 7];
                var B2: number = $vec[$fcnum * $ind + 8];
                var N1: number = $vec[$fcnum * $ind + 9];
                var N2: number = $vec[$fcnum * $ind + 10];


                this.objData.vertices.push(a1, a2, a3);
                this.objData.uvs.push(u1, u2);

                this.pushTBN(this.objData.tangents, T1, T2);
                this.pushTBN(this.objData.bitangents, B1, B2);
                this.pushTBN(this.objData.normals, N1, N2);

            
            }
            for (var i: number = 0; i < $index.length; i++) {
                this.objData.indexs.push(i);
            }
            this.upToGpu()
            var dd: MaterialModelSprite = <MaterialModelSprite>ModelShowModel.getInstance().selectShowDisp;
            dd.objData = this.objData
       
        }
        private pushTBN($arr: Array<number>, $a: number, $b: number): void {
            /*
            "bool ie = (id.y > (32767.1 / 65535.0)); \n" +
            "id.y=ie?(id.y-(32768.0/65535.0)):id.y;\n" +
                "vec3 r;\n" +
                "r.xy=(2.0*65535.0/32767.0)*id-vec2(1.0);\n" +
                "r.z=sqrt(clamp(1.0-dot(r.xy,r.xy),0.0,1.0));\n" +
                "r.z=ie?-r.z:r.z;\n" +
                */
            var id: Vector2D = new Vector2D($a / 65535, $b / 65535)
            var ie: boolean = id.y > (32767.1 / 65535.0);
            id.y = ie ? (id.y - (32768.0 / 65535.0)) : id.y;
            var r: Vector3D = new Vector3D()
            r.x = (2.0 * 65535.0 / 32767.0) * id.x - 1.0
            r.y = (2.0 * 65535.0 / 32767.0) * id.y - 1.0
            r.z = 1.0 - (r.x * r.x + r.y * r.y)
            r.z = Math.min(Math.max(r.z, 0),1)
            r.z = Math.sqrt(r.z);
            r.z = ie ? -r.z : r.z;
            $arr.push(r.x, r.y, r.z);
        }
 
        public upToGpu(): void {
            if (this.objData.indexs.length) {
                this.objData.treNum = this.objData.indexs.length
                this.objData.vertexBuffer = Scene_data.context3D.uploadBuff3D(this.objData.vertices);
                this.objData.uvBuffer = Scene_data.context3D.uploadBuff3D(this.objData.uvs);

                this.objData.tangentBuffer = Scene_data.context3D.uploadBuff3D(this.objData.tangents);
                this.objData.bitangentBuffer = Scene_data.context3D.uploadBuff3D(this.objData.bitangents);
                this.objData.normalsBuffer = Scene_data.context3D.uploadBuff3D(this.objData.normals);

                this.objData.indexBuffer = Scene_data.context3D.uploadIndexBuff3D(this.objData.indexs);
 
            }
        }
    }
    

    export class modelShowRender extends UIRenderOnlyPicComponent {
        public constructor() {
            super();
          
        }
        protected uiProLocation: WebGLUniformLocation;
        protected ui2ProLocation: WebGLUniformLocation;
        protected initData(): void {
            this._uiList = new Array;
 
            this.objData = new ObjData();
            ProgrmaManager.getInstance().registe(BloomUiShader.BloomUiShader, new BloomUiShader)
            this.shader = ProgrmaManager.getInstance().getProgram(BloomUiShader.BloomUiShader);
            this.program = this.shader.program;

            this.uiProLocation = Scene_data.context3D.getLocation(this.program, "ui")
            this.ui2ProLocation = Scene_data.context3D.getLocation(this.program, "ui2")



        }
        public makeRenderDataVc($vcId: number): void {
            super.makeRenderDataVc($vcId);
            for (var i: number = 0; i < this.renderData2.length / 4; i++) {
                this.renderData2[i * 4 + 0] = 1;
                this.renderData2[i * 4 + 1] = -1;
                this.renderData2[i * 4 + 2] = 0;
                this.renderData2[i * 4 + 3] = 0;
            }
        }
 
        public update(): void {


            if (!this.visible || this._uiList.length == 0) {
                if (this.modelRenderList && this.modelRenderList.length) {

                } else {
                    return
                }

            }
            Scene_data.context3D.setBlendParticleFactors(this.blenderMode);
            Scene_data.context3D.setProgram(this.program);
            this.setVc()
            Scene_data.context3D.setVa(0, 3, this.objData.vertexBuffer);
            Scene_data.context3D.setVa(1, 3, this.objData.uvBuffer);
            this.setTextureToGpu()

            Scene_data.context3D.setVc3fv(this.shader, "uScale", [3.51284, 3.51284, 3.51284]);
            Scene_data.context3D.setVc3fv(this.shader, "uScale", [1, 1, 1]);
            Scene_data.context3D.setVc3fv(this.shader, "uBias", [0, 0, 0]);

            Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
            if (this.modelRenderList) {
                for (var i: number = 0; i < this.modelRenderList.length; i++) {
                    this.modelRenderList[i].update();
                }
            }
        }
    }
    export class LeftPanel extends UIPanel {
        public _bottomRender: UIRenderComponent;
        public _midRender: UIRenderComponent;
        public _topRender: UIRenderComponent;
        private modelPic: modelShowRender;
        public constructor() {
            super();
   
            this.left = 0;
            this.top = 0;
            this.width=300
            this._bottomRender = new UIRenderComponent;
            this.addRender(this._bottomRender);

            this._midRender = new UIRenderComponent;
            this.addRender(this._midRender);

            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);

            this.modelPic = new modelShowRender();
            this.addRender(this.modelPic)


            this.layer=101
            this._topRender.uiAtlas = new UIAtlas();
            this._topRender.uiAtlas.setInfo("pan/marmoset/uilist/left/left.txt", "pan/marmoset/uilist/left/left.png", () => { this.loadConfigCom() });

        }
        private showModelPic: UICompenent
        private initView(): void {
            var $ui: UICompenent = this.addChild(this.modelPic.getComponent("a_model_show"));
            this.modelPic.setImgUrl("pan/marmoset/uilist/1024.jpg");
            $ui.top = 10;
            $ui.left = 10;
            ModelShowModel.getInstance()._bigPic = this.modelPic;
            $ui.name = "modelPic"
            $ui.addEventListener(InteractiveEvent.Down, this.addStageMoveEvets, this);

            this.showModelPic = $ui


        }
        public resize(): void {
            super.resize()
            this.height = Scene_data.stageHeight
            if (this.a_panel_bg) {
                this.a_panel_bg.width = this.width;
                this.a_panel_bg.height = this.height;
                this.a_left_line.x = this.width - 10;
                this.a_left_line.y = 0;
                this.a_left_line.height = this.height;

                this.showModelPic.width = this.width - 20;
                this.showModelPic.height = this.width - 20;

                this.a_compile_but.y = this.showModelPic.height + 20;
                this.a_input_dae.y = this.a_compile_but.y 
            }

        }
        private a_left_line: UICompenent;
        private lastWidth: number
        private a_left_lineDown($e: InteractiveEvent): void {
            this.a_left_line.data = new Vector2D($e.x, $e.y)
            this.lastWidth = this.width
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.a_left_lineUp, this);
        }
        private a_left_lineUp($e: InteractiveEvent): void {
            this.a_left_line.data = null
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.a_left_lineUp, this);
        }
        private onMoveLine($e: InteractiveEvent): void {
            var $select: UICompenent = UIManager.getInstance().getObjectsUnderPoint(new Vector2D($e.x, $e.y))
            if ($select == this.a_left_line) {
                Scene_data.canvas3D.style.cursor = "e-resize"
            } else {
                Scene_data.canvas3D.style.cursor = "auto"
            }
            if (this.a_left_line.data) {
                var $lastV2d: Vector2D = <Vector2D>this.a_left_line.data;
                var Tx: number = ($e.x - $lastV2d.x);

                var $lastW: number = this.width

                this.width = this.lastWidth + Tx;
                this.resize();
                prop.PropModel.getInstance().moveTop(this.width + 60)
                var $materialEvent: materialui.MaterialEvent = new materialui.MaterialEvent(materialui.MaterialEvent.SCENE_UI_TRUE_MOVE)
                $materialEvent.v2d = new Vector2D((this.width - $lastW) / materialui.MtlUiData.Scale, 0);
                ModuleEventManager.dispatchEvent($materialEvent);

            }
        }

     
        private lastCameRotation: Vector2D;
        private mouseXY: Vector2D;
        private addStageMoveEvets($e: InteractiveEvent): void {
            this.lastCameRotation = new Vector2D(Scene_data.focus3D.rotationX, Scene_data.focus3D.rotationY);
            this.mouseXY = new Vector2D($e.x, $e.y)
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onUp, this);

        }
        private onMove($e: InteractiveEvent): void {
            var $n: Vector2D = new Vector2D($e.x - this.mouseXY.x, $e.y - this.mouseXY.y);
            Scene_data.focus3D.rotationX = this.lastCameRotation.x - $n.y;
            Scene_data.focus3D.rotationY = this.lastCameRotation.y - $n.x ;
        }
        private onUp($e: InteractiveEvent): void {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onUp, this);
        }
        private a_panel_bg: UICompenent;
        private a_compile_but: UICompenent
        private a_input_dae: UICompenent
    
        private loadConfigCom(): void {
            this._bottomRender.uiAtlas = this._topRender.uiAtlas
            this._midRender.uiAtlas = this._topRender.uiAtlas;
            this.modelPic.uiAtlas = this._topRender.uiAtlas;

            
            this.a_input_dae = this.addEvntBut("a_input_dae", this._topRender)
            this.a_compile_but = this.addEvntBut("a_compile_but", this._topRender)
      

            this.a_panel_bg = this.addChild(this._bottomRender.getComponent("a_panel_bg"));
            this.a_panel_bg.left = 0;
            this.a_panel_bg.top = 0;

            this.a_left_line = this.addChild(this._topRender.getComponent("a_left_line"));
            this.a_left_line.addEventListener(InteractiveEvent.Down, this.a_left_lineDown, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMoveLine, this);


            this.initView()
            this.resize();


            prop.PropModel.getInstance().moveTop(this.width + 60)
            var $materialEvent: materialui.MaterialEvent = new materialui.MaterialEvent(materialui.MaterialEvent.SCENE_UI_TRUE_MOVE)
            $materialEvent.v2d = new Vector2D(0, 0);
            ModuleEventManager.dispatchEvent($materialEvent);

          
        }
        protected butClik(evt: InteractiveEvent): void {
            switch (evt.target) {
                case this.a_compile_but:
                    ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
                    break
                case this.a_input_dae:
                    console.log("inputdae")
                   // this.selectInputDae(evt)
      
                    ModelShowModel.getInstance().changeWebModel();
                    break
                default:
                    break
            }
        }

        private _inputHtmlSprite: HTMLInputElement
        protected selectInputDae(evt: InteractiveEvent): void {


                this._inputHtmlSprite = <HTMLInputElement>document.createElement('input');
                this._inputHtmlSprite.setAttribute('id', '_ef');
                this._inputHtmlSprite.setAttribute('type', 'file');
                this._inputHtmlSprite.setAttribute("style", 'visibility:hidden');
                this._inputHtmlSprite.click();
                this._inputHtmlSprite.value;
                this._inputHtmlSprite.addEventListener("change", (cevt: any) => { this.changeFile(cevt) });
     

        }
        private uishaderSprite: UishaderSprite
        private readFeijiModel($file: File): void {
            console.log("临时对象", $file.name)
            this.uishaderSprite = new UishaderSprite
            var $reader: FileReader = new FileReader();
            $reader.readAsText($file);
            $reader.onload = ($temp: Event) => {
                var $dd =( <string>$reader.result).split("|")
                this.uishaderSprite.initModeStr(this.getArrByStr($dd[0]), this.getArrByStr($dd[1]));
            }
        }
        private getArrByStr($dtstr: string): Array<number> {
            var configText: Array<string> = $dtstr.split(",");
            var $dataArr: Array<number> = new Array()
            for (var i: number = 0; i < configText.length; i++) {
                $dataArr.push(Number(configText[i]))
            }
            return $dataArr
        }
        private changeFile(evt: any): void {
            for (var i: number = 0; i < this._inputHtmlSprite.files.length && i < 1; i++) {
                var simpleFile: File = <File>this._inputHtmlSprite.files[i];
                if (!/image\/\w+/.test(simpleFile.type)) {
                    var $reader: FileReader = new FileReader();

                    if (simpleFile.name.indexOf("xxoo.txt") != -1) {
                        this.readFeijiModel(simpleFile)
                        return
                    }  
                    if (simpleFile.name.indexOf("objs.txt") != -1) {
                        $reader.readAsText(simpleFile);
                        $reader.onload = ($temp: Event) => {
                            ModelShowModel.getInstance().readTxtToModelBy(<string>$reader.result)
                        }
                    } else {
                        // alert("objs.txt结尾对象0" + simpleFile.name);
                        $reader.readAsArrayBuffer(simpleFile);
                        $reader.onload = ($temp: Event) => {
                            if (this.isRoleFile(<ArrayBuffer>$reader.result)) {
                                console.log("是角色", simpleFile.name)
                                filemodel.RoleChangeModel.getInstance().loadLocalFile(<ArrayBuffer>$reader.result)
                                SceneRenderToTextrue.getInstance().viweLHnumber = 1000
                            } else {
                                alert("不确定类型");
                            }
                        }

                    }
                } else {
                    alert("请确保文件类型为图像类型");
                }
            }
            this._inputHtmlSprite = null;
        }
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
    
        private isRoleFile(arrayBuffer: ArrayBuffer): boolean {
            var $byte: ByteArray = new ByteArray(arrayBuffer);
            $byte.position = 0
            var $version: number = $byte.readInt();
            var $url: string = $byte.readUTF();
            if ($url.indexOf("role/") != -1) {
                return true
            } else {
                return false
            }
            
        }
     
    
      


        private readVecFloat($byte: ByteArray): Array<number> {
            var $arr: Array<number> = new Array();
            var $len: number = $byte.readInt();
            for (var i: number = 0; i < $len; i++) {
                $arr.push($byte.readFloat())
            }
            return $arr
        }
        private readVecInt($byte: ByteArray): Array<number> {
            var $arr: Array<number> = new Array();
            var $len: number = $byte.readInt();
            for (var i: number = 0; i < $len; i++) {
                $arr.push($byte.readInt())
            }
            return $arr
        }
    
    }
}