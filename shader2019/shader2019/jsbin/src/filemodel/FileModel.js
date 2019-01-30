var filemodel;
(function (filemodel) {
    var MathClass = Pan3d.MathClass;
    var ModuleEventManager = Pan3d.ModuleEventManager;
    var MaterialTree = materialui.MaterialTree;
    var MaterialEvent = materialui.MaterialEvent;
    var FileVo = /** @class */ (function () {
        function FileVo() {
        }
        FileVo.prototype.meshStr = function (str) {
            var $arr = str.split("/");
            this.name = $arr[$arr.length - 2];
            this.path = str;
            this.isFolder = true;
            //  console.log(this.name, this.path)
        };
        FileVo.meshObj = function (value) {
            if (value.name.length - 1 != value.name.lastIndexOf("/")) {
                var vo = new FileVo();
                var str = value.name;
                var $arr = str.split("/");
                vo.name = $arr[$arr.length - 1];
                vo.path = str.replace("upfile/shadertree/", "");
                vo.suffix = vo.name.split(".")[1];
                //  console.log(vo.name, vo.path)
                return vo;
            }
            return null;
        };
        return FileVo;
    }());
    filemodel.FileVo = FileVo;
    var FolderModel = /** @class */ (function () {
        function FolderModel() {
        }
        FolderModel.oneByOne = function () {
            var _this = this;
            if (this.waitItem.length > 0) {
                var $dir = this.waitItem[0].a; //目录
                var kFun = this.waitItem[0].b; //返回
                var nextMarker = "";
                this.ossWrapper.list({
                    'delimiter': '/',
                    'prefix': $dir,
                    'max-keys': 100,
                    'marker': nextMarker,
                }).then(function (result) {
                    _this.waitItem.shift();
                    _this.oneByOne();
                    kFun(result);
                }).catch(function (err) {
                    console.log(err);
                    console.log("网络异常。需要注意");
                    _this.waitItem.shift();
                    _this.oneByOne();
                    kFun(null);
                });
            }
        };
        FolderModel.getFolderArr = function ($dir, bfun) {
            this.getDisList($dir, function (value) {
                var fileArr = [];
                for (var i = 0; value.prefixes && i < value.prefixes.length; i++) {
                    var fileVo = new FileVo();
                    fileVo.meshStr(value.prefixes[i]);
                    fileArr.push(fileVo);
                }
                for (var j = 0; j < value.objects.length; j++) {
                    var fileVo = FileVo.meshObj(value.objects[j]);
                    if (fileVo) {
                        fileArr.push(fileVo);
                    }
                }
                bfun(fileArr);
            });
        };
        FolderModel.getDisList = function ($dir, bfun) {
            var _this = this;
            if (!this.waitItem) {
                this.waitItem = [];
            }
            this.waitItem.push({ a: $dir, b: bfun });
            if (this.waitItem.length == 1) {
                if (this.ossWrapper) {
                    this.oneByOne();
                }
                else {
                    FileModel.webseverurl = "https://api.h5key.com/api/";
                    FileModel.WEB_SEVER_EVENT_AND_BACK("get_STS", "id=" + 99, function (res) {
                        if (res.data && res.data.info) {
                            _this.ossWrapper = new OSS.Wrapper({
                                accessKeyId: res.data.info.AccessKeyId,
                                accessKeySecret: res.data.info.AccessKeySecret,
                                stsToken: res.data.info.SecurityToken,
                                endpoint: "https://oss-cn-shanghai.aliyuncs.com",
                                bucket: "webpan"
                            });
                            _this.oneByOne();
                        }
                        else {
                            console.log(res);
                        }
                    });
                }
            }
        };
        FolderModel.getBase = function () {
            FileModel.webseverurl = "https://api.h5key.com/api/";
            FileModel.WEB_SEVER_EVENT_AND_BACK("get_STS", "id=" + 99, function (res) {
                if (res.data.info) {
                    var client = new OSS.Wrapper({
                        accessKeyId: res.data.info.AccessKeyId,
                        accessKeySecret: res.data.info.AccessKeySecret,
                        stsToken: res.data.info.SecurityToken,
                        endpoint: "https://oss-cn-shanghai.aliyuncs.com",
                        bucket: "webpan"
                    });
                    //获取oss文件列表
                    var nextMarker = "";
                    client.list({
                        'delimiter': '/',
                        'prefix': "",
                        'max-keys': 1000,
                        'marker': nextMarker,
                    }).then(function (result) {
                        console.log(result);
                    }).catch(function (err) {
                        console.log(err);
                    });
                }
            });
        };
        return FolderModel;
    }());
    filemodel.FolderModel = FolderModel;
    var FileModel = /** @class */ (function () {
        function FileModel() {
            this.waitItemFile = [];
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
            FileModel.webseverurl = "https://api.h5key.com/api/";
            this.waitItemFile.push({ a: file, b: $fileUrl, c: $bfun });
            if (this.waitItemFile.length == 1) {
                if (this.info) {
                    this.oneByOne();
                }
                else {
                    FileModel.WEB_SEVER_EVENT_AND_BACK("get_STS", "id=" + 99, function (res) {
                        _this.info = res.data.info;
                        if (_this.info) {
                            _this.oneByOne();
                        }
                        else {
                            console.log("get_STS", res);
                        }
                    });
                }
                console.log("ccav");
            }
        };
        FileModel.prototype.oneByOne = function () {
            var _this = this;
            if (this.waitItemFile.length > 0) {
                this.uploadFile(this.waitItemFile[0].a, this.waitItemFile[0].b, function () {
                    console.log(_this.waitItemFile[0]);
                    var kFun = _this.waitItemFile[0].c;
                    _this.waitItemFile.shift();
                    kFun && kFun();
                    _this.oneByOne();
                });
            }
        };
        FileModel.prototype.selectFileById = function (value) {
            var _this = this;
            this.fileid = value;
            var $texturl = "texturelist/" + this.fileid + ".txt";
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
                Pan3d.LoadManager.getInstance().load(Scene_data.fileRoot + "texturelist/config/" + _this.fileid + ".txt", Pan3d.LoadManager.XML_TYPE, function ($configStr) {
                    var $config = JSON.parse($configStr);
                    if ($config.showType == 0) {
                        Pan3d.LoadManager.getInstance().load(Scene_data.fileRoot + "texturelist/model_" + value + "_objs.txt", Pan3d.LoadManager.XML_TYPE, function ($modelxml) {
                            left.ModelShowModel.getInstance().readTxtToModelBy($modelxml);
                            ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
                        });
                    }
                    if ($config.showType == 1) {
                        filemodel.RoleChangeModel.getInstance().changeRoleModel(_this.fileid);
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
                    this.upOssFile($file, "shadertree/texturelist/model_" + this.fileid + "_objs.txt", function () {
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
                    this.upOssFile($file, "shadertree/texturelist/role_" + this.fileid + "_str.txt", function () {
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
            var $upfile = this.dataURLtoFile($img.src, this.fileid + ".jpg");
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
            $temp.id = this.fileid;
            if (left.ModelShowModel.getInstance().selectShowDisp instanceof left.MaterialModelSprite) {
                $temp.showType = 0;
            }
            if (left.ModelShowModel.getInstance().selectShowDisp instanceof left.MaterialRoleSprite) {
                $temp.showType = 1;
            }
            var $file = new File([JSON.stringify($temp)], "ossfile.txt");
            this.upOssFile($file, "shadertree/texturelist/config/" + this.fileid + ".txt", function () {
                console.log("文件上传成功", $file.name);
            });
        };
        FileModel.prototype.upMaterialTreeToWeb = function ($temp) {
            if (this.fileid) {
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
                            var $newUrl = "uppic/" + this.fileid + "/" + $upfile.name;
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
                this.upOssFile($file, "shadertree/texturelist/" + this.fileid + ".txt", function () {
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