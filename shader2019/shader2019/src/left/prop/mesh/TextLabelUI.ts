module prop {
    class TextLabelUIMeshVo extends Pan3d.baseMeshVo {
        private _name: string;
        public needDraw: boolean;
        private _labelWidth: number
        public set name(value: string) {
            this._name = value;
            this.needDraw = true;
            this.labelWidth = 128;
        }
        public get name(): string {
            return this._name;
        }
        public set labelWidth(value: number) {
            this._labelWidth = value;
            this.needDraw = true;
        }
        public get labelWidth(): number {
            return this._labelWidth;
        }
        public destory(): void {
            this.pos = null;
            this._name = null;
            this.needDraw = null;
            this.clear = true
        }
        public textLabelUIDisp2D:TextLabelUIDisp2D
    }
    import Disp2DBaseText = Pan3d.Disp2DBaseText;
    import LabelTextFont = Pan3d.LabelTextFont;
    import Matrix3D = Pan3d.Matrix3D;
    import EventDispatcher = Pan3d.EventDispatcher;
    import Dis2DUIContianerPanel = Pan3d.Dis2DUIContianerPanel;
    import UIManager = Pan3d.UIManager;
    import Rectangle = Pan3d.Rectangle;
    import TimeUtil = Pan3d.TimeUtil;
    import TextAlign = Pan3d.TextAlign;

    export class TextLabelUIDisp2D extends Disp2DBaseText {
        private labelNameMeshVo: TextLabelUIMeshVo
        private static baseUitr: Rectangle
        public makeData(): void {
            if (this._data) {
                this.labelNameMeshVo = <TextLabelUIMeshVo>this.data;
                if (this.lastKey != this.labelNameMeshVo.name) {

                    var bw: number = 256 * 0.5;
                    var bh: number = 30 * 0.5;
                    this.ui.width = bw;
                    this.ui.height = bh;

                    if (!TextLabelUIDisp2D.baseUitr) {
                        TextLabelUIDisp2D.baseUitr = new Rectangle(0, 0, this.ui.tr.width, this.ui.tr.height)
                    }
                    var xScale: number = this.labelNameMeshVo.labelWidth / bw;

                    this.ui.width = bw * xScale;
                    this.ui.tr.width = TextLabelUIDisp2D.baseUitr.width * xScale;


                    this.lastKey = this.labelNameMeshVo.name
                    LabelTextFont.writeSingleLabel(this.parent.uiAtlas, this.textureStr, this.labelNameMeshVo.name, 30, TextAlign.LEFT, "#ffffff", "#27262e");
                }
                this.labelNameMeshVo.needDraw = false;
            }
        }
        private tempMatrix: Matrix3D = new Matrix3D;
        public update(): void {
            if (this.labelNameMeshVo) {
                if (this.labelNameMeshVo.needDraw) {
                    this.makeData();
                }
                if (this.labelNameMeshVo.pos) {
                    if (this.labelNameMeshVo.visible) {
                        if (this.needUpData(this.labelNameMeshVo.pos) || this.labelNameMeshVo.visibleChange) {
                      
                            this.ui.x = this.labelNameMeshVo.pos.x;
                            this.ui.y = this.labelNameMeshVo.pos.y;

                            this.oldPos.x = this.labelNameMeshVo.pos.x;
                            this.oldPos.y = this.labelNameMeshVo.pos.y;
                            this.labelNameMeshVo.visibleChange = false;
                        }
                    } else {
                        this.ui.x = 10000
                    }
                }
                if (this.labelNameMeshVo.clear) {
                    this.ui.parent.removeChild(this.ui);
                    this._data = null;
                }
            }
        }
    }


    export class TextLabelUI extends EventDispatcher{
        private static _dis2DUIContianer: Dis2DUIContianerPanel
        public constructor() {
            super();
            if (!TextLabelUI._dis2DUIContianer) {
                TextLabelUI._dis2DUIContianer = new Dis2DUIContianerPanel(TextLabelUIDisp2D, new Rectangle(0, 0, 256, 30), 60);
                TextLabelUI._dis2DUIContianer.left = 0;
                TextLabelUI._dis2DUIContianer.top = 0;
                TextLabelUI._dis2DUIContianer.layer = 101;
                UIManager.getInstance().addUIContainer(TextLabelUI._dis2DUIContianer);
                TimeUtil.addFrameTick((t: number) => { this.upFrame(t) });
 
            }
            this.textLabelUIMeshVo = this.getCharNameMeshVo();

            this.initView();
            this.resize();
        }
        public destory(): void {
            this.textLabelUIMeshVo.clear=true
        }
        protected initView(): void
        {
            this.textLabelUIMeshVo.name = "Vec3:";
            this.textLabelUIMeshVo.labelWidth = 30;
        }
        private resize(): void
        {
            this.textLabelUIMeshVo.pos.x = this._x;
            this.textLabelUIMeshVo.pos.y = this._y;
        }
        private upFrame(t: number): void {
            TextLabelUI._dis2DUIContianer.update(t);
        }
        public get label(): string {
            return "";
        }
        public set label(value: string) {
            this.textLabelUIMeshVo.name = value;
       
        }
    
        protected textLabelUIMeshVo: TextLabelUIMeshVo
        public getCharNameMeshVo(value: string = "测试名"): TextLabelUIMeshVo {
            var $vo: TextLabelUIMeshVo = new TextLabelUIMeshVo;
            $vo.name = value
            $vo.pos = new Vector3D(0, 50, 0);
            $vo.textLabelUIDisp2D = <TextLabelUIDisp2D>TextLabelUI._dis2DUIContianer.showTemp($vo);
            return $vo;
        }
        private _x: number=0
        private _y: number=0;
        public set x(value: number) {
            this._x = value;
            this.resize()
        }
        public get x(): number {
            return this._x
        }

        public set y(value: number) {
            this._y = value;
            this.resize()
        }
        public get y(): number {
            return this._y
        }

    }
} 