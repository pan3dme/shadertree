module filemodel {

    import Engine = Pan3d.Engine
    import MathClass = Pan3d.MathClass
    import ModuleEventManager = Pan3d.ModuleEventManager
    import MaterialTree = materialui.MaterialTree
    import MaterialEvent = materialui.MaterialEvent
    import RoleRes = Pan3d.RoleRes
    import SkinMesh = Pan3d.SkinMesh
    import ResManager = Pan3d.ResManager
    import BaseRes = Pan3d.BaseRes
    import Pan3dByteArray = Pan3d.Pan3dByteArray
    import MeshData = Pan3d.MeshData
    import AnimData = Pan3d.AnimData
    import Dictionary = Pan3d.Dictionary
    import DualQuatFloat32Array = Pan3d.DualQuatFloat32Array
    import BaseEvent = Pan3d.BaseEvent
    import MeshDataManager = Pan3d.MeshDataManager
    import InteractiveEvent = Pan3d.InteractiveEvent
    
    import BaseMaterialNodeUI = materialui.BaseMaterialNodeUI
    import TextureSampleNodeUI = materialui.TextureSampleNodeUI
    import MtlUiData = materialui.MtlUiData
    import MaterialCtrl = materialui.MaterialCtrl
    
    import MaterialRoleSprite = left.MaterialRoleSprite
 

    export class InputMaterialModel  {
        private static _instance: InputMaterialModel;
        public static getInstance(): InputMaterialModel {
            if (!this._instance) {
                this._instance = new InputMaterialModel();
            }
            return this._instance;
        }
  
        private _inputHtmlSprite: HTMLInputElement
        private mouseEvt: InteractiveEvent
        public inputFile(evt: InteractiveEvent): void {
            this.mouseEvt = evt
            this._inputHtmlSprite = <HTMLInputElement>document.createElement('input');
            this._inputHtmlSprite.setAttribute('id', '_ef');
            this._inputHtmlSprite.setAttribute('type', 'file');
            this._inputHtmlSprite.setAttribute("style", 'visibility:hidden');
            this._inputHtmlSprite.click();
            this._inputHtmlSprite.value;
            this._inputHtmlSprite.addEventListener("change", (cevt: any) => { this.changeFile(cevt) });
        }
        private changeFile(evt: any): void {
            for (var i: number = 0; i < this._inputHtmlSprite.files.length && i < 1; i++) {
                var simpleFile: File = <File>this._inputHtmlSprite.files[i];
                if (!/image\/\w+/.test(simpleFile.type)) {
                    var $reader: FileReader = new FileReader();

                   
                    if (simpleFile.name.indexOf("objs.txt") != -1) {
                        $reader.readAsText(simpleFile);
                        $reader.onload = ($temp: Event) => {
 
                        }
                    } else {
                        // alert("objs.txt结尾对象0" + simpleFile.name);
                        $reader.readAsArrayBuffer(simpleFile);
                        $reader.onload = ($temp: Event) => {
                            if (this.isRoleFile(<ArrayBuffer>$reader.result)) {
                                console.log("是角色", simpleFile.name)
                                this.selectFileForRole(simpleFile, <ArrayBuffer> $reader.result)
           
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
        private selectFileForRole(value: File, arrayBuffer: ArrayBuffer): void {
            var $roleRes: RoleRes = new RoleRes()
            $roleRes.load("nofilenonono.txt", () => {
                this.makeMeshData($roleRes)
                var $role: MaterialRoleSprite = new MaterialRoleSprite();
                $role.addEventListener(BaseEvent.COMPLETE, () => {
                    for (var i: number = 0; i < $role.skinMesh.meshAry.length; i++) {
                        for (var j: number = 0; j < $role.skinMesh.meshAry[i].materialParamData.length; j++) {
                            if ($role.skinMesh.meshAry[i].materialParamData[j].type == 0) {
                                var textui: TextureSampleNodeUI = new TextureSampleNodeUI()
                                this.mouseEvt.x += 100;
                                this.mouseEvt.y += 100;

                                this.onTempNode(textui,this.mouseEvt)
                                textui.creatBase($role.skinMesh.meshAry[i].materialParamData[j].url);
                            }
                        }
                    }
                }, this)
                $role.setRoleUrl($roleRes.roleUrl);
            })
            $roleRes.loadComplete(arrayBuffer);

        }
        private onTempNode($ui: BaseMaterialNodeUI, evt: InteractiveEvent): void {
            $ui.left = evt.x / MtlUiData.Scale - 200;
            $ui.top = evt.y / MtlUiData.Scale - 30;
            MaterialCtrl.getInstance().addNodeUI($ui)
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
        private isRoleFile(arrayBuffer: ArrayBuffer): boolean {
            var $byte: Pan3dByteArray = new Pan3dByteArray(arrayBuffer);
            $byte.position = 0
            var $version: number = $byte.readInt();
            var $url: string = $byte.readUTF();
            if ($url.indexOf("role/") != -1) {
                return true
            } else {
                return false
            }

        }
        private readOnLod($temp: Event): void {
            /*
            var $reader: FileReader = <FileReader>($temp.target);
            var $materailTree: MaterialTree = new MaterialTree;
            $materailTree.url = "selectUrl.txt";
            var $obj: any = JSON.parse($reader.result)
            $materailTree.setData($obj);


            var $materialEvent: MaterialEvent = new MaterialEvent(MaterialEvent.INUPT_NEW_MATERIAL_FILE)
            $materialEvent.materailTree = $materailTree
            ModuleEventManager.dispatchEvent($materialEvent);

            */

        }

    }
}