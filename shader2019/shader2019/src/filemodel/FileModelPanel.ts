module filemodel {
    import ListItemRender = Pan3d.ListItemRender
    import UIManager = Pan3d.UIManager
    import Rectangle = Pan3d.Rectangle
    import UIConatiner = Pan3d.UIConatiner
    import UIData = Pan3d.UIData
    import PuiData = Pan3d.PuiData
    import TextAlign = Pan3d.TextAlign
    import UIRenderComponent = Pan3d.UIRenderComponent
    import AlphaUIRenderComponent = Pan3d.AlphaUIRenderComponent
    import UiDraw = Pan3d.UiDraw
    import GridList = Pan3d.GridList
    import UIMask = Pan3d.UIMask
    import UIListRenderComponent = Pan3d.UIListRenderComponent
    import Vector2D = Pan3d.Vector2D
    import ListItemData = Pan3d.ListItemData
    import InteractiveEvent = Pan3d.InteractiveEvent
    import LoadManager = Pan3d.LoadManager
    import Scene_data = Pan3d.Scene_data


    import SList = Pan3d.SList
    import UIAtlas = Pan3d.UIAtlas

    import SListItem = Pan3d.SListItem
    import UICompenent = Pan3d.UICompenent

    import SListItemData = Pan3d.SListItemData
    import LabelTextFont = Pan3d.LabelTextFont;

    import ColorType = Pan3d.ColorType;
    import UIRectangle = Pan3d.UIRectangle;
    import TextureManager = Pan3d.TextureManager;
    import IconManager = Pan3d.IconManager

    import ModuleEventManager = Pan3d.ModuleEventManager
    import MaterialTree = materialui.MaterialTree
    import MaterialEvent = materialui.MaterialEvent

    export class FileMeshVo {
        public id: number
        public name: string
        public ishave: boolean
        public need: number
    }

    export class SkinListRender extends SListItem {
        public static baseAtlas: UIAtlas;


        private S_ion_pic: UICompenent;
        private S_name: UICompenent;
        private S_bg: UICompenent
        public create($container: UIConatiner, $bgRender: UIRenderComponent, $baseRender: UIRenderComponent, $customizeRenderAry: Array<UIRenderComponent> = null): void {
            super.create($container, $bgRender, $baseRender, $customizeRenderAry);

            this.S_bg = this.creatSUI($bgRender, this.parentTarget.baseAtlas, "S_bg", 0, 0, SkinList.num500, 40);
            $container.addChild(this.S_bg);
         
       
            this.S_ion_pic = this.creatSUI($bgRender, this.parentTarget.baseAtlas, "S_ion_pic", 0, 2, 35, 35);
            $container.addChild(this.S_ion_pic);
            this.S_ion_pic.addEventListener(InteractiveEvent.Down, this.butDown, this);
            this.S_ion_pic.addEventListener(InteractiveEvent.Up, this.butClik, this);


            this.S_name = this.creatSUI($baseRender, this.parentTarget.baseAtlas, "S_name", 50,10, 200, 25);
            $container.addChild(this.S_name);


        }
 
        public render($data: SListItemData): void {
            this.itdata = $data;
            if ($data && $data.data) {
                var $vo: FileMeshVo = $data.data
                var $num: number = 10

                this.uiAtlas.upDataPicToTexture("ui/filelist/pic/" + $vo.id + ".jpg", this.S_ion_pic.skinName);

                //UiDraw.uiAtlasDrawImg(this.uiAtlas, this.S_bg.skinName, UIData.textlist, "List_base_bg_1")

                LabelTextFont.writeSingleLabel(this.uiAtlas, this.S_name.skinName, Pan3d.ColorType.Black000000 + $vo.name+"_" + $vo.id, 12, TextAlign.LEFT);
                this.fileColor(this.S_bg.skinName, $vo.id % 2 == 1 ? "rgba(66,66,66,1)" : "rgba(56,53,54,1)")
                this.downTarget = null

            }
        }

        private fileColor($iconName: string, $color: string): void {
            var rec: UIRectangle = this.uiAtlas.getRec($iconName);
            rec.pixelX -= 1;
            rec.pixelY -= 1;
            rec.pixelWitdh += 2;
            rec.pixelHeight += 2;
            this.uiAtlas.ctx = UIManager.getInstance().getContext2D(rec.pixelWitdh, rec.pixelHeight, false);
            this.uiAtlas.ctx.fillStyle = $color
            this.uiAtlas.ctx.fillRect(0, 0, rec.pixelWitdh, rec.pixelHeight);
            TextureManager.getInstance().updateTexture(this.uiAtlas.texture, rec.pixelX, rec.pixelY, this.uiAtlas.ctx);
        }
        private downTarget: any
        private lastMouseV2d: Vector2D
        public butDown(evt: InteractiveEvent): void {

            this.lastMouseV2d = new Vector2D(evt.x, evt.y)
            this.downTarget = evt.target
        }
        private _num: number = 1;
        private selctSkinById(value: number): void {
 
        }
        public butClik(evt: InteractiveEvent): void {
            if (this.itdata && this.downTarget == evt.target && this.lastMouseV2d && this.lastMouseV2d.x == evt.x && this.lastMouseV2d.y == evt.y) {
                var $vo: FileMeshVo = this.itdata.data
       

                FileModel.getInstance().selectFileById($vo.id)
            }
        }
    }


    export class SkinList extends SList {
        public static skilcellNum64: number = 38;
        public static num500: number = 450;
        public constructor() {
            super();
            this.center = 0;
            this.middle = -50;
            this._maskLevel = 5
        }
        public init($uiAtlas: UIAtlas): void {
            this.baseAtlas = $uiAtlas;
            this.initData();
        }
        private initData(): void {
            var $ary = new Array<SListItemData>();
            this.setData($ary, SkinListRender, SkinList.num500, SkinList.skilcellNum64 * 10, 0, SkinList.skilcellNum64, 10, 256, 1024, 1, 15);
        }

        public refreshDataByNewData(): void {
            LoadManager.getInstance().load(Scene_data.fileRoot + "ui/filelist/skilxml.txt", LoadManager.XML_TYPE,
                ($data: string) => {
                    var $xmlArr: Array<any> = JSON.parse($data);
                    var $sListItemData: Array<SListItemData> = this.getData($xmlArr);
                    this.refreshData($sListItemData);
                });
        }
        private isHaveById(value: number): boolean {
             
                return false
          
        }
        public getData($ary: Array<any>): Array<SListItemData> {
            var ary: Array<SListItemData> = new Array;
            for (var i: number = 0; i < $ary.length; i++) {
                var item: SListItemData = new SListItemData;
                var $vo: FileMeshVo = new FileMeshVo
                $vo.id = $ary[i].id;
                $vo.name = $ary[i].name;
                $vo.need = $ary[i].need;
                $vo.ishave = this.isHaveById($vo.id)
                item.data = $vo
                item.id = i;
                ary.push(item);
            }
            return ary;
        }
        public show(): void {
            if (!this.hasStage) {
                UIManager.getInstance().addUIContainer(this);

            }
        }
        public hide(): void {
            if (this.hasStage) {
                UIManager.getInstance().removeUIContainer(this);
            }
        }
    }

    export class FileModelPanel extends H5UIConatiner {
        private _bottomRender: AlphaUIRenderComponent;
        private _midRender: UIRenderComponent;
        private _topRender: UIRenderComponent;


        public constructor() {
            super();

            this.width = 960
            this.height = 540
            this.center = 0;
            this.middle = 0;


            this.baseWindowLoadFinish()



        }

        protected baseWindowLoadFinish(): void {
        

            this._bottomRender = new AlphaUIRenderComponent();
            this.addRender(this._bottomRender);
            this._midRender = new UIRenderComponent();
            this.addRender(this._midRender);
            this._topRender = new UIRenderComponent();
            this.addRender(this._topRender);

            this.h5UIAtlas = new H5UIAtlas;
            this.h5UIAtlas.setInfo("ui/filelist/filelist.txt", "ui/filelist/filelist.png", () => { this.loadConfigCom() });
        }

        protected butClik(evt: InteractiveEvent): void {
            switch (evt.target) {
                case this.a_tittle_move_bar:
                    this.a_tittle_move_barStarMove(evt)
                    break
                case this.a_win_close:
                    this.hidePanel();
                    break
                default:
                    break
            }

        }
        private lastMouse: Vector2D;
        private lastPos: Vector2D
        private a_tittle_move_barStarMove(evt: InteractiveEvent): void {
            this.lastMouse = new Vector2D(evt.x, evt.y)
            this.lastPos = new Vector2D(this._center, this._middle)
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onStageMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onStageUp, this);
        }
        private onStageMove(evt: InteractiveEvent): void {
            if (this.lastMouse) {
                this.center = this.lastPos.x + evt.x - this.lastMouse.x;
                this.middle = this.lastPos.y + evt.y - this.lastMouse.y;
                this._skinList.center = this._center;
                this._skinList.middle = this._middle;
            }

        }
        private onStageUp(evt: InteractiveEvent): void {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onStageMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onStageUp, this);
        }
     

        private _skinList: SkinList;
        private a_win_bg: UICompenent
        private a_win_close: UICompenent
        private a_tittle_move_bar: UICompenent
        private loadConfigCom(): void {

            this._bottomRender.uiAtlas = this.h5UIAtlas
            this._midRender.uiAtlas = this.h5UIAtlas
            this._topRender.uiAtlas = this.h5UIAtlas

  
            this.a_win_bg = this.addChild(this._bottomRender.getComponent("a_win_bg"));
            this.addChild(this._bottomRender.getComponent("a_label_txt"));
     

            this.a_win_close = this.addEvntButUp("a_win_close", this._topRender)

            this.a_tittle_move_bar = this.addEvntBut("a_tittle_move_bar", this._topRender)

            
            
            this._skinList = new SkinList();
            this._skinList.init(this._topRender.uiAtlas);

            this.uiLoadComplte = true
            this.showPanel();
        }

        private lastHasDiamonds: number = 0
        public showPanel(): void {
            if (this.uiLoadComplte) {
                UIManager.getInstance().addUIContainer(this);
                this._skinList.show()
                this._skinList.center = this._center;
                this._skinList.middle = this._middle;
                this._skinList.refreshDataByNewData() //防止卡，获取数据延后一点
 
                this.lastHasDiamonds = 111

            } else {
                if (this.h5UIAtlas) {
                    this.h5UIAtlas.testLoading();
                }

            }
        }
        public resize(): void {
            super.resize();
            this._skinList.resize()


        }
        public hidePanel(): void {
            UIManager.getInstance().removeUIContainer(this);

            this._skinList.hide()
        }



    }
}