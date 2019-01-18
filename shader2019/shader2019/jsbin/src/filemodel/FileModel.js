var filemodel;
(function (filemodel) {
    var MathClass = Pan3d.MathClass;
    var ModuleEventManager = Pan3d.ModuleEventManager;
    var MaterialTree = materialui.MaterialTree;
    var MaterialEvent = materialui.MaterialEvent;
    var FileModel = /** @class */ (function () {
        function FileModel() {
        }
        FileModel.getInstance = function () {
            if (!this._instance) {
                this._instance = new FileModel();
            }
            return this._instance;
        };
        FileModel.prototype.upOssFile = function (file, $fileUrl, $bfun) {
            var _this = this;
            if ($bfun === void 0) { $bfun = null; }
            FileModel.webseverurl = "http://api.h5key.com/api/";
            if (this.info) {
                this.uploadFile(file, $fileUrl, $bfun);
            }
            else {
                FileModel.WEB_SEVER_EVENT_AND_BACK("get_STS", "id=" + 99, function (res) {
                    _this.info = res.data.info;
                    _this.uploadFile(file, $fileUrl, $bfun);
                });
            }
        };
        FileModel.prototype.selectFileById = function (value) {
            var _this = this;
            var $texturl = "texturelist/" + value + ".txt";
            Pan3d.LoadManager.getInstance().load(Scene_data.fileRoot + $texturl, Pan3d.LoadManager.BYTE_TYPE, function ($dtstr) {
                var $byte = new Pan3d.Pan3dByteArray($dtstr);
                $byte.position = 0;
                var $temp = JSON.parse($byte.readUTF());
                var $tempMaterial = new MaterialTree;
                $tempMaterial = new MaterialTree;
                $tempMaterial.url = $texturl;
                $tempMaterial.setData({ data: $temp.data });
                var $materialEvent = new MaterialEvent(MaterialEvent.INUPT_NEW_MATERIAL_FILE);
                $materialEvent.materailTree = $tempMaterial;
                ModuleEventManager.dispatchEvent($materialEvent);
                Pan3d.LoadManager.getInstance().load(Scene_data.fileRoot + "texturelist/config/" + _this.selectFileMeshVo.id + ".txt", Pan3d.LoadManager.XML_TYPE, function ($configStr) {
                    var $config = JSON.parse($configStr);
                    if ($config.showType == 0) {
                        Pan3d.LoadManager.getInstance().load(Scene_data.fileRoot + "texturelist/model_" + value + "_objs.txt", Pan3d.LoadManager.XML_TYPE, function ($modelxml) {
                            left.ModelShowModel.getInstance().readTxtToModelBy($modelxml);
                            ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
                        });
                    }
                    if ($config.showType == 1) {
                        filemodel.RoleChangeModel.getInstance().changeRoleModel(_this.selectFileMeshVo.id);
                        Scene_data.cam3D.distance = 100;
                        left.SceneRenderToTextrue.getInstance().viweLHnumber = 300;
                    }
                });
            });
        };
        FileModel.prototype.saveModelToWeb = function () {
            if (left.ModelShowModel.getInstance().selectShowDisp instanceof left.MaterialModelSprite) {
                var $modelSprite = left.ModelShowModel.getInstance().selectShowDisp;
                var $objInfo = {};
                $objInfo.vertices = $modelSprite.objData.vertices;
                $objInfo.normals = $modelSprite.objData.normals;
                $objInfo.uvs = $modelSprite.objData.uvs;
                $objInfo.lightuvs = $modelSprite.objData.uvs;
                $objInfo.indexs = $modelSprite.objData.indexs;
                $objInfo.treNum = $modelSprite.objData.indexs.length;
                var $modelStr = JSON.stringify($objInfo);
                if ($modelStr) {
                    var $file = new File([$modelStr], "ossfile.txt");
                    this.upOssFile($file, "shadertree/texturelist/model_" + this.selectFileMeshVo.id + "_objs.txt", function () {
                        console.log("文件上传成功");
                    });
                }
            }
        };
        FileModel.prototype.saveRoleToWeb = function () {
            if (left.ModelShowModel.getInstance().selectShowDisp instanceof left.MaterialRoleSprite) {
                var role = left.ModelShowModel.getInstance().selectShowDisp;
                var $roleStr = filemodel.RoleChangeModel.getInstance().getChangeRoleStr();
                if ($roleStr) {
                    var $file = new File([$roleStr], "ossfile.txt");
                    this.upOssFile($file, "shadertree/texturelist/role_" + this.selectFileMeshVo.id + "_str.txt", function () {
                        console.log("文件上传成功");
                    });
                }
                else {
                    console.log("没有可上传mesh数据");
                }
            }
        };
        FileModel.prototype.upListIcon = function () {
            var ctx = Pan3d.Scene_data.canvas3D;
            var gl = Pan3d.Scene_data.context3D.renderContext;
            var width = 256;
            var height = 256;
            gl.viewport(0, 0, 256, 256);
            gl.clearColor(63 / 255, 63 / 255, 63 / 255, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
            left.SceneRenderToTextrue.getInstance().resetViewMatrx3D();
            Scene_data.viewMatrx3D.appendScale(1, -1, 1);
            MathClass.getCamView(Scene_data.cam3D, Scene_data.focus3D); //一定要角色帧渲染后再重置镜头矩阵
            left.ModelShowModel.getInstance().selectShowDisp.update();
            var arrayBuffer = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, arrayBuffer);
            var clampArray = new Uint8ClampedArray(arrayBuffer, 0, arrayBuffer.length);
            var imageData = new ImageData(clampArray, width, height);
            var tempCanvas = document.createElement("CANVAS");
            tempCanvas.width = width;
            tempCanvas.height = height;
            tempCanvas.getContext('2d').putImageData(imageData, 0, 0);
            var $img = this.convertCanvasToImage(tempCanvas);
            var $upfile = this.dataURLtoFile($img.src, this.selectFileMeshVo.id + ".jpg");
            var $newUrl = $upfile.name;
            filemodel.FileModel.getInstance().upOssFile($upfile, "shadertree/ui/filelist/pic/" + $newUrl, function () {
                console.log("文件上传成功");
            });
        };
        FileModel.prototype.convertCanvasToImage = function (canvas) {
            var image = new Image();
            image.src = canvas.toDataURL("image/png");
            return image;
        };
        FileModel.prototype.saveConfigToWeb = function () {
            var $temp = {};
            $temp.id = this.selectFileMeshVo.id;
            if (left.ModelShowModel.getInstance().selectShowDisp instanceof left.MaterialModelSprite) {
                $temp.showType = 0;
            }
            if (left.ModelShowModel.getInstance().selectShowDisp instanceof left.MaterialRoleSprite) {
                $temp.showType = 1;
            }
            var $file = new File([JSON.stringify($temp)], "ossfile.txt");
            this.upOssFile($file, "shadertree/texturelist/config/" + this.selectFileMeshVo.id + ".txt", function () {
                console.log("文件上传成功", $file.name);
            });
        };
        FileModel.prototype.upMaterialTreeToWeb = function ($temp) {
            if (this.selectFileMeshVo) {
                this.saveConfigToWeb();
                this.upListIcon();
                this.saveModelToWeb();
                this.saveRoleToWeb();
                for (var i = 0; $temp.data && i < $temp.data.length; i++) {
                    var $vo = $temp.data[i];
                    if ($vo.type == materialui.NodeTree.TEX || $vo.type == materialui.NodeTree.TEX3D || $vo.type == materialui.NodeTree.TEXCUBE) {
                        var $img = TextureManager.getInstance().getImgResByurl(Scene_data.fileRoot + $vo.data.url);
                        if ($img) { //新加的图
                            var $upfile = this.dataURLtoFile($img.src, $vo.data.url);
                            var $newUrl = "uppic/" + this.selectFileMeshVo.id + "/" + $upfile.name;
                            filemodel.FileModel.getInstance().upOssFile($upfile, "shadertree/" + $newUrl, function () {
                                console.log("文件上传成功");
                            });
                            $vo.data.url = $newUrl;
                        }
                        else {
                        }
                    }
                }
                var $byte = new Pan3d.Pan3dByteArray();
                $byte.writeUTF(JSON.stringify({ data: $temp.data }));
                var $file = new File([$byte.buffer], "ossfile.txt");
                this.upOssFile($file, "shadertree/texturelist/" + this.selectFileMeshVo.id + ".txt", function () {
                    console.log("文件上传成功");
                });
            }
            else {
                // alert("还没有先文件")
            }
        };
        FileModel.prototype.dataURLtoFile = function (dataurl, filename) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        };
        FileModel.prototype.uploadFile = function ($file, $filename, $bfun) {
            if ($bfun === void 0) { $bfun = null; }
            var client = new OSS.Wrapper({
                accessKeyId: this.info.AccessKeyId,
                accessKeySecret: this.info.AccessKeySecret,
                stsToken: this.info.SecurityToken,
                endpoint: "https://oss-cn-shanghai.aliyuncs.com",
                bucket: "webpan"
            });
            var storeAs = "upfile/" + $filename;
            client.multipartUpload(storeAs, $file).then(function (result) {
                console.log(result);
                $bfun && $bfun();
            }).catch(function (err) {
                console.log(err);
            });
        };
        FileModel.WEB_SEVER_EVENT_AND_BACK = function (webname, postStr, $bfun) {
            if ($bfun === void 0) { $bfun = null; }
            webname = webname.replace(/\s+/g, "");
            var $obj = new Object();
            $obj.webname = webname;
            $obj.postStr = postStr.replace(/\s+/g, "");
            $obj.fun = $bfun;
            this.isPostWeboffwx(webname, postStr, $bfun);
        };
        //网页模式的WEB请求
        FileModel.isPostWeboffwx = function (webname, postStr, $bfun) {
            if ($bfun === void 0) { $bfun = null; }
            var ajax = new XMLHttpRequest();
            var url = FileModel.webseverurl + webname;
            var timestamp = String(Pan3d.TimeUtil.getTimer());
            var keystr = "ABC";
            var self_sign = hex_md5(postStr + timestamp + keystr);
            ajax.open("post", url, true);
            ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            ajax.setRequestHeader("timestamp", timestamp);
            ajax.setRequestHeader("sign", self_sign);
            ajax.onreadystatechange = function () {
                if (ajax.readyState == 4) {
                    if (ajax.status == 200) {
                        $bfun ? $bfun({ data: JSON.parse(ajax.responseText) }) : null;
                    }
                    else {
                        console.log("HTTP请求错误！错误码：" + ajax.status);
                        $bfun ? $bfun(null) : null;
                    }
                }
            };
            ajax.send(postStr);
        };
        return FileModel;
    }());
    filemodel.FileModel = FileModel;
})(filemodel || (filemodel = {}));
//# sourceMappingURL=FileModel.js.map