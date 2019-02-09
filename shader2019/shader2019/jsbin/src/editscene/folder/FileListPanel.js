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
var filelist;
(function (filelist) {
    var UIRenderComponent = Pan3d.UIRenderComponent;
    var ColorType = Pan3d.ColorType;
    var InteractiveEvent = Pan3d.InteractiveEvent;
    var TextAlign = Pan3d.TextAlign;
    var Rectangle = Pan3d.Rectangle;
    var UIManager = Pan3d.UIManager;
    var LabelTextFont = Pan3d.LabelTextFont;
    var Dis2DUIContianerPanel = Pan3d.Dis2DUIContianerPanel;
    var Disp2DBaseText = Pan3d.Disp2DBaseText;
    var UIMask = Pan3d.UIMask;
    var UIAtlas = Pan3d.UIAtlas;
    var SampleFileVo = /** @class */ (function () {
        function SampleFileVo() {
        }
        return SampleFileVo;
    }());
    filelist.SampleFileVo = SampleFileVo;
    var FileListMeshVo = /** @class */ (function (_super) {
        __extends(FileListMeshVo, _super);
        function FileListMeshVo() {
            var _this = _super.call(this) || this;
            _this.cellHeightNum = 1;
            return _this;
        }
        Object.defineProperty(FileListMeshVo.prototype, "name", {
            get: function () {
                return this._name;
            },
            set: function (value) {
                this._name = value;
                this.needDraw = true;
            },
            enumerable: true,
            configurable: true
        });
        FileListMeshVo.prototype.destory = function () {
            this.pos = null;
            this._name = null;
            this.needDraw = null;
            this.clear = true;
        };
        return FileListMeshVo;
    }(Pan3d.baseMeshVo));
    filelist.FileListMeshVo = FileListMeshVo;
    var FileListName = /** @class */ (function (_super) {
        __extends(FileListName, _super);
        function FileListName() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FileListName.prototype.makeData = function () {
            var _this = this;
            this.fileListMeshVo = this.data;
            if (this.fileListMeshVo) {
                var fileVo = this.fileListMeshVo.fileXmlVo.data;
                switch (fileVo.suffix) {
                    case "jpg":
                    case "png":
                        LoadManager.getInstance().load(Scene_data.fileRoot + fileVo.path, LoadManager.IMG_TYPE, function ($img) {
                            _this.drawFileIconName($img, fileVo.name);
                        });
                        break;
                    default:
                        this.drawFileIconName(FileListPanel.imgBaseDic["icon_Folder_64x"], fileVo.name);
                        break;
                }
            }
        };
        FileListName.prototype.drawFileIconName = function ($img, name) {
            var $uiRec = this.parent.uiAtlas.getRec(this.textureStr);
            this.parent.uiAtlas.ctx = UIManager.getInstance().getContext2D($uiRec.pixelWitdh, $uiRec.pixelHeight, false);
            this.parent.uiAtlas.ctx.clearRect(0, 1, $uiRec.pixelWitdh, $uiRec.pixelHeight);
            this.parent.uiAtlas.ctx.drawImage($img, 7, 0, 50, 50);
            LabelTextFont.writeSingleLabelToCtx(this.parent.uiAtlas.ctx, "[9c9c9c]" + name, 12, 0, 50, TextAlign.CENTER);
            TextureManager.getInstance().updateTexture(this.parent.uiAtlas.texture, $uiRec.pixelX, $uiRec.pixelY, this.parent.uiAtlas.ctx);
        };
        FileListName.prototype.update = function () {
            this.fileListMeshVo = this.data;
            if (this.fileListMeshVo) {
                if (this.fileListMeshVo.needDraw) {
                    this.makeData();
                    this.fileListMeshVo.needDraw = false;
                }
                if (this.fileListMeshVo.pos) {
                    this.ui.x = this.fileListMeshVo.pos.x;
                    this.ui.y = this.fileListMeshVo.pos.y;
                }
                if (this.fileListMeshVo.clear) {
                    this.ui.parent.removeChild(this.ui);
                    this._data = null;
                }
            }
        };
        return FileListName;
    }(Disp2DBaseText));
    filelist.FileListName = FileListName;
    var FileListPanel = /** @class */ (function (_super) {
        __extends(FileListPanel, _super);
        function FileListPanel() {
            var _this = _super.call(this, FileListName, new Rectangle(0, 0, 64, 64), 50) || this;
            _this._bottomRender = new UIRenderComponent;
            _this.addRender(_this._bottomRender);
            _this.removeRender(_this._baseRender);
            _this.addRender(_this._baseRender);
            _this._topRender = new UIRenderComponent;
            _this.addRender(_this._topRender);
            _this.pageRect = new Rectangle(0, 0, 500, 350);
            _this.loadAssetImg(function () {
                _this._bottomRender.uiAtlas = new UIAtlas();
                _this._bottomRender.uiAtlas.setInfo("ui/folder/folder.txt", "ui/folder/folder.png", function () { _this.loadConfigCom(); });
                Pan3d.TimeUtil.addFrameTick(function (t) { _this.update(t); });
            });
            return _this;
        }
        FileListPanel.prototype.loadAssetImg = function (bfun) {
            FileListPanel.imgBaseDic = {};
            var item = [];
            item.push("icon_FolderClosed_dark");
            item.push("icon_FolderOpen_dark");
            item.push("icon_PanRight");
            item.push("icon_Folder_64x");
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
        FileListPanel.prototype.loadTempOne = function (name, bfun) {
            var tempImg = makeImage();
            FileListPanel.imgBaseDic[name] = tempImg;
            tempImg.onload = function () {
                bfun();
            };
            tempImg.url = Scene_data.fileuiRoot + "ui/folder/pic/" + name + ".png";
            tempImg.src = Scene_data.fileuiRoot + "ui/folder/pic/" + name + ".png";
        };
        FileListPanel.prototype.update = function (t) {
            _super.prototype.update.call(this, t);
        };
        FileListPanel.prototype.mouseDown = function (evt) {
            this.mouseIsDown = true;
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.stageMouseMove, this);
        };
        FileListPanel.prototype.stageMouseMove = function (evt) {
            this.mouseIsDown = false;
        };
        FileListPanel.prototype.mouseUp = function (evt) {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.stageMouseMove, this);
            if (this.mouseIsDown) {
                var vo = this.getItemVoByUi(evt.target);
                if (vo && vo.fileListMeshVo.fileXmlVo.data.isFolder) {
                    console.log(vo.fileListMeshVo.fileXmlVo.data.path);
                    this.refrishPath(vo.fileListMeshVo.fileXmlVo.data.path);
                }
            }
        };
        //移除不显示的对象
        FileListPanel.prototype.clearListAll = function () {
            while (this.fileItem.length) {
                var vo = this.fileItem.pop();
                vo.destory();
            }
        };
        FileListPanel.prototype.refrishPath = function (pathstr) {
            var _this = this;
            this.a_path_tittle_txt.x = 10;
            LabelTextFont.writeSingleLabel(this._topRender.uiAtlas, this.a_path_tittle_txt.skinName, ColorType.White9A683F + pathstr, 12, Pan3d.TextAlign.LEFT);
            this.clearListAll();
            filemodel.FolderModel.getFolderArr(pathstr, function (value) {
                for (var i = 0; i < value.length; i++) {
                    var sampleFile = new SampleFileVo;
                    sampleFile.id = i;
                    sampleFile.data = value[i];
                    var $vo = _this.getCharNameMeshVo(sampleFile);
                    $vo.pos = new Vector3D(i * 64, 40, 0);
                    _this.fileItem.push($vo);
                }
                _this.resetSampleFilePos();
            });
        };
        FileListPanel.prototype.getItemVoByUi = function (ui) {
            for (var i = 0; i < this._uiItem.length; i++) {
                var $vo = this._uiItem[i];
                if ($vo.ui == ui) {
                    return $vo;
                }
            }
            return null;
        };
        FileListPanel.prototype.loadConfigCom = function () {
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
            this.a_path_tittle_txt = this.addChild(this._topRender.getComponent("a_path_tittle_txt"));
            this.refrishSize();
            this.a_scroll_bar.y = this.folderMask.y;
            this.refrishPath("upfile/shadertree/");
        };
        FileListPanel.prototype.panelEventChanger = function (value) {
            if (this.pageRect) {
                this.pageRect.height = value.height;
                this.pageRect.width = value.width;
                this.left = value.x;
                this.top = value.y;
                this.refrishSize();
            }
        };
        FileListPanel.prototype.refrishSize = function () {
            if (!this._topRender.uiAtlas) {
                return;
            }
            this.pageRect.width = Math.max(200, this.pageRect.width);
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
            this.resetSampleFilePos();
            this.resize();
            this.setUiListVisibleByItem([this.a_right_bottom, this.a_bottom_line, this.a_bg, this.a_rigth_line, this.a_win_tittle], this.canMoveTittle);
        };
        FileListPanel.prototype.resetSampleFilePos = function () {
            var w = Math.round(this.pageRect.width / 100);
            var contentH = Math.round(this.fileItem.length / w) * 70;
            var moveTy = 0;
            if (contentH > this.folderMask.height) {
                this.setUiListVisibleByItem([this.a_scroll_bar], true);
                this.a_scroll_bar.height = (this.folderMask.height / contentH) * this.folderMask.height;
                this.a_scroll_bar.y = Math.min(this.a_scroll_bar.y, this.folderMask.height + this.folderMask.y - this.a_scroll_bar.height);
                var nnn = (this.a_scroll_bar.y - this.folderMask.y) / (this.folderMask.height - this.a_scroll_bar.height);
                moveTy = (this.folderMask.height - contentH) * nnn;
            }
            else {
                this.setUiListVisibleByItem([this.a_scroll_bar], false);
                moveTy = 0;
            }
            for (var i = 0; i < this.fileItem.length; i++) {
                var vo = this.fileItem[i];
                vo.pos.x = i % w * 100;
                vo.pos.y = Math.floor(i / w) * 70 + this.folderMask.y + moveTy;
            }
        };
        FileListPanel.prototype.tittleMouseDown = function (evt) {
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
        FileListPanel.prototype.tittleMouseUp = function (evt) {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.mouseOnTittleMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.tittleMouseUp, this);
        };
        FileListPanel.prototype.mouseOnTittleMove = function (evt) {
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
                    //  console.log(this.a_scroll_bar.y)
                    break;
                default:
                    console.log("nonono");
                    break;
            }
            this.refrishSize();
        };
        FileListPanel.prototype.refrishFile = function () {
        };
        FileListPanel.prototype.getCharNameMeshVo = function (value) {
            var $vo = new FileListMeshVo;
            $vo.fileXmlVo = value;
            this.showTemp($vo);
            return $vo;
        };
        return FileListPanel;
    }(Dis2DUIContianerPanel));
    filelist.FileListPanel = FileListPanel;
})(filelist || (filelist = {}));
//# sourceMappingURL=FileListPanel.js.map