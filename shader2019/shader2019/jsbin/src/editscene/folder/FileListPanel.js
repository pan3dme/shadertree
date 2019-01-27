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
    var InteractiveEvent = Pan3d.InteractiveEvent;
    var TextAlign = Pan3d.TextAlign;
    var Rectangle = Pan3d.Rectangle;
    var UIManager = Pan3d.UIManager;
    var LabelTextFont = Pan3d.LabelTextFont;
    var Dis2DUIContianerPanel = Pan3d.Dis2DUIContianerPanel;
    var Disp2DBaseText = Pan3d.Disp2DBaseText;
    var UIMask = Pan3d.UIMask;
    var UIAtlas = Pan3d.UIAtlas;
    var FileXmlVo = /** @class */ (function () {
        function FileXmlVo() {
        }
        FileXmlVo.makeBaseXml = function (value) {
            var obj = JSON.parse(value);
            this.item = new Array;
            for (var i = 0; i < obj.list.length; i++) {
                var vo = new FileXmlVo();
                vo.id = obj.list[i].id;
                vo.name = obj.list[i].name;
                vo.perent = obj.list[i].perent;
                vo.isOpen = false;
                this.item.push(vo);
            }
        };
        //获取所有打开可显示的列表
        FileXmlVo.getListItem = function (value) {
            var arr = new Array;
            for (var i = 0; i < this.item.length; i++) {
                if (this.isShow(this.item[i])) {
                    arr.push(this.item[i]);
                }
            }
            return arr;
        };
        //通过ID获取对应的层级
        FileXmlVo.getFileSonLayer = function (value) {
            var num = 0;
            for (var i = 0; i < this.item.length; i++) {
                if (this.item[i].id == value) {
                    if (this.item[i].perent != -1) {
                        num++;
                        num += this.getFileSonLayer(this.item[i].perent);
                    }
                }
            }
            return num;
        };
        FileXmlVo.getFileCellHeight = function (id) {
            var num = 1;
            for (var i = 0; i < this.item.length; i++) {
                if (this.item[i].perent == id) {
                    if (this.item[i].isOpen) {
                        num += this.getFileCellHeight(this.item[i].id);
                    }
                    else {
                        num += 1;
                    }
                }
            }
            return num;
        };
        //判断是否在显示列表中
        FileXmlVo.isShow = function (vo) {
            if (vo.perent == -1) { //根目录
                return true;
            }
            for (var i = 0; i < this.item.length; i++) {
                if (this.item[i].id == vo.perent) {
                    if (this.item[i].isOpen) {
                        return this.isShow(this.item[i]);
                    }
                    else {
                        return false;
                    }
                }
            }
            console.log("不应该到这里");
            return false;
        };
        return FileXmlVo;
    }());
    filelist.FileXmlVo = FileXmlVo;
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
            this.fileListMeshVo = this.data;
            if (this.fileListMeshVo) {
                var $uiRec = this.parent.uiAtlas.getRec(this.textureStr);
                this.parent.uiAtlas.ctx = UIManager.getInstance().getContext2D($uiRec.pixelWitdh, $uiRec.pixelHeight, false);
                this.parent.uiAtlas.ctx.clearRect(0, 1, $uiRec.pixelWitdh, $uiRec.pixelHeight);
                LabelTextFont.writeSingleLabelToCtx(this.parent.uiAtlas.ctx, "[9c9c9c]" + this.fileListMeshVo.fileXmlVo.name, 12, 35, 5, TextAlign.LEFT);
                if (this.fileListMeshVo.fileXmlVo.isOpen) {
                    this.parent.uiAtlas.ctx.drawImage(FileListPanel.imgBaseDic["icon_PanRight"], 2, 5, 10, 10);
                    this.parent.uiAtlas.ctx.drawImage(FileListPanel.imgBaseDic["icon_FolderOpen_dark"], 15, 2, 18, 16);
                }
                else {
                    this.parent.uiAtlas.ctx.drawImage(FileListPanel.imgBaseDic["icon_PanUp"], 3, 5, 10, 10);
                    this.parent.uiAtlas.ctx.drawImage(FileListPanel.imgBaseDic["icon_FolderClosed_dark"], 15, 2, 18, 16);
                }
                TextureManager.getInstance().updateTexture(this.parent.uiAtlas.texture, $uiRec.pixelX, $uiRec.pixelY, this.parent.uiAtlas.ctx);
            }
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
            var _this = _super.call(this, FileListName, new Rectangle(0, 0, 128, 20), 50) || this;
            _this.folderCellHeight = 20;
            _this.left = 300;
            _this._bottomRender = new UIRenderComponent;
            _this.addRender(_this._bottomRender);
            _this.removeRender(_this._baseRender);
            _this.addRender(_this._baseRender);
            _this._topRender = new UIRenderComponent;
            _this.addRender(_this._topRender);
            Pan3d.TimeUtil.addTimeOut(1000, function () {
            });
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
                for (var i = 0; i < this._uiItem.length; i++) {
                    var $vo = this._uiItem[i];
                    if ($vo.ui == evt.target) {
                        if ((evt.x - this.left) - $vo.ui.x < 20) {
                            $vo.fileListMeshVo.fileXmlVo.isOpen = !$vo.fileListMeshVo.fileXmlVo.isOpen;
                            $vo.fileListMeshVo.needDraw = true;
                        }
                        else {
                            $vo.fileListMeshVo.fileXmlVo.isOpen = true;
                            $vo.fileListMeshVo.needDraw = true;
                            console.log("显示文件夹内容", $vo.fileListMeshVo.fileXmlVo);
                        }
                    }
                }
                this.refrishFolder();
            }
        };
        FileListPanel.prototype.loadConfigCom = function () {
            this._topRender.uiAtlas = this._bottomRender.uiAtlas;
            this.pageRect = new Rectangle(0, 0, 200, 200);
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
            this.refrishSize();
            this.a_scroll_bar.y = this.folderMask.y;
            this.loadeFileXml();
        };
        FileListPanel.prototype.refrishSize = function () {
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
            this.refrishFoldeUiPos();
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
        FileListPanel.prototype.loadeFileXml = function () {
            var _this = this;
            LoadManager.getInstance().load(Scene_data.fileuiRoot + "folder.txt", LoadManager.XML_TYPE, function ($xmlStr) {
                FileXmlVo.makeBaseXml($xmlStr);
                _this.refrishFolder();
            });
        };
        FileListPanel.prototype.getCharNameMeshVo = function (value) {
            var $vo = new FileListMeshVo;
            $vo.fileXmlVo = value;
            this.showTemp($vo);
            return $vo;
        };
        FileListPanel.prototype.refrishFolder = function () {
            var $item = FileXmlVo.getListItem(-1);
            this.removeHideItem($item);
            this.addNewFolderNameToItem($item);
            this.resetChildItemAll(); //重算子目录
            this.refrishFoldeUiPos();
        };
        FileListPanel.prototype.refrishFoldeUiPos = function () {
            FileListPanel.tySkip = 1;
            this.mathFileCellHeight(0);
            var contentH = FileListPanel.tySkip * this.folderCellHeight;
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
                var layer = FileXmlVo.getFileSonLayer(this.fileItem[i].fileXmlVo.id);
                this.fileItem[i].pos.y = this.folderCellHeight * this.fileItem[i].ty + this.folderMask.y + moveTy;
                this.fileItem[i].pos.x = 20 * layer;
            }
        };
        FileListPanel.prototype.isOpenByID = function (id) {
            for (var i = 0; i < this.fileItem.length; i++) {
                if (this.fileItem[i].fileXmlVo.id == id && this.fileItem[i].fileXmlVo.isOpen) {
                    return true;
                }
            }
            return false;
        };
        FileListPanel.prototype.mathFileCellHeight = function (id) {
            if (this.isOpenByID(id)) {
                for (var i = 0; i < this.fileItem.length; i++) {
                    if (this.fileItem[i].fileXmlVo.perent == id) {
                        this.fileItem[i].ty = FileListPanel.tySkip;
                        FileListPanel.tySkip++;
                        this.mathFileCellHeight(this.fileItem[i].fileXmlVo.id);
                    }
                }
            }
        };
        FileListPanel.prototype.resetChildItemAll = function () {
            for (var i = 0; i < this.fileItem.length; i++) {
                this.fileItem[i].childItem = [];
                this.fileItem[i].ty = 0;
                for (var j = 0; j < this.fileItem.length; j++) {
                    if (this.fileItem[j].fileXmlVo.perent == this.fileItem[i].fileXmlVo.id) {
                        this.fileItem[i].childItem.push(this.fileItem[j]);
                    }
                }
            }
        };
        //添加新进来的对象
        FileListPanel.prototype.addNewFolderNameToItem = function (value) {
            for (var i = 0; i < value.length; i++) {
                var needAdd = true;
                for (var j = 0; j < this.fileItem.length; j++) {
                    if (this.fileItem[j].fileXmlVo == value[i]) {
                        needAdd = false;
                    }
                }
                if (needAdd) {
                    var $vo = this.getCharNameMeshVo(value[i]);
                    $vo.pos = new Vector3D(0, i * 15, 0);
                    this.fileItem.push($vo);
                }
            }
        };
        //移除不显示的对象
        FileListPanel.prototype.removeHideItem = function (value) {
            for (var i = 0; i < this.fileItem.length; i++) {
                var needClear = true;
                for (var j = 0; j < value.length; j++) {
                    if (this.fileItem[i].fileXmlVo == value[j]) {
                        needClear = false;
                    }
                }
                if (needClear) {
                    var temp = this.fileItem[i];
                    temp.destory();
                    this.fileItem.splice(i, 1);
                    i--;
                }
            }
        };
        return FileListPanel;
    }(Dis2DUIContianerPanel));
    filelist.FileListPanel = FileListPanel;
})(filelist || (filelist = {}));
//# sourceMappingURL=FileListPanel.js.map