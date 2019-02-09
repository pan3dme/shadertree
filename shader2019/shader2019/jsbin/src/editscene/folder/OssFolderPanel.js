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
var ossfolder;
(function (ossfolder) {
    var UIRenderComponent = Pan3d.UIRenderComponent;
    var InteractiveEvent = Pan3d.InteractiveEvent;
    var TextAlign = Pan3d.TextAlign;
    var Rectangle = Pan3d.Rectangle;
    var UIManager = Pan3d.UIManager;
    var LabelTextFont = Pan3d.LabelTextFont;
    var Dis2DUIContianerPanel = Pan3d.Dis2DUIContianerPanel;
    var Disp2DBaseText = Pan3d.Disp2DBaseText;
    var UIMask = Pan3d.UIMask;
    var UIAtlas = Pan3d.UIAtlas;
    var MouseType = Pan3d.MouseType;
    var OssListFile = /** @class */ (function () {
        function OssListFile() {
        }
        return OssListFile;
    }());
    ossfolder.OssListFile = OssListFile;
    var FolderMeshVo = /** @class */ (function (_super) {
        __extends(FolderMeshVo, _super);
        function FolderMeshVo() {
            return _super.call(this) || this;
        }
        Object.defineProperty(FolderMeshVo.prototype, "name", {
            set: function (value) {
                this.needDraw = true;
            },
            enumerable: true,
            configurable: true
        });
        FolderMeshVo.prototype.destory = function () {
            this.pos = null;
            this.needDraw = null;
            this.clear = true;
        };
        return FolderMeshVo;
    }(Pan3d.baseMeshVo));
    ossfolder.FolderMeshVo = FolderMeshVo;
    var FolderName = /** @class */ (function (_super) {
        __extends(FolderName, _super);
        function FolderName() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FolderName.prototype.makeData = function () {
            this.folderMeshVo = this.data;
            if (this.folderMeshVo) {
                var $uiRec = this.parent.uiAtlas.getRec(this.textureStr);
                this.parent.uiAtlas.ctx = UIManager.getInstance().getContext2D($uiRec.pixelWitdh, $uiRec.pixelHeight, false);
                this.parent.uiAtlas.ctx.clearRect(0, 1, $uiRec.pixelWitdh, $uiRec.pixelHeight);
                LabelTextFont.writeSingleLabelToCtx(this.parent.uiAtlas.ctx, "[9c9c9c]" + this.folderMeshVo.ossListFile.baseFile.name, 12, 35, 5, TextAlign.LEFT);
                if (this.folderMeshVo.ossListFile.isOpen) {
                    this.parent.uiAtlas.ctx.drawImage(OssFolderPanel.imgBaseDic["icon_PanRight"], 2, 5, 10, 10);
                    this.parent.uiAtlas.ctx.drawImage(OssFolderPanel.imgBaseDic["icon_FolderOpen_dark"], 15, 2, 18, 16);
                }
                else {
                    this.parent.uiAtlas.ctx.drawImage(OssFolderPanel.imgBaseDic["icon_PanUp"], 3, 5, 10, 10);
                    this.parent.uiAtlas.ctx.drawImage(OssFolderPanel.imgBaseDic["icon_FolderClosed_dark"], 15, 2, 18, 16);
                }
                TextureManager.getInstance().updateTexture(this.parent.uiAtlas.texture, $uiRec.pixelX, $uiRec.pixelY, this.parent.uiAtlas.ctx);
            }
        };
        FolderName.prototype.update = function () {
            this.folderMeshVo = this.data;
            if (this.folderMeshVo) {
                if (this.folderMeshVo.needDraw) {
                    this.makeData();
                    this.folderMeshVo.needDraw = false;
                }
                if (this.folderMeshVo.pos) {
                    this.ui.x = this.folderMeshVo.pos.x;
                    this.ui.y = this.folderMeshVo.pos.y;
                }
                if (this.folderMeshVo.clear) {
                    this.ui.parent.removeChild(this.ui);
                    this._data = null;
                }
            }
        };
        return FolderName;
    }(Disp2DBaseText));
    ossfolder.FolderName = FolderName;
    var OssFolderPanel = /** @class */ (function (_super) {
        __extends(OssFolderPanel, _super);
        function OssFolderPanel() {
            var _this = _super.call(this, FolderName, new Rectangle(0, 0, 128, 20), 50) || this;
            _this.folderCellHeight = 20;
            _this.left = 300;
            _this._bottomRender = new UIRenderComponent;
            _this.addRender(_this._bottomRender);
            _this.removeRender(_this._baseRender);
            _this.addRender(_this._baseRender);
            _this._topRender = new UIRenderComponent;
            _this.addRender(_this._topRender);
            _this.pageRect = new Rectangle(0, 0, 200, 200);
            _this.loadAssetImg(function () {
                _this._bottomRender.uiAtlas = new UIAtlas();
                _this._bottomRender.uiAtlas.setInfo("ui/folder/folder.txt", "ui/folder/folder.png", function () { _this.loadConfigCom(); });
                Pan3d.TimeUtil.addFrameTick(function (t) { _this.update(t); });
            });
            return _this;
        }
        OssFolderPanel.prototype.loadAssetImg = function (bfun) {
            OssFolderPanel.imgBaseDic = {};
            var item = [];
            item.push("icon_FolderClosed_dark");
            item.push("icon_FolderOpen_dark");
            item.push("icon_PanRight");
            item.push("icon_PanUp");
            var finishNum = 0;
            for (var i = 0; i < item.length; i++) {
                this.loadTempOne(item[i], function () {
                    finishNum++;
                    if (finishNum >= item.length) {
                        bfun();
                    }
                });
            }
        };
        OssFolderPanel.prototype.loadTempOne = function (name, bfun) {
            var tempImg = makeImage();
            OssFolderPanel.imgBaseDic[name] = tempImg;
            tempImg.onload = function () {
                bfun();
            };
            tempImg.url = Scene_data.fileuiRoot + "ui/folder/pic/" + name + ".png";
            tempImg.src = Scene_data.fileuiRoot + "ui/folder/pic/" + name + ".png";
        };
        OssFolderPanel.prototype.update = function (t) {
            _super.prototype.update.call(this, t);
        };
        OssFolderPanel.prototype.panelEventChanger = function (value) {
            this.perentRect = value;
            if (this.pageRect) {
                this.pageRect.height = value.height;
                this.pageRect.width = Math.min(this.pageRect.width, value.width - 200);
                this.left = value.x;
                this.top = value.y;
                this.refrishSize();
            }
        };
        OssFolderPanel.prototype.getPageRect = function () {
            return this.pageRect;
        };
        OssFolderPanel.prototype.mouseDown = function (evt) {
            this.mouseIsDown = true;
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.stageMouseMove, this);
        };
        OssFolderPanel.prototype.stageMouseMove = function (evt) {
            this.mouseIsDown = false;
        };
        OssFolderPanel.prototype.mouseUp = function (evt) {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.stageMouseMove, this);
            if (this.mouseIsDown) {
                for (var i = 0; i < this._uiItem.length; i++) {
                    var $vo = this._uiItem[i];
                    if ($vo.ui == evt.target) {
                        if ((evt.x - this.left) - $vo.ui.x < 20) {
                            $vo.folderMeshVo.ossListFile.isOpen = !$vo.folderMeshVo.ossListFile.isOpen;
                            if ($vo.folderMeshVo.ossListFile.isOpen) {
                                this.pushChidrenDic($vo);
                            }
                            else {
                                this.clearChildern($vo.folderMeshVo); //将要关闭
                            }
                        }
                        else {
                            if (!$vo.folderMeshVo.ossListFile.isOpen) {
                                this.pushChidrenDic($vo);
                            }
                            $vo.folderMeshVo.ossListFile.isOpen = true;
                            Pan3d.ModuleEventManager.dispatchEvent(new folder.FolderEvent(folder.FolderEvent.LIST_DIS_ALL_FILE), $vo.folderMeshVo.ossListFile.baseFile.path);
                        }
                        $vo.folderMeshVo.needDraw = true;
                    }
                }
                this.refrishFolder();
            }
        };
        OssFolderPanel.prototype.resetHideDic = function (arr) {
            for (var i = 0; arr && i < arr.length; i++) {
                arr[i].clear = false;
                arr[i].pos = new Vector3D();
                this.showTemp(arr[i]);
                this.resetHideDic(arr[i].childItem);
            }
        };
        OssFolderPanel.prototype.pushChidrenDic = function ($folderName) {
            var _this = this;
            if ($folderName.folderMeshVo.childItem) {
                console.log("已经有了，直接显示就行");
                this.resetHideDic($folderName.folderMeshVo.childItem);
            }
            else {
                var pathurl = $folderName.folderMeshVo.ossListFile.baseFile.path;
                filemodel.FolderModel.getFolderArr(pathurl, function (value) {
                    if (!$folderName.folderMeshVo.childItem) {
                        $folderName.folderMeshVo.childItem = [];
                        for (var i = 0; value && i < value.length; i++) {
                            if (value[i].isFolder) {
                                var $vo = _this.getCharNameMeshVo(value[i]);
                                $vo.pos = new Vector3D(0, i * 15, 0);
                                $folderName.folderMeshVo.childItem.push($vo);
                            }
                        }
                        _this.refrishFolder();
                    }
                    else {
                        console.log("已获取过，注意可能是网络问题");
                    }
                });
            }
        };
        OssFolderPanel.prototype.clearChildern = function ($folderMeshVo) {
            if ($folderMeshVo.childItem) {
                for (var i = 0; i < $folderMeshVo.childItem.length; i++) {
                    var $vo = $folderMeshVo.childItem[i];
                    $vo.destory();
                    console.log("移除", $vo);
                    this.clearChildern($vo);
                }
            }
        };
        OssFolderPanel.prototype.onMouseWheel = function ($evt) {
            var $slectUi = UIManager.getInstance().getObjectsUnderPoint(new Vector2D($evt.x, $evt.y));
            if ($slectUi && $slectUi.parent == this) {
                if (this.a_scroll_bar.parent) {
                    this.a_scroll_bar.y -= $evt.wheelDelta / 10;
                    this.resize();
                    this.refrishFolder();
                }
            }
        };
        OssFolderPanel.prototype.loadConfigCom = function () {
            var _this = this;
            this._topRender.uiAtlas = this._bottomRender.uiAtlas;
            this.folderMask = new UIMask();
            this.folderMask.level = 1;
            this.addMask(this.folderMask);
            this._baseRender.mask = this.folderMask;
            this.fileItem = [];
            for (var i = 0; i < this._uiItem.length; i++) {
                this._uiItem[i].ui.addEventListener(InteractiveEvent.Down, this.mouseDown, this);
                this._uiItem[i].ui.addEventListener(InteractiveEvent.Up, this.mouseUp, this);
            }
            document.addEventListener(MouseType.MouseWheel, function ($evt) { _this.onMouseWheel($evt); });
            this.a_bg = this.addEvntBut("a_bg", this._bottomRender);
            this.a_win_tittle = this.addChild(this._topRender.getComponent("a_win_tittle"));
            this.a_win_tittle.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);
            this.a_rigth_line = this.addChild(this._topRender.getComponent("a_rigth_line"));
            this.a_rigth_line.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);
            this.a_bottom_line = this.addChild(this._topRender.getComponent("a_bottom_line"));
            this.a_bottom_line.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);
            this.a_right_bottom = this.addChild(this._topRender.getComponent("a_right_bottom"));
            this.a_right_bottom.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);
            this.a_scroll_bar = this.addChild(this._topRender.getComponent("a_scroll_bar"));
            this.a_scroll_bar.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);
            this.a_scroll_bar.y = this.folderMask.y;
            this.setUiListVisibleByItem([this.a_bottom_line, this.a_right_bottom, this.a_bg, this.a_win_tittle], this.canMoveTittle);
            this.refrishSize();
            filemodel.FolderModel.getFolderArr("upfile/shadertree/", function (value) {
                for (var i = 0; i < value.length; i++) {
                    if (value[i].isFolder) {
                        var $vo = _this.getCharNameMeshVo(value[i]);
                        $vo.pos = new Vector3D(0, i * 15, 0);
                        _this.fileItem.push($vo);
                    }
                }
                _this.refrishFolder();
            });
        };
        OssFolderPanel.prototype.refrishSize = function () {
            if (!this._topRender.uiAtlas) {
                return;
            }
            this.pageRect.width = Math.max(100, this.pageRect.width);
            this.pageRect.height = Math.max(100, this.pageRect.height);
            this.a_win_tittle.x = 0;
            this.a_win_tittle.y = 0;
            this.a_win_tittle.width = this.pageRect.width;
            this.folderMask.y = this.a_win_tittle.height;
            this.folderMask.x = 0;
            this.folderMask.width = this.pageRect.width - this.a_rigth_line.width;
            this.folderMask.height = this.pageRect.height - this.a_win_tittle.height - this.a_bottom_line.height;
            this.a_bg.x = 0;
            this.a_bg.y = 0;
            this.a_bg.width = this.pageRect.width;
            this.a_bg.height = this.pageRect.height;
            this.a_rigth_line.x = this.pageRect.width - this.a_rigth_line.width;
            this.a_rigth_line.y = this.a_win_tittle.height;
            this.a_rigth_line.height = this.pageRect.height - this.a_win_tittle.height - this.a_right_bottom.height;
            this.a_bottom_line.x = 0;
            this.a_bottom_line.y = this.pageRect.height - this.a_bottom_line.height;
            this.a_bottom_line.width = this.pageRect.width - this.a_right_bottom.width;
            this.a_right_bottom.x = this.pageRect.width - this.a_right_bottom.width;
            this.a_right_bottom.y = this.pageRect.height - this.a_right_bottom.height;
            this.a_scroll_bar.x = this.folderMask.x + this.folderMask.width - this.a_scroll_bar.width;
            this.resize();
            this.refrishFolder();
        };
        OssFolderPanel.prototype.tittleMouseDown = function (evt) {
            this.mouseMoveTaget = evt.target;
            this.lastMousePos = new Vector2D(evt.x, evt.y);
            switch (this.mouseMoveTaget) {
                case this.a_win_tittle:
                    this.lastPagePos = new Vector2D(this.left, this.top);
                    break;
                case this.a_rigth_line:
                case this.a_bottom_line:
                case this.a_right_bottom:
                    this.lastPagePos = new Vector2D(this.pageRect.width, this.pageRect.height);
                    break;
                case this.a_scroll_bar:
                    this.lastPagePos = new Vector2D(0, this.a_scroll_bar.y);
                    break;
                default:
                    console.log("nonono");
                    break;
            }
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.mouseOnTittleMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.tittleMouseUp, this);
        };
        OssFolderPanel.prototype.tittleMouseUp = function (evt) {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.mouseOnTittleMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.tittleMouseUp, this);
        };
        OssFolderPanel.prototype.mouseOnTittleMove = function (evt) {
            switch (this.mouseMoveTaget) {
                case this.a_win_tittle:
                    this.left = this.lastPagePos.x + (evt.x - this.lastMousePos.x);
                    this.top = this.lastPagePos.y + (evt.y - this.lastMousePos.y);
                    break;
                case this.a_rigth_line:
                    this.pageRect.width = this.lastPagePos.x + (evt.x - this.lastMousePos.x);
                    break;
                case this.a_bottom_line:
                    this.pageRect.height = this.lastPagePos.y + (evt.y - this.lastMousePos.y);
                    break;
                case this.a_right_bottom:
                    this.pageRect.width = this.lastPagePos.x + (evt.x - this.lastMousePos.x);
                    this.pageRect.height = this.lastPagePos.y + (evt.y - this.lastMousePos.y);
                    break;
                case this.a_scroll_bar:
                    this.a_scroll_bar.y = this.lastPagePos.y + (evt.y - this.lastMousePos.y);
                    this.a_scroll_bar.y = Math.max(this.a_scroll_bar.y, this.folderMask.y);
                    this.a_scroll_bar.y = Math.min(this.a_scroll_bar.y, this.folderMask.y + this.folderMask.height - this.a_scroll_bar.height);
                    console.log(this.a_scroll_bar.y);
                    break;
                default:
                    console.log("nonono");
                    break;
            }
            this.pageRect.width = Math.min(this.pageRect.width, this.perentRect.width - 200);
            this.refrishSize();
            Pan3d.ModuleEventManager.dispatchEvent(new folder.FolderEvent(folder.FolderEvent.FILE_LIST_PANEL_CHANG), this.perentRect);
        };
        OssFolderPanel.prototype.getCharNameMeshVo = function (value) {
            var $vo = new FolderMeshVo;
            $vo.ossListFile = new OssListFile;
            $vo.ossListFile.baseFile = value;
            this.showTemp($vo);
            return $vo;
        };
        OssFolderPanel.prototype.refrishFolder = function () {
            OssFolderPanel.listTy = 25;
            this.disChiendren(this.fileItem);
            var contentH = OssFolderPanel.listTy;
            var moveTy = 0;
            if (contentH > this.folderMask.height) {
                this.setUiListVisibleByItem([this.a_scroll_bar], true);
                this.a_scroll_bar.height = (this.folderMask.height / contentH) * this.folderMask.height;
                this.a_scroll_bar.y = Math.min(this.a_scroll_bar.y, this.folderMask.height + this.folderMask.y - this.a_scroll_bar.height);
                this.a_scroll_bar.y = Math.max(this.a_scroll_bar.y, this.folderMask.y);
                var nnn = (this.a_scroll_bar.y - this.folderMask.y) / (this.folderMask.height - this.a_scroll_bar.height);
                moveTy = (this.folderMask.height - contentH) * nnn;
            }
            else {
                this.setUiListVisibleByItem([this.a_scroll_bar], false);
                moveTy = 0;
            }
            this.moveAllTy(this.fileItem, moveTy);
        };
        OssFolderPanel.prototype.moveAllTy = function (arr, ty) {
            if (ty === void 0) { ty = 0; }
            for (var i = 0; arr && i < arr.length; i++) {
                arr[i].pos.y += ty;
                if (arr[i].ossListFile.isOpen) {
                    this.moveAllTy(arr[i].childItem, ty);
                }
            }
        };
        OssFolderPanel.prototype.disChiendren = function (arr, tx) {
            if (tx === void 0) { tx = 0; }
            for (var i = 0; arr && i < arr.length; i++) {
                arr[i].pos.x = tx;
                arr[i].pos.y = OssFolderPanel.listTy;
                OssFolderPanel.listTy += 20;
                if (arr[i].ossListFile.isOpen) {
                    this.disChiendren(arr[i].childItem, tx + 20);
                }
            }
        };
        return OssFolderPanel;
    }(Dis2DUIContianerPanel));
    ossfolder.OssFolderPanel = OssFolderPanel;
})(ossfolder || (ossfolder = {}));
//# sourceMappingURL=OssFolderPanel.js.map