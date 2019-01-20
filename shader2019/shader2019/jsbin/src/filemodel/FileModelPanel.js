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
var filemodel;
(function (filemodel) {
    var UIManager = Pan3d.UIManager;
    var TextAlign = Pan3d.TextAlign;
    var UIRenderComponent = Pan3d.UIRenderComponent;
    var AlphaUIRenderComponent = Pan3d.AlphaUIRenderComponent;
    var Vector2D = Pan3d.Vector2D;
    var InteractiveEvent = Pan3d.InteractiveEvent;
    var LoadManager = Pan3d.LoadManager;
    var Scene_data = Pan3d.Scene_data;
    var SList = Pan3d.SList;
    var SListItem = Pan3d.SListItem;
    var SListItemData = Pan3d.SListItemData;
    var LabelTextFont = Pan3d.LabelTextFont;
    var TextureManager = Pan3d.TextureManager;
    var FileMeshVo = /** @class */ (function () {
        function FileMeshVo() {
        }
        return FileMeshVo;
    }());
    filemodel.FileMeshVo = FileMeshVo;
    var SkinListRender = /** @class */ (function (_super) {
        __extends(SkinListRender, _super);
        function SkinListRender() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._num = 1;
            return _this;
        }
        SkinListRender.prototype.create = function ($container, $bgRender, $baseRender, $customizeRenderAry) {
            if ($customizeRenderAry === void 0) { $customizeRenderAry = null; }
            _super.prototype.create.call(this, $container, $bgRender, $baseRender, $customizeRenderAry);
            this.S_bg = this.creatSUI($bgRender, this.parentTarget.baseAtlas, "S_bg", 0, 0, SkinList.num500, 40);
            $container.addChild(this.S_bg);
            this.S_ion_pic = this.creatSUI($bgRender, this.parentTarget.baseAtlas, "S_ion_pic", 0, 2, 35, 35);
            $container.addChild(this.S_ion_pic);
            this.S_ion_pic.addEventListener(InteractiveEvent.Down, this.butDown, this);
            this.S_ion_pic.addEventListener(InteractiveEvent.Up, this.butClik, this);
            this.S_name = this.creatSUI($baseRender, this.parentTarget.baseAtlas, "S_name", 50, 10, 200, 25);
            $container.addChild(this.S_name);
        };
        SkinListRender.prototype.render = function ($data) {
            this.itdata = $data;
            if ($data && $data.data) {
                var $vo = $data.data;
                var $num = 10;
                this.uiAtlas.upDataPicToTexture("ui/filelist/pic/" + $vo.id + ".jpg", this.S_ion_pic.skinName);
                //UiDraw.uiAtlasDrawImg(this.uiAtlas, this.S_bg.skinName, UIData.textlist, "List_base_bg_1")
                LabelTextFont.writeSingleLabel(this.uiAtlas, this.S_name.skinName, Pan3d.ColorType.Black000000 + $vo.name + "_" + $vo.id, 12, TextAlign.LEFT);
                this.fileColor(this.S_bg.skinName, $vo.id % 2 == 1 ? "rgba(66,66,66,1)" : "rgba(56,53,54,1)");
                this.downTarget = null;
            }
        };
        SkinListRender.prototype.fileColor = function ($iconName, $color) {
            var rec = this.uiAtlas.getRec($iconName);
            rec.pixelX -= 1;
            rec.pixelY -= 1;
            rec.pixelWitdh += 2;
            rec.pixelHeight += 2;
            this.uiAtlas.ctx = UIManager.getInstance().getContext2D(rec.pixelWitdh, rec.pixelHeight, false);
            this.uiAtlas.ctx.fillStyle = $color;
            this.uiAtlas.ctx.fillRect(0, 0, rec.pixelWitdh, rec.pixelHeight);
            TextureManager.getInstance().updateTexture(this.uiAtlas.texture, rec.pixelX, rec.pixelY, this.uiAtlas.ctx);
        };
        SkinListRender.prototype.butDown = function (evt) {
            this.lastMouseV2d = new Vector2D(evt.x, evt.y);
            this.downTarget = evt.target;
        };
        SkinListRender.prototype.selctSkinById = function (value) {
        };
        SkinListRender.prototype.butClik = function (evt) {
            if (this.itdata && this.downTarget == evt.target && this.lastMouseV2d && this.lastMouseV2d.x == evt.x && this.lastMouseV2d.y == evt.y) {
                var $vo = this.itdata.data;
                filemodel.FileModel.getInstance().selectFileById($vo.id);
            }
        };
        return SkinListRender;
    }(SListItem));
    filemodel.SkinListRender = SkinListRender;
    var SkinList = /** @class */ (function (_super) {
        __extends(SkinList, _super);
        function SkinList() {
            var _this = _super.call(this) || this;
            _this.center = 0;
            _this.middle = -50;
            _this._maskLevel = 5;
            return _this;
        }
        SkinList.prototype.init = function ($uiAtlas) {
            this.baseAtlas = $uiAtlas;
            this.initData();
        };
        SkinList.prototype.initData = function () {
            var $ary = new Array();
            this.setData($ary, SkinListRender, SkinList.num500, SkinList.skilcellNum64 * 10, 0, SkinList.skilcellNum64, 10, 256, 1024, 1, 15);
        };
        SkinList.prototype.refreshDataByNewData = function () {
            var _this = this;
            LoadManager.getInstance().load(Scene_data.fileRoot + "ui/filelist/skilxml.txt", LoadManager.XML_TYPE, function ($data) {
                var $xmlArr = JSON.parse($data);
                var $sListItemData = _this.getData($xmlArr);
                _this.refreshData($sListItemData);
            });
        };
        SkinList.prototype.isHaveById = function (value) {
            return false;
        };
        SkinList.prototype.getData = function ($ary) {
            var ary = new Array;
            for (var i = 0; i < $ary.length; i++) {
                var item = new SListItemData;
                var $vo = new FileMeshVo;
                $vo.id = $ary[i].id;
                $vo.name = $ary[i].name;
                $vo.need = $ary[i].need;
                $vo.ishave = this.isHaveById($vo.id);
                item.data = $vo;
                item.id = i;
                ary.push(item);
            }
            return ary;
        };
        SkinList.prototype.show = function () {
            if (!this.hasStage) {
                UIManager.getInstance().addUIContainer(this);
            }
        };
        SkinList.prototype.hide = function () {
            if (this.hasStage) {
                UIManager.getInstance().removeUIContainer(this);
            }
        };
        SkinList.skilcellNum64 = 38;
        SkinList.num500 = 450;
        return SkinList;
    }(SList));
    filemodel.SkinList = SkinList;
    var FileModelPanel = /** @class */ (function (_super) {
        __extends(FileModelPanel, _super);
        function FileModelPanel() {
            var _this = _super.call(this) || this;
            _this.lastHasDiamonds = 0;
            _this.width = 960;
            _this.height = 540;
            _this.center = 0;
            _this.middle = 0;
            _this.baseWindowLoadFinish();
            return _this;
        }
        FileModelPanel.prototype.baseWindowLoadFinish = function () {
            var _this = this;
            this._bottomRender = new AlphaUIRenderComponent();
            this.addRender(this._bottomRender);
            this._midRender = new UIRenderComponent();
            this.addRender(this._midRender);
            this._topRender = new UIRenderComponent();
            this.addRender(this._topRender);
            this.h5UIAtlas = new H5UIAtlas;
            this.h5UIAtlas.setInfo("ui/filelist/filelist.txt", "ui/filelist/filelist.png", function () { _this.loadConfigCom(); });
        };
        FileModelPanel.prototype.butClik = function (evt) {
            switch (evt.target) {
                case this.a_tittle_move_bar:
                    this.a_tittle_move_barStarMove(evt);
                    break;
                case this.a_win_close:
                    this.hidePanel();
                    break;
                default:
                    break;
            }
        };
        FileModelPanel.prototype.a_tittle_move_barStarMove = function (evt) {
            this.lastMouse = new Vector2D(evt.x, evt.y);
            this.lastPos = new Vector2D(this._center, this._middle);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onStageMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onStageUp, this);
        };
        FileModelPanel.prototype.onStageMove = function (evt) {
            if (this.lastMouse) {
                this.center = this.lastPos.x + evt.x - this.lastMouse.x;
                this.middle = this.lastPos.y + evt.y - this.lastMouse.y;
                this._skinList.center = this._center;
                this._skinList.middle = this._middle;
            }
        };
        FileModelPanel.prototype.onStageUp = function (evt) {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onStageMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onStageUp, this);
        };
        FileModelPanel.prototype.loadConfigCom = function () {
            this._bottomRender.uiAtlas = this.h5UIAtlas;
            this._midRender.uiAtlas = this.h5UIAtlas;
            this._topRender.uiAtlas = this.h5UIAtlas;
            this.a_win_bg = this.addChild(this._bottomRender.getComponent("a_win_bg"));
            this.addChild(this._bottomRender.getComponent("a_label_txt"));
            this.a_win_close = this.addEvntButUp("a_win_close", this._topRender);
            this.a_tittle_move_bar = this.addEvntBut("a_tittle_move_bar", this._topRender);
            this._skinList = new SkinList();
            this._skinList.init(this._topRender.uiAtlas);
            this.uiLoadComplte = true;
            this.showPanel();
        };
        FileModelPanel.prototype.showPanel = function () {
            if (this.uiLoadComplte) {
                UIManager.getInstance().addUIContainer(this);
                this._skinList.show();
                this._skinList.center = this._center;
                this._skinList.middle = this._middle;
                this._skinList.refreshDataByNewData(); //防止卡，获取数据延后一点
                this.lastHasDiamonds = 111;
            }
            else {
                if (this.h5UIAtlas) {
                    this.h5UIAtlas.testLoading();
                }
            }
        };
        FileModelPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this._skinList.resize();
        };
        FileModelPanel.prototype.hidePanel = function () {
            UIManager.getInstance().removeUIContainer(this);
            this._skinList.hide();
        };
        return FileModelPanel;
    }(H5UIConatiner));
    filemodel.FileModelPanel = FileModelPanel;
})(filemodel || (filemodel = {}));
//# sourceMappingURL=FileModelPanel.js.map