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
    var ColorType = Pan3d.ColorType;
    var InteractiveEvent = Pan3d.InteractiveEvent;
    var TextAlign = Pan3d.TextAlign;
    var Rectangle = Pan3d.Rectangle;
    var UIManager = Pan3d.UIManager;
    var LabelTextFont = Pan3d.LabelTextFont;
    var Dis2DUIContianerPanel = Pan3d.Dis2DUIContianerPanel;
    var Disp2DBaseText = Pan3d.Disp2DBaseText;
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
                this.parent.uiAtlas.ctx.fillStyle = "rgb(56,56,56)";
                this.parent.uiAtlas.ctx.fillRect(0, 1, $uiRec.pixelWitdh, $uiRec.pixelHeight - 2);
                LabelTextFont.writeSingleLabelToCtx(this.parent.uiAtlas.ctx, ColorType.Redd92200 + this.folderMeshVo.fileXmlVo.name, 12, 0, 5, TextAlign.LEFT);
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
            _this.left = 300;
            _this.fileItem = [];
            for (var i = 0; i < _this._uiItem.length; i++) {
                _this._uiItem[i].ui.addEventListener(InteractiveEvent.Down, _this.butClik, _this);
            }
            _this.loadConfigCom();
            Pan3d.TimeUtil.addFrameTick(function (t) { _this.update(t); });
            return _this;
        }
        FolderPanel.prototype.update = function (t) {
            _super.prototype.update.call(this, t);
        };
        FolderPanel.prototype.butClik = function (evt) {
            for (var i = 0; i < this._uiItem.length; i++) {
                var $vo = this._uiItem[i];
                if ($vo.ui == evt.target) {
                    $vo.folderMeshVo.fileXmlVo.isOpen = !$vo.folderMeshVo.fileXmlVo.isOpen;
                }
            }
            this.refrish();
        };
        FolderPanel.prototype.loadConfigCom = function () {
            var _this = this;
            LoadManager.getInstance().load(Scene_data.fileuiRoot + "folder.txt", LoadManager.XML_TYPE, function ($xmlStr) {
                FileXmlVo.makeBaseXml($xmlStr);
                _this.refrish();
            });
        };
        FolderPanel.prototype.getCharNameMeshVo = function (value) {
            var $vo = new FolderMeshVo;
            $vo.fileXmlVo = value;
            this.showTemp($vo);
            return $vo;
        };
        FolderPanel.prototype.refrish = function () {
            var $item = FileXmlVo.getListItem(-1);
            this.removeHideItem($item);
            this.addNewFolderNameToItem($item);
            this.resetChildItemAll(); //重算子目录
            FolderPanel.tySkip = 1;
            this.mathFileCellHeight(0);
            for (var i = 0; i < this.fileItem.length; i++) {
                var layer = FileXmlVo.getFileSonLayer(this.fileItem[i].fileXmlVo.id);
                this.fileItem[i].pos.y = 20 * this.fileItem[i].ty;
                this.fileItem[i].pos.x = 50 * layer;
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