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
    

    export class LeftPanel extends UIPanel {
        public _bottomRender: UIRenderComponent;
        public _midRender: UIRenderComponent;
        public _topRender: UIRenderComponent;
 
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

 


            this.layer=101
            this._topRender.uiAtlas = new UIAtlas();
            this._topRender.uiAtlas.setInfo("pan/marmoset/uilist/left/left.txt", "pan/marmoset/uilist/left/left.png", () => { this.loadConfigCom() });

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
 

            
            this.a_input_dae = this.addEvntBut("a_input_dae", this._topRender)
            this.a_compile_but = this.addEvntBut("a_compile_but", this._topRender)
      

            this.a_panel_bg = this.addChild(this._bottomRender.getComponent("a_panel_bg"));
            this.a_panel_bg.left = 0;
            this.a_panel_bg.top = 0;

            this.a_left_line = this.addChild(this._topRender.getComponent("a_left_line"));
            this.a_left_line.addEventListener(InteractiveEvent.Down, this.a_left_lineDown, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMoveLine, this);


 
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
                    this.selectInputDae(evt)
       
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

                    if (simpleFile.name.indexOf(".md5mesh") != -1) {

                        $reader.readAsText(simpleFile);
                        $reader.onload = ($temp: Event) => {
                            ModelShowModel.getInstance().webmd5Sprite.addLocalMeshByStr(<string>$reader.result)
                        }
                        return
                    } 
                    if (simpleFile.name.indexOf(".md5anim") != -1) {

                        $reader.readAsText(simpleFile);
                        $reader.onload = ($temp: Event) => {
                            ModelShowModel.getInstance().webmd5Sprite.addLocalAdimByStr(<string>$reader.result)

                            ModelShowModel.getInstance().changeWebModel();
                        }
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