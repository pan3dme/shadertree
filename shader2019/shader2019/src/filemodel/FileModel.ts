﻿module filemodel {

    import Engine = Pan3d.Engine
    import MathClass = Pan3d.MathClass
    import ModuleEventManager = Pan3d.ModuleEventManager
    import MaterialTree = materialui.MaterialTree
    import MaterialEvent = materialui.MaterialEvent

    export class FileModel {




        private static _instance: FileModel;
        public static getInstance(): FileModel {
            if (!this._instance) {
                this._instance = new FileModel();
            }
            return this._instance;
        }
        private info: any;
        public upOssFile(file: File, $fileUrl: string, $bfun: Function = null): void {
            FileModel.webseverurl = "http://api.h5key.com/api/";
            if (this.info) {
                this.uploadFile(file, $fileUrl, $bfun)
            } else {
                FileModel.WEB_SEVER_EVENT_AND_BACK("get_STS", "id=" + 99, (res: any) => {
                    this.info = res.data.info
                    this.uploadFile(file, $fileUrl, $bfun)
                })
            }
        }
        public selectFileById(value: number): void {
         

            var $texturl: string = "texturelist/" + value + ".txt"
            Pan3d.LoadManager.getInstance().load(Scene_data.fileRoot + $texturl, Pan3d.LoadManager.BYTE_TYPE,
                ($dtstr: ArrayBuffer) => {
                    var $byte: Pan3d.Pan3dByteArray = new Pan3d.Pan3dByteArray($dtstr);
                    $byte.position = 0
                    var $temp: any = JSON.parse($byte.readUTF());

                    var $tempMaterial: MaterialTree = new MaterialTree
                    $tempMaterial = new MaterialTree;
                    $tempMaterial.url = $texturl
                    $tempMaterial.setData({ data: $temp.data });
                    var $materialEvent: MaterialEvent = new MaterialEvent(MaterialEvent.INUPT_NEW_MATERIAL_FILE)
                    $materialEvent.materailTree = $tempMaterial;
                    ModuleEventManager.dispatchEvent($materialEvent);

              
                    Pan3d.LoadManager.getInstance().load(Scene_data.fileRoot + "texturelist/config/" + this.selectFileMeshVo.id + ".txt", Pan3d.LoadManager.XML_TYPE,
                        ($configStr: string) => {
                            var $config: any = JSON.parse($configStr);
                            if ($config.showType == 0) {
                                Pan3d.LoadManager.getInstance().load(Scene_data.fileRoot + "texturelist/model_" + value + "_objs.txt", Pan3d.LoadManager.XML_TYPE,
                                    ($modelxml: string) => {
                                        left.ModelShowModel.getInstance().readTxtToModelBy($modelxml)
                                        ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
                                    });
                            }
                            if ($config.showType == 1) {
                                filemodel.RoleChangeModel.getInstance().changeRoleModel(this.selectFileMeshVo.id)
                                Scene_data.cam3D.distance = 100
                                left.SceneRenderToTextrue.getInstance().viweLHnumber = 300
                            }
                        });
                    

 
 
                });
        }
        
        public selectFileMeshVo: FileMeshVo
        private saveModelToWeb(): void {

            if (left.ModelShowModel.getInstance().selectShowDisp instanceof left.MaterialModelSprite) {
                var $modelSprite: left.MaterialModelSprite = <left.MaterialModelSprite> left.ModelShowModel.getInstance().selectShowDisp;
                var $objInfo: any = {};
                $objInfo.vertices = $modelSprite.objData.vertices;
                $objInfo.normals = $modelSprite.objData.normals;
                $objInfo.uvs = $modelSprite.objData.uvs;
                $objInfo.lightuvs = $modelSprite.objData.uvs;
                $objInfo.indexs = $modelSprite.objData.indexs;
                $objInfo.treNum = $modelSprite.objData.indexs.length;
                var $modelStr: string = JSON.stringify($objInfo);
                if ($modelStr) {
                    var $file: File = new File([$modelStr], "ossfile.txt");
                    this.upOssFile($file, "shadertree/texturelist/model_" + this.selectFileMeshVo.id + "_objs.txt", () => {
                        console.log("文件上传成功");
                    })
                }
            }


     
        }
        private saveRoleToWeb(): void {
   
            if (left.ModelShowModel.getInstance().selectShowDisp instanceof left.MaterialRoleSprite) {
                var role: left.MaterialRoleSprite = <left.MaterialRoleSprite>left.ModelShowModel.getInstance().selectShowDisp
                var $roleStr: string = RoleChangeModel.getInstance().getChangeRoleStr();
                if ($roleStr) {
                    var $file: File = new File([$roleStr], "ossfile.txt");
                    this.upOssFile($file, "shadertree/texturelist/role_" + this.selectFileMeshVo.id + "_str.txt", () => {
                        console.log("文件上传成功");
                    })
                } else {
                    console.log("没有可上传mesh数据");
                }
            }
        }

        private upListIcon(): void {
            var ctx: any = Pan3d.Scene_data.canvas3D

 
            var gl: WebGLRenderingContext = Pan3d.Scene_data.context3D.renderContext
            var width: number = 256;
            var height: number = 256;


           

            gl.viewport(0, 0, 256, 256);
            gl.clearColor(63 / 255, 63 / 255, 63 / 255, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

            left.SceneRenderToTextrue.getInstance().resetViewMatrx3D()
            Scene_data.viewMatrx3D.appendScale(1,-1,1)
            MathClass.getCamView(Scene_data.cam3D, Scene_data.focus3D); //一定要角色帧渲染后再重置镜头矩阵
            left.ModelShowModel.getInstance().selectShowDisp.update();
         

            var arrayBuffer: Uint8Array = new Uint8Array(width * height * 4);
            gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, arrayBuffer);
            var clampArray: Uint8ClampedArray= new Uint8ClampedArray(arrayBuffer, 0, arrayBuffer.length);
            var imageData: ImageData = new ImageData(clampArray, width, height);


            var tempCanvas: any = document.createElement("CANVAS");
            tempCanvas.width = width;
            tempCanvas.height = height;
            tempCanvas.getContext('2d').putImageData(imageData, 0, 0);
            var $img: HTMLImageElement = this.convertCanvasToImage(tempCanvas);

            var $upfile: File = this.dataURLtoFile($img.src, this.selectFileMeshVo.id+".jpg");
            var $newUrl: string =  $upfile.name
            filemodel.FileModel.getInstance().upOssFile($upfile, "shadertree/ui/filelist/pic/" + $newUrl, () => {
                console.log("文件上传成功");
            })
           
        }
        public convertCanvasToImage(canvas): any {
            var image = new Image();
            image.src = canvas.toDataURL("image/png");
            return image;
        }
        private saveConfigToWeb(): void {
            var $temp: any = {};
            $temp.id = this.selectFileMeshVo.id;
            if (left.ModelShowModel.getInstance().selectShowDisp instanceof left.MaterialModelSprite) {
                $temp.showType = 0;
            }
            if (left.ModelShowModel.getInstance().selectShowDisp instanceof left.MaterialRoleSprite) {
                $temp.showType = 1;
            }
            var $file: File = new File([JSON.stringify($temp)], "ossfile.txt");
            this.upOssFile($file, "shadertree/texturelist/config/" + this.selectFileMeshVo.id + ".txt", () => {
                console.log("文件上传成功", $file.name);
            })


        }
       
        public upMaterialTreeToWeb($temp: MaterialTree) {

            if (this.selectFileMeshVo) {
                this.saveConfigToWeb()
                this.upListIcon();
                this.saveModelToWeb();
                this.saveRoleToWeb();
                for (var i: number = 0; $temp.data && i < $temp.data.length; i++) {
                    var $vo: any = $temp.data[i];
                    if ($vo.type == materialui.NodeTree.TEX || $vo.type == materialui.NodeTree.TEX3D || $vo.type == materialui.NodeTree.TEXCUBE) {
                        var $img: any = TextureManager.getInstance().getImgResByurl(Scene_data.fileRoot + $vo.data.url)
                        if ($img) { //新加的图
                            var $upfile: File = this.dataURLtoFile($img.src, $vo.data.url);
                            var $newUrl: string = "uppic/" + this.selectFileMeshVo.id + "/" + $upfile.name
                            filemodel.FileModel.getInstance().upOssFile($upfile, "shadertree/" + $newUrl, () => {
                                console.log("文件上传成功");
                            })
                            $vo.data.url = $newUrl;
                        } else {

                        }
                    }
                }
                var $byte: Pan3d.Pan3dByteArray = new Pan3d.Pan3dByteArray();
                $byte.writeUTF(JSON.stringify({ data: $temp.data }))
                var $file: File = new File([$byte.buffer], "ossfile.txt");
               this.upOssFile($file, "shadertree/texturelist/" + this.selectFileMeshVo.id + ".txt", () => {
                    console.log("文件上传成功");
                })
            } else {
               // alert("还没有先文件")
            }

        }
        private dataURLtoFile(dataurl: string, filename: string): File {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        }

        private onlySave: MaterialTree

        private uploadFile($file: File, $filename: string, $bfun: Function = null): void {
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
                $bfun && $bfun()
            }).catch(function (err) {
                console.log(err);
            });
        }
        public static WEB_SEVER_EVENT_AND_BACK(webname: string, postStr: string, $bfun: Function = null): void {
            webname = webname.replace(/\s+/g, "");
            var $obj: any = new Object();
            $obj.webname = webname;
            $obj.postStr = postStr.replace(/\s+/g, "");
            $obj.fun = $bfun;
            this.isPostWeboffwx(webname, postStr, $bfun)
        }
        private static webseverurl: string
        //网页模式的WEB请求
        private static isPostWeboffwx(webname: string, postStr: string, $bfun: Function = null) {
            var ajax: XMLHttpRequest = new XMLHttpRequest();
            var url: string = FileModel.webseverurl + webname

            let timestamp: string = String(Pan3d.TimeUtil.getTimer());
            let keystr: string = "ABC"
            let self_sign: string = hex_md5(postStr + timestamp + keystr)

            ajax.open("post", url, true);
            ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            ajax.setRequestHeader("timestamp", timestamp)
            ajax.setRequestHeader("sign", self_sign)
            ajax.onreadystatechange = function () {
                if (ajax.readyState == 4) {
                    if (ajax.status == 200) {
                        $bfun ? $bfun({ data: JSON.parse(ajax.responseText) }) : null
                    }
                    else {
                        console.log("HTTP请求错误！错误码：" + ajax.status);
                        $bfun ? $bfun(null) : null
                    }
                }

            }
            ajax.send(postStr);
        }

    }
}