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
var folder;
(function (folder) {
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
    folder.FileXmlVo = FileXmlVo;
    var FolderMeshVo = /** @class */ (function (_super) {
        __extends(FolderMeshVo, _super);
        function FolderMeshVo() {
            var _this = _super.call(this) || this;
            _this.cellHeightNum = 1;
            return _this;
        }
        Object.defineProperty(FolderMeshVo.prototype, "name", {
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
        FolderMeshVo.prototype.destory = function () {
            this.pos = null;
            this._name = null;
            this.needDraw = null;
            this.clear = true;
        };
        return FolderMeshVo;
    }(Pan3d.baseMeshVo));
    folder.FolderMeshVo = FolderMeshVo;
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
                LabelTextFont.writeSingleLabelToCtx(this.parent.uiAtlas.ctx, "[9c9c9c]" + this.folderMeshVo.fileXmlVo.name, 12, 35, 5, TextAlign.LEFT);
                if (this.folderMeshVo.fileXmlVo.isOpen) {
                    this.parent.uiAtlas.ctx.drawImage(FolderPanel.imgBaseDic["icon_PanRight"], 2, 5, 10, 10);
                    this.parent.uiAtlas.ctx.drawImage(FolderPanel.imgBaseDic["icon_FolderOpen_dark"], 15, 2, 18, 16);
                }
                else {
                    this.parent.uiAtlas.ctx.drawImage(FolderPanel.imgBaseDic["icon_PanUp"], 3, 5, 10, 10);
                    this.parent.uiAtlas.ctx.drawImage(FolderPanel.imgBaseDic["icon_FolderClosed_dark"], 15, 2, 18, 16);
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
    folder.FolderName = FolderName;
    var FolderPanel = /** @class */ (function (_super) {
        __extends(FolderPanel, _super);
        function FolderPanel() {
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
        FolderPanel.prototype.loadAssetImg = function (bfun) {
            FolderPanel.imgBaseDic = {};
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
        FolderPanel.prototype.loadTempOne = function (name, bfun) {
            var tempImg = makeImage();
            FolderPanel.imgBaseDic[name] = tempImg;
            tempImg.onload = function () {
                bfun();
            };
            tempImg.url = Scene_data.fileuiRoot + "ui/folder/pic/" + name + ".png";
            tempImg.src = Scene_data.fileuiRoot + "ui/folder/pic/" + name + ".png";
        };
        FolderPanel.prototype.update = function (t) {
            _super.prototype.update.call(this, t);
        };
        FolderPanel.prototype.panelEventChanger = function (value) {
            if (this.pageRect) {
                this.pageRect.height = value.height;
                this.left = value.x;
                this.top = value.y;
                this.refrishSize();
            }
        };
        FolderPanel.prototype.getPageRect = function () {
            return this.pageRect;
        };
        FolderPanel.prototype.mouseDown = function (evt) {
            this.mouseIsDown = true;
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.stageMouseMove, this);
        };
        FolderPanel.prototype.stageMouseMove = function (evt) {
            this.mouseIsDown = false;
        };
        FolderPanel.prototype.mouseUp = function (evt) {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.stageMouseMove, this);
            if (this.mouseIsDown) {
                for (var i = 0; i < this._uiItem.length; i++) {
                    var $vo = this._uiItem[i];
                    if ($vo.ui == evt.target) {
                        if ((evt.x - this.left) - $vo.ui.x < 20) {
                            $vo.folderMeshVo.fileXmlVo.isOpen = !$vo.folderMeshVo.fileXmlVo.isOpen;
                            $vo.folderMeshVo.needDraw = true;
                        }
                        else {
                            $vo.folderMeshVo.fileXmlVo.isOpen = true;
                            $vo.folderMeshVo.needDraw = true;
                            console.log("显示文件夹内容", $vo.folderMeshVo.fileXmlVo);
                        }
                    }
                }
                this.refrishFolder();
            }
        };
        FolderPanel.prototype.loadConfigCom = function () {
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
            this.a_scroll_bar.y = this.folderMask.y;
            this.setUiListVisibleByItem([this.a_bottom_line, this.a_right_bottom, this.a_bg, this.a_win_tittle], this.canMoveTittle);
            this.refrishSize();
            this.loadeFileXml();
        };
        FolderPanel.prototype.refrishSize = function () {
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
            this.refrishFoldeUiPos();
        };
        FolderPanel.prototype.tittleMouseDown = function (evt) {
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
        FolderPanel.prototype.tittleMouseUp = function (evt) {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.mouseOnTittleMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.tittleMouseUp, this);
        };
        FolderPanel.prototype.mouseOnTittleMove = function (evt) {
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
        FolderPanel.prototype.loadeFileXml = function () {
            var _this = this;
            LoadManager.getInstance().load(Scene_data.fileuiRoot + "folder.txt", LoadManager.XML_TYPE, function ($xmlStr) {
                FileXmlVo.makeBaseXml($xmlStr);
                _this.refrishFolder();
            });
        };
        FolderPanel.prototype.getCharNameMeshVo = function (value) {
            var $vo = new FolderMeshVo;
            $vo.fileXmlVo = value;
            this.showTemp($vo);
            return $vo;
        };
        FolderPanel.prototype.refrishFolder = function () {
            var $item = FileXmlVo.getListItem(-1);
            this.removeHideItem($item);
            this.addNewFolderNameToItem($item);
            this.resetChildItemAll(); //重算子目录
            this.refrishFoldeUiPos();
        };
        FolderPanel.prototype.refrishFoldeUiPos = function () {
            FolderPanel.tySkip = 1;
            this.mathFileCellHeight(0);
            var contentH = FolderPanel.tySkip * this.folderCellHeight;
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
        FolderPanel.prototype.isOpenByID = function (id) {
            for (var i = 0; i < this.fileItem.length; i++) {
                if (this.fileItem[i].fileXmlVo.id == id && this.fileItem[i].fileXmlVo.isOpen) {
                    return true;
                }
            }
            return false;
        };
        FolderPanel.prototype.mathFileCellHeight = function (id) {
            if (this.isOpenByID(id)) {
                for (var i = 0; i < this.fileItem.length; i++) {
                    if (this.fileItem[i].fileXmlVo.perent == id) {
                        this.fileItem[i].ty = FolderPanel.tySkip;
                        FolderPanel.tySkip++;
                        this.mathFileCellHeight(this.fileItem[i].fileXmlVo.id);
                    }
                }
            }
        };
        FolderPanel.prototype.resetChildItemAll = function () {
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
        FolderPanel.prototype.addNewFolderNameToItem = function (value) {
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
        FolderPanel.prototype.removeHideItem = function (value) {
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
        return FolderPanel;
    }(Dis2DUIContianerPanel));
    folder.FolderPanel = FolderPanel;
})(folder || (folder = {}));
//# sourceMappingURL=FolderPanel.js.map