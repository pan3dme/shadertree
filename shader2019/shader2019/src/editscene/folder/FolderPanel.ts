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
 

    export class FileXmlVo   {
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
            var num: number=1
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
            if (this._data) {
                var $uiRec: UIRectangle = this.parent.uiAtlas.getRec(this.textureStr);
                this.parent.uiAtlas.ctx = UIManager.getInstance().getContext2D($uiRec.pixelWitdh, $uiRec.pixelHeight, false);

                this.parent.uiAtlas.ctx.fillStyle = "rgb(56,56,56)";
                this.parent.uiAtlas.ctx.fillRect(0, 1, $uiRec.pixelWitdh, $uiRec.pixelHeight-2);

                LabelTextFont.writeSingleLabelToCtx(this.parent.uiAtlas.ctx, ColorType.Redd92200 + "CCAVEE", 12, 0, 5, TextAlign.LEFT)
                TextureManager.getInstance().updateTexture(this.parent.uiAtlas.texture, $uiRec.pixelX, $uiRec.pixelY, this.parent.uiAtlas.ctx);
            }
        }
   

        public update(): void {
            this.folderMeshVo = this.data;
            if (this.folderMeshVo) {

                if (this.folderMeshVo.needDraw) {
                    this.makeData();
                    this.folderMeshVo.needDraw = false
                }

                if (this.folderMeshVo.pos) {
                    this.ui.x = this.folderMeshVo.pos.x
                    this.ui.y = this.folderMeshVo.pos.y

                 
                }
                if (this.folderMeshVo.clear) {
                    this.ui.parent.removeChild(this.ui);
                    this._data = null;
                }
            }
        }
    }

    export class FolderPanel extends Dis2DUIContianerPanel {
        public constructor() {
            super(FolderName, new Rectangle(0, 0, 128, 20), 50);


            this.fileItem=[]
            for (var i: number = 0; i < this._uiItem.length; i++) {
                this._uiItem[i].ui.addEventListener(InteractiveEvent.Down, this.butClik, this);
            }
            this.loadConfigCom()

            Pan3d.TimeUtil.addFrameTick((t: number) => { this.update(t) });
        }
        protected butClik(evt: InteractiveEvent): void {
            for (var i: number = 0; i < this._uiItem.length; i++) {
                var $vo: FolderName = <FolderName>this._uiItem[i]
                if ($vo.ui == evt.target) {
                    $vo.folderMeshVo.fileXmlVo.isOpen = !$vo.folderMeshVo.fileXmlVo.isOpen;
              
                }
            }
            this.refrish();
        }
        protected loadConfigCom(): void {
            LoadManager.getInstance().load(Scene_data.fileuiRoot+ "folder.txt", LoadManager.XML_TYPE,
                ($xmlStr: string) => {
                    FileXmlVo.makeBaseXml($xmlStr);
                    this.refrish()
                });
        }
        private fileItem: Array<FolderMeshVo>;
        public getCharNameMeshVo(value: FileXmlVo): FolderMeshVo {
            var $vo: FolderMeshVo = new FolderMeshVo;
            $vo.fileXmlVo = value;
     
            this.showTemp($vo);
            return $vo;
        }
        private refrish(): void {
            var $item: Array<FileXmlVo> = FileXmlVo.getListItem(-1);
            this.removeHideItem($item)
            this.addNewFolderNameToItem($item)
            this.resetChildItemAll(); //重算子目录

            FolderPanel.tySkip=0
            this.mathFileCellHeight(0)
 
            for (var i: number = 0; i < this.fileItem.length; i++) {
                var layer: number = FileXmlVo.getFileSonLayer(this.fileItem[i].fileXmlVo.id)
                this.fileItem[i].pos.y = 20 * i;
                this.fileItem[i].pos.x = 50 * layer;

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
                        this.fileItem[i].ty = FolderPanel.tySkip
                        FolderPanel.tySkip++
                        this.mathFileCellHeight(this.fileItem[i].fileXmlVo.id)
                    }
                }
            } 
         
        
        }

        private resetChildItemAll(): void {
            for (var i: number = 0; i < this.fileItem.length; i++) {
                this.fileItem[i].childItem=[]
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