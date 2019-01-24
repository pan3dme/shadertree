var filemodel;
(function (filemodel) {
    var RoleRes = Pan3d.RoleRes;
    var Pan3dByteArray = Pan3d.Pan3dByteArray;
    var BaseEvent = Pan3d.BaseEvent;
    var MeshDataManager = Pan3d.MeshDataManager;
    var TextureSampleNodeUI = materialui.TextureSampleNodeUI;
    var MtlUiData = materialui.MtlUiData;
    var MaterialCtrl = materialui.MaterialCtrl;
    var MaterialRoleSprite = left.MaterialRoleSprite;
    var InputMaterialModel = /** @class */ (function () {
        function InputMaterialModel() {
        }
        InputMaterialModel.getInstance = function () {
            if (!this._instance) {
                this._instance = new InputMaterialModel();
            }
            return this._instance;
        };
        InputMaterialModel.prototype.inputFile = function (evt) {
            var _this = this;
            this.mouseEvt = evt;
            this._inputHtmlSprite = document.createElement('input');
            this._inputHtmlSprite.setAttribute('id', '_ef');
            this._inputHtmlSprite.setAttribute('type', 'file');
            this._inputHtmlSprite.setAttribute("style", 'visibility:hidden');
            this._inputHtmlSprite.click();
            this._inputHtmlSprite.value;
            this._inputHtmlSprite.addEventListener("change", function (cevt) { _this.changeFile(cevt); });
        };
        InputMaterialModel.prototype.changeFile = function (evt) {
            var _this = this;
            for (var i = 0; i < this._inputHtmlSprite.files.length && i < 1; i++) {
                var simpleFile = this._inputHtmlSprite.files[i];
                if (!/image\/\w+/.test(simpleFile.type)) {
                    var $reader = new FileReader();
                    if (simpleFile.name.indexOf("objs.txt") != -1) {
                        $reader.readAsText(simpleFile);
                        $reader.onload = function ($temp) {
                        };
                    }
                    else {
                        // alert("objs.txt结尾对象0" + simpleFile.name);
                        $reader.readAsArrayBuffer(simpleFile);
                        $reader.onload = function ($temp) {
                            if (_this.isRoleFile($reader.result)) {
                                console.log("是角色", simpleFile.name);
                                _this.selectFileForRole(simpleFile, $reader.result);
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
        InputMaterialModel.prototype.selectFileForRole = function (value, arrayBuffer) {
            var _this = this;
            var $roleRes = new RoleRes();
            $roleRes.load("nofilenonono.txt", function () {
                _this.makeMeshData($roleRes);
                var $role = new MaterialRoleSprite();
                $role.addEventListener(BaseEvent.COMPLETE, function () {
                    for (var i = 0; i < $role.skinMesh.meshAry.length; i++) {
                        for (var j = 0; j < $role.skinMesh.meshAry[i].materialParamData.length; j++) {
                            if ($role.skinMesh.meshAry[i].materialParamData[j].type == 0) {
                                var textui = new TextureSampleNodeUI();
                                _this.mouseEvt.x += 100;
                                _this.mouseEvt.y += 100;
                                _this.onTempNode(textui, _this.mouseEvt);
                                textui.creatBase($role.skinMesh.meshAry[i].materialParamData[j].url);
                            }
                        }
                    }
                }, _this);
                $role.setRoleUrl($roleRes.roleUrl);
            });
            $roleRes.loadComplete(arrayBuffer);
        };
        InputMaterialModel.prototype.onTempNode = function ($ui, evt) {
            $ui.left = evt.x / MtlUiData.Scale - 200;
            $ui.top = evt.y / MtlUiData.Scale - 30;
            MaterialCtrl.getInstance().addNodeUI($ui);
        };
        InputMaterialModel.prototype.makeMeshData = function ($roleRes) {
            //比较差的方法存放并修改模型文件
            var $mesh = MeshDataManager.getInstance().getMeshDataByLocalUrl($roleRes.roleUrl);
            var url = $roleRes.roleUrl;
            //  $mesh.loadMaterial();
            $mesh.setAction($roleRes.actionAry, url);
            $mesh.url = url;
            if ($roleRes.ambientLightColor) {
                $mesh.lightData = [[$roleRes.ambientLightColor.x, $roleRes.ambientLightColor.y, $roleRes.ambientLightColor.z],
                    [$roleRes.nrmDircet.x, $roleRes.nrmDircet.y, $roleRes.nrmDircet.z],
                    [$roleRes.sunLigthColor.x, $roleRes.sunLigthColor.y, $roleRes.sunLigthColor.z]];
            }
            $mesh.ready = true;
        };
        InputMaterialModel.prototype.isRoleFile = function (arrayBuffer) {
            var $byte = new Pan3dByteArray(arrayBuffer);
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
        InputMaterialModel.prototype.readOnLod = function ($temp) {
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
        };
        return InputMaterialModel;
    }());
    filemodel.InputMaterialModel = InputMaterialModel;
})(filemodel || (filemodel = {}));
//# sourceMappingURL=InputMaterialModel.js.map