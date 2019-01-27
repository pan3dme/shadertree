module folder {
    import UICompenent = Pan3d.UICompenent
    import FrameCompenent = Pan3d.FrameCompenent
    import UIRenderComponent = Pan3d.UIRenderComponent
    import ColorType = Pan3d.ColorType
    import InteractiveEvent = Pan3d.InteractiveEvent
    import TextAlign = Pan3d.TextAlign
    import Rectangle = Pan3d.Rectangle
    import ModuleEventManager = Pan3d.ModuleEventManager
    import UIManager = Pan3d.UIManager
    import LabelTextFont = Pan3d.LabelTextFont
    import Dis2DUIContianerPanel = Pan3d.Dis2DUIContianerPanel;
    import Disp2DBaseText = Pan3d.Disp2DBaseText
    import UIRectangle = Pan3d.UIRectangle
    import baseMeshVo = Pan3d.baseMeshVo
    import UIMask = Pan3d.UIMask
    import UiDraw = Pan3d.UiDraw
    import UIData = Pan3d.UIData
    import UIAtlas = Pan3d.UIAtlas


    export class FileXmlVo {
        public id: number
        public name: string
        public perent: number;
        public isOpen: boolean;

        public static makeBaseXml(value: string): void {
            var obj: any = JSON.parse(value);
            this.item = new Array;
            for (var i: number = 0; i < obj.list.length; i++) {
                var vo: FileXmlVo = new FileXmlVo();
                vo.id = obj.list[i].id;
                vo.name = obj.list[i].name;
                vo.perent = obj.list[i].perent;
                vo.isOpen = false;
                this.item.push(vo)
            }

        }
        private static item: Array<FileXmlVo>
        //获取所有打开可显示的列表
        public static getListItem(value: number): Array<FileXmlVo> {
            var arr: Array<FileXmlVo> = new Array;
            for (var i: number = 0; i < this.item.length; i++) {
                if (this.isShow(this.item[i])) {
                    arr.push(this.item[i]);
                }
            }
            return arr
        }
        //通过ID获取对应的层级
        public static getFileSonLayer(value: number): number {
            var num: number = 0;
            for (var i: number = 0; i < this.item.length; i++) {
                if (this.item[i].id == value) {
                    if (this.item[i].perent != -1) {
                        num++
                        num += this.getFileSonLayer(this.item[i].perent)
                    }

                }
            }

            return num
        }
        public static getFileCellHeight(id: number): number {
            var num: number = 1
            for (var i: number = 0; i < this.item.length; i++) {
                if (this.item[i].perent == id) {
                    if (this.item[i].isOpen) {
                        num += this.getFileCellHeight(this.item[i].id);
                    } else {
                        num += 1;
                    }

                }
            }
            return num
        }
        //判断是否在显示列表中
        private static isShow(vo: FileXmlVo): boolean {
            if (vo.perent == -1) { //根目录
                return true;
            }
            for (var i: number = 0; i < this.item.length; i++) {
                if (this.item[i].id == vo.perent) {
                    if (this.item[i].isOpen) {
                        return this.isShow(this.item[i])
                    } else {
                        return false
                    }
                }
            }
            console.log("不应该到这里")
            return false;
        }

    }
    export class FolderMeshVo extends Pan3d.baseMeshVo {
        private _name: string;
        public fileXmlVo: FileXmlVo
        public ty: number
        public cellHeightNum: number;
        public childItem: Array<FolderMeshVo>
        public needDraw: boolean;
        public constructor() {
            super();
            this.cellHeightNum = 1;
        }
        public set name(value: string) {
            this._name = value;
            this.needDraw = true;
        }
        public get name(): string {
            return this._name;
        }
        public destory(): void {
            this.pos = null;
            this._name = null;
            this.needDraw = null;
            this.clear = true
        }


    }
    export class FolderName extends Disp2DBaseText {
        public folderMeshVo: FolderMeshVo
        public makeData(): void {
            this.folderMeshVo = this.data;
            if (this.folderMeshVo) {




                var $uiRec: UIRectangle = this.parent.uiAtlas.getRec(this.textureStr);
                this.parent.uiAtlas.ctx = UIManager.getInstance().getContext2D($uiRec.pixelWitdh, $uiRec.pixelHeight, false);

       
                this.parent.uiAtlas.ctx.clearRect(0, 1, $uiRec.pixelWitdh, $uiRec.pixelHeight );


                LabelTextFont.writeSingleLabelToCtx(this.parent.uiAtlas.ctx, "[9c9c9c]"+ this.folderMeshVo.fileXmlVo.name, 12, 35, 5, TextAlign.LEFT)
 

          
                    if (this.folderMeshVo.fileXmlVo.isOpen) {
                        this.parent.uiAtlas.ctx.drawImage(FolderPanel.imgBaseDic["icon_PanRight"], 2, 5, 10, 10)

                        this.parent.uiAtlas.ctx.drawImage(FolderPanel.imgBaseDic["icon_FolderOpen_dark"], 15, 2, 18, 16)
                    } else {
                        this.parent.uiAtlas.ctx.drawImage(FolderPanel.imgBaseDic["icon_PanUp"], 3, 5, 10, 10)

                        this.parent.uiAtlas.ctx.drawImage(FolderPanel.imgBaseDic["icon_FolderClosed_dark"], 15, 2, 18, 16)
                    }
 

                TextureManager.getInstance().updateTexture(this.parent.uiAtlas.texture, $uiRec.pixelX, $uiRec.pixelY, this.parent.uiAtlas.ctx);




            }
        }



        public update(): void {
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
        }
    }

    export class FolderPanel extends Dis2DUIContianerPanel {

        public static imgBaseDic: any
        public constructor() {
            super(FolderName, new Rectangle(0, 0, 128, 20), 50);
            this.left = 300;

            this._bottomRender = new UIRenderComponent;
            this.addRender(this._bottomRender);
            this.removeRender(this._baseRender);
            this.addRender(this._baseRender);
            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);


            Pan3d.TimeUtil.addTimeOut(1000, () => {
               
            })

            this.loadAssetImg(() => {

                this._bottomRender.uiAtlas = new UIAtlas();
                this._bottomRender.uiAtlas.setInfo("ui/folder/folder.txt", "ui/folder/folder.png", () => { this.loadConfigCom() });

                Pan3d.TimeUtil.addFrameTick((t: number) => { this.update(t) });

            })

        }
        private loadAssetImg(bfun: Function): void {
            FolderPanel.imgBaseDic = {};
            var item: Array<string> = [];
            item.push("icon_FolderClosed_dark");
            item.push("icon_FolderOpen_dark");
            item.push("icon_PanRight");
            item.push("icon_PanUp");
            

            var finishNum: number = 0
            for (var i: number = 0; i < item.length; i++) {
                this.loadTempOne(item[i], () => {
                    finishNum++
                    if (finishNum >= item.length) {
                        bfun();
                    }

                });
            }
        }
  
        private loadTempOne(name: string, bfun: Function): void { 
  
            var tempImg = makeImage()
            FolderPanel.imgBaseDic[name] = tempImg;
            tempImg.onload = () => {
                bfun();
            }
            tempImg.url = Scene_data.fileuiRoot + "ui/folder/pic/" + name + ".png"
            tempImg.src = Scene_data.fileuiRoot + "ui/folder/pic/" + name + ".png"

        }

        private _bottomRender: UIRenderComponent;
        private _topRender: UIRenderComponent;

        private folderMask: UIMask
        public update(t: number): void {
            super.update(t);

        }
        public panelEventChanger(value: Dis2DUIContianerPanel): void {
            if (value != this) {
                this.top = value.top;

            }

        }

        protected mouseDown(evt: InteractiveEvent): void {
            this.mouseIsDown = true
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.stageMouseMove, this);
        }
        private mouseIsDown: boolean
        protected stageMouseMove(evt: InteractiveEvent): void {
            this.mouseIsDown = false

        }
        protected mouseUp(evt: InteractiveEvent): void {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.stageMouseMove, this);
            if (this.mouseIsDown) {
                for (var i: number = 0; i < this._uiItem.length; i++) {
                    var $vo: FolderName = <FolderName>this._uiItem[i]
                    if ($vo.ui == evt.target) {
                        if ((evt.x - this.left) - $vo.ui.x < 20) {
                            $vo.folderMeshVo.fileXmlVo.isOpen = !$vo.folderMeshVo.fileXmlVo.isOpen;
                            $vo.folderMeshVo.needDraw = true;
                        } else {
                            $vo.folderMeshVo.fileXmlVo.isOpen = true
                            $vo.folderMeshVo.needDraw = true
                            console.log("显示文件夹内容", $vo.folderMeshVo.fileXmlVo)
                        }
          

                    }
                }
                this.refrishFolder();

            }

        }
        protected loadConfigCom(): void {
            this._topRender.uiAtlas = this._bottomRender.uiAtlas
            this.pageRect = new Rectangle(0, 0, 200, 200)
            this.folderMask = new UIMask();

            this.folderMask.level = 1;
            this.addMask(this.folderMask);
            this._baseRender.mask = this.folderMask

            this.fileItem = [];
            for (var i: number = 0; i < this._uiItem.length; i++) {
                this._uiItem[i].ui.addEventListener(InteractiveEvent.Down, this.mouseDown, this);
                this._uiItem[i].ui.addEventListener(InteractiveEvent.Up, this.mouseUp, this);
            }

            this.a_bg = this.addEvntBut("a_bg", this._bottomRender);




            this.a_win_tittle = this.addChild(<UICompenent>this._topRender.getComponent("a_win_tittle"));
            this.a_win_tittle.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);

            this.a_rigth_line = this.addChild(<UICompenent>this._topRender.getComponent("a_rigth_line"));
            this.a_rigth_line.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);

            this.a_bottom_line = this.addChild(<UICompenent>this._topRender.getComponent("a_bottom_line"));
            this.a_bottom_line.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);

            this.a_right_bottom = this.addChild(<UICompenent>this._topRender.getComponent("a_right_bottom"));
            this.a_right_bottom.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);

            this.a_scroll_bar = this.addChild(<UICompenent>this._topRender.getComponent("a_scroll_bar"));
            this.a_scroll_bar.addEventListener(InteractiveEvent.Down, this.tittleMouseDown, this);




            this.refrishSize()
            this.a_scroll_bar.y = this.folderMask.y;

            this.loadeFileXml()

        }
        private a_scroll_bar: UICompenent
        private a_bottom_line: UICompenent



        private a_right_bottom: UICompenent;
        private a_rigth_line: UICompenent;
        private refrishSize(): void {

            this.pageRect.width = Math.max(100, this.pageRect.width)
            this.pageRect.height = Math.max(100, this.pageRect.height)

            this.a_win_tittle.x = 0;
            this.a_win_tittle.y = 0;
            this.a_win_tittle.width = this.pageRect.width;



            this.folderMask.y = this.a_win_tittle.height;
            this.folderMask.x = 0
            this.folderMask.width = this.pageRect.width - this.a_rigth_line.width
            this.folderMask.height = this.pageRect.height - this.a_win_tittle.height - this.a_bottom_line.height

            this.a_bg.x = 0;
            this.a_bg.y = 0
            this.a_bg.width = this.pageRect.width
            this.a_bg.height = this.pageRect.height

            this.a_rigth_line.x = this.pageRect.width - this.a_rigth_line.width
            this.a_rigth_line.y = this.a_win_tittle.height;
            this.a_rigth_line.height = this.pageRect.height - this.a_win_tittle.height - this.a_right_bottom.height;

            this.a_bottom_line.x = 0
            this.a_bottom_line.y = this.pageRect.height - this.a_bottom_line.height
            this.a_bottom_line.width = this.pageRect.width - this.a_right_bottom.width;


            this.a_right_bottom.x = this.pageRect.width - this.a_right_bottom.width
            this.a_right_bottom.y = this.pageRect.height - this.a_right_bottom.height

            this.a_scroll_bar.x = this.folderMask.x + this.folderMask.width - this.a_scroll_bar.width;

            this.resize();

            this.refrishFoldeUiPos();
        }

        private lastPagePos: Vector2D;
        private lastMousePos: Vector2D;
        private mouseMoveTaget: UICompenent
        private pageRect: Rectangle
        protected tittleMouseDown(evt: InteractiveEvent): void {
            this.mouseMoveTaget = evt.target

            this.lastMousePos = new Vector2D(evt.x, evt.y)

            switch (this.mouseMoveTaget) {
                case this.a_win_tittle:
                    this.lastPagePos = new Vector2D(this.left, this.top)
                    break

                case this.a_rigth_line:
                case this.a_bottom_line:
                case this.a_right_bottom:
                    this.lastPagePos = new Vector2D(this.pageRect.width, this.pageRect.height)
                    break
                case this.a_scroll_bar:
                    this.lastPagePos = new Vector2D(0, this.a_scroll_bar.y)
                    break

                default:
                    console.log("nonono")
                    break

            }




            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.mouseOnTittleMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.tittleMouseUp, this);
        }
        protected tittleMouseUp(evt: InteractiveEvent): void {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.mouseOnTittleMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.tittleMouseUp, this);
        }
        protected mouseOnTittleMove(evt: InteractiveEvent): void {
            switch (this.mouseMoveTaget) {
                case this.a_win_tittle:
                    this.left = this.lastPagePos.x + (evt.x - this.lastMousePos.x)
                    this.top = this.lastPagePos.y + (evt.y - this.lastMousePos.y)
                    break
                case this.a_rigth_line:
                    this.pageRect.width = this.lastPagePos.x + (evt.x - this.lastMousePos.x)

                    break
                case this.a_bottom_line:
                    this.pageRect.height = this.lastPagePos.y + (evt.y - this.lastMousePos.y)

                    break

                case this.a_right_bottom:
                    this.pageRect.width = this.lastPagePos.x + (evt.x - this.lastMousePos.x)
                    this.pageRect.height = this.lastPagePos.y + (evt.y - this.lastMousePos.y)
                    break

                case this.a_scroll_bar:

                    this.a_scroll_bar.y = this.lastPagePos.y + (evt.y - this.lastMousePos.y);
                    this.a_scroll_bar.y = Math.max(this.a_scroll_bar.y, this.folderMask.y)
                    this.a_scroll_bar.y = Math.min(this.a_scroll_bar.y, this.folderMask.y + this.folderMask.height - this.a_scroll_bar.height)

                    //  console.log(this.a_scroll_bar.y)

                    break
                default:
                    console.log("nonono")
                    break

            }
            this.refrishSize()

        }
        private a_bg: UICompenent;
        private a_win_tittle: UICompenent;

        private loadeFileXml(): void {
            LoadManager.getInstance().load(Scene_data.fileuiRoot + "folder.txt", LoadManager.XML_TYPE,
                ($xmlStr: string) => {
                    FileXmlVo.makeBaseXml($xmlStr);
                    this.refrishFolder()
                });
        }
        private fileItem: Array<FolderMeshVo>;
        public getCharNameMeshVo(value: FileXmlVo): FolderMeshVo {
            var $vo: FolderMeshVo = new FolderMeshVo;
            $vo.fileXmlVo = value;

            this.showTemp($vo);
            return $vo;
        }
        private folderCellHeight: number = 20
        private refrishFolder(): void {
            var $item: Array<FileXmlVo> = FileXmlVo.getListItem(-1);
            this.removeHideItem($item)
            this.addNewFolderNameToItem($item)
            this.resetChildItemAll(); //重算子目录



            this.refrishFoldeUiPos();
        }
        private refrishFoldeUiPos(): void {
            FolderPanel.tySkip = 1;
            this.mathFileCellHeight(0);

            var contentH: number = FolderPanel.tySkip * this.folderCellHeight;
            var moveTy: number = 0
            if (contentH > this.folderMask.height) {
                this.setUiListVisibleByItem([this.a_scroll_bar], true);
                this.a_scroll_bar.height = (this.folderMask.height / contentH) * this.folderMask.height;


                this.a_scroll_bar.y = Math.min(this.a_scroll_bar.y, this.folderMask.height + this.folderMask.y - this.a_scroll_bar.height);



                var nnn: number = (this.a_scroll_bar.y - this.folderMask.y) / (this.folderMask.height - this.a_scroll_bar.height);


                moveTy = (this.folderMask.height - contentH) * nnn

            } else {
                this.setUiListVisibleByItem([this.a_scroll_bar], false);
                moveTy = 0

            }

            for (var i: number = 0; i < this.fileItem.length; i++) {
                var layer: number = FileXmlVo.getFileSonLayer(this.fileItem[i].fileXmlVo.id)
                this.fileItem[i].pos.y = this.folderCellHeight * this.fileItem[i].ty + this.folderMask.y + moveTy;
                this.fileItem[i].pos.x = 20 * layer;
            }

        }

        private isOpenByID(id): boolean {
            for (var i: number = 0; i < this.fileItem.length; i++) {
                if (this.fileItem[i].fileXmlVo.id == id && this.fileItem[i].fileXmlVo.isOpen) {
                    return true
                }
            }
            return false
        }
        private static tySkip: number
        private mathFileCellHeight(id: number): void {
            if (this.isOpenByID(id)) {
                for (var i: number = 0; i < this.fileItem.length; i++) {
                    if (this.fileItem[i].fileXmlVo.perent == id) {
                        this.fileItem[i].ty = FolderPanel.tySkip;
                        FolderPanel.tySkip++
                        this.mathFileCellHeight(this.fileItem[i].fileXmlVo.id);
                    }
                }
            }




        }

        private resetChildItemAll(): void {
            for (var i: number = 0; i < this.fileItem.length; i++) {
                this.fileItem[i].childItem = [];
                this.fileItem[i].ty = 0;
                for (var j: number = 0; j < this.fileItem.length; j++) {
                    if (this.fileItem[j].fileXmlVo.perent == this.fileItem[i].fileXmlVo.id) {
                        this.fileItem[i].childItem.push(this.fileItem[j]);
                    }
                }

            }

        }

        //添加新进来的对象
        private addNewFolderNameToItem(value: Array<FileXmlVo>): void {
            for (var i: number = 0; i < value.length; i++) {
                var needAdd: boolean = true
                for (var j: number = 0; j < this.fileItem.length; j++) {
                    if (this.fileItem[j].fileXmlVo == value[i]) {
                        needAdd = false
                    }
                }
                if (needAdd) {
                    var $vo: FolderMeshVo = this.getCharNameMeshVo(value[i]);
                    $vo.pos = new Vector3D(0, i * 15, 0)
                    this.fileItem.push($vo);
                }

            }

        }
        //移除不显示的对象
        private removeHideItem(value: Array<FileXmlVo>): void {
            for (var i: number = 0; i < this.fileItem.length; i++) {
                var needClear: boolean = true
                for (var j: number = 0; j < value.length; j++) {
                    if (this.fileItem[i].fileXmlVo == value[j]) {
                        needClear = false
                    }
                }
                if (needClear) {
                    var temp: FolderMeshVo = this.fileItem[i];
                    temp.destory()
                    this.fileItem.splice(i, 1);
                    i--;
                }
            }


        }







    }
}