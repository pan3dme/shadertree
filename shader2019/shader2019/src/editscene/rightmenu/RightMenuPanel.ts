module materialui {
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

    export class MenuListData {
        public label: string
        public key: string;
        public subMenu: Array<MenuListData>;

        constructor($label: string, $key: string = null) {
            this.label = $label;
            if ($key) {
                this.key = $key;
            } else {
                this.key = $label;
            }

        }

    }

    export class RightMenuVo extends UICompenent {
        public txt: FrameCompenent
 
        public data: MenuListData;
        public bottomRender: UIRenderComponent
        private panel: RightMenuPanel
        public initData($panel: RightMenuPanel, $bottomRender: UIRenderComponent, $midRender: UIRenderComponent, $data: MenuListData, $frameId: number, $isSub: boolean = false): void {
            this.panel = $panel
            this.data = $data
            if ($isSub) {
                this.txt = this.panel.addEvntBut("b_sub_menu", $midRender);
            } else {
                this.txt = this.panel.addEvntBut("b_main_menu", $midRender);
            }

            this.txt.goToAndStop($frameId);
            this.bottomRender = $bottomRender
            this.drawFrontToFrame(ColorType.Black000000 + $data.label, "#6c6c6c")

         

            this.txt.addEventListener(InteractiveEvent.Move, this.butMove, this);

        }
        public removeStage(): void {
            this.panel.removeChild(this.txt);
     
        }
        protected butMove(evt: InteractiveEvent): void {
            this.panel.moseMoveTo(evt.target)
        }
        public set x(value: number) {

            this._x = value;
  
            this.txt.x = this._x

        }
        public set y(value: number) {

            this._y = value;
  
            this.txt.y = this._y

        }


        public drawFrontToFrame($str: string, backColor: string): void {
            var $toRect: Rectangle = this.txt.getSkinCtxRect()
            var $ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D($toRect.width, $toRect.height, false);
      

            $ctx.fillStyle = "#1d1f1d"; // text color
            $ctx.fillRect(0, 0, $toRect.width, $toRect.height)

            $ctx.fillStyle = backColor; // text color
            $ctx.fillRect(0, 0, $toRect.width, $toRect.height - 1)
            LabelTextFont.writeSingleLabelToCtx($ctx, $str, 14, 0, 5, TextAlign.CENTER);
            this.txt.drawToCtx(this.bottomRender.uiAtlas, $ctx);
        }

    }

    export class RightMenuPanel extends UIPanel {


        public _bottomRender: UIRenderComponent;
        public _midRender: UIRenderComponent;
        public _topRender: UIRenderComponent;



        public constructor() {
            super();

            this.width = 200;
            this.height = 200;

            this._bottomRender = new UIRenderComponent;
            this.addRender(this._bottomRender);

            this._midRender = new UIRenderComponent;
            this.addRender(this._midRender);

            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);

            this._bottomRender.uiAtlas = BaseMaterialNodeUI.baseUIAtlas;
            this._midRender.uiAtlas = BaseMaterialNodeUI.baseUIAtlas;
            this._topRender.uiAtlas = BaseMaterialNodeUI.baseUIAtlas;


            this.loadConfigCom();
        }
        private menuTextItem: Array<MenuListData>;
        private mainMenuUiArr: Array<RightMenuVo>
        private subMenuUiArr: Array<RightMenuVo>
        private initMainMenu(): void {

            this.menuTextItem = new Array();
            this.menuTextItem.push(this.getMathListData());
            this.menuTextItem.push(this.getV2CListData());
            this.menuTextItem.push(this.getTextureListData());
            this.menuTextItem.push(this.getOtherListData());


            this.mainMenuUiArr = new Array()
            this.subMenuUiArr = new Array


            for (var i: number = 0; i < this.menuTextItem.length; i++) {
                var $vo: RightMenuVo = new RightMenuVo;
                $vo.initData(this, this._bottomRender, this._midRender, this.menuTextItem[i], i);
                $vo.y = i * 21;
                $vo.x = 0;
                this.mainMenuUiArr.push($vo)

            }
        }
        private getMathListData(): MenuListData {
            var $vo: MenuListData = new MenuListData("Math", "1")
            $vo.subMenu = new Array;
            $vo.subMenu.push(new MenuListData("ADD", "11"));
            $vo.subMenu.push(new MenuListData("SUB", "12"));
            $vo.subMenu.push(new MenuListData("MUL", "13"));
            $vo.subMenu.push(new MenuListData("DIV", "14"));
            $vo.subMenu.push(new MenuListData("SIN", "15"));
            $vo.subMenu.push(new MenuListData("COS", "16"));
            //$vo.subMenu.push(new MenuListData("LERP", "17"));
            //$vo.subMenu.push(new MenuListData("MIN", "18"));
            return $vo;

        }
        private getV2CListData(): MenuListData {
            var $vo: MenuListData = new MenuListData("常数", "2")
            $vo.subMenu = new Array;
            //     $vo.subMenu.push(new MenuListData("vec4", "21"));
            $vo.subMenu.push(new MenuListData("vec3", "22"));
            $vo.subMenu.push(new MenuListData("vec2", "23"));
            $vo.subMenu.push(new MenuListData("float", "24"));
            $vo.subMenu.push(new MenuListData("Time", "25"));
            $vo.subMenu.push(new MenuListData("Normal", "26"));
            return $vo;
        }
        private getTextureListData(): MenuListData {
            var $vo: MenuListData = new MenuListData("纹理", "3")
            $vo.subMenu = new Array;
            $vo.subMenu.push(new MenuListData("纹理贴图", "31"));
            $vo.subMenu.push(new MenuListData("纹理坐标", "32"));
            $vo.subMenu.push(new MenuListData("纹理滚动", "33"));
            $vo.subMenu.push(new MenuListData("Cube纹理", "34"));
            $vo.subMenu.push(new MenuListData("3D贴图", "35"));
            
            return $vo;
        }
        private getOtherListData(): MenuListData {
            var $vo: MenuListData = new MenuListData("其它", "4")
            $vo.subMenu = new Array;
            $vo.subMenu.push(new MenuListData("菲捏尔", "41"));
            $vo.subMenu.push(new MenuListData("導入材質", "42"));
            $vo.subMenu.push(new MenuListData("函数", "43"));
            $vo.subMenu.push(new MenuListData("文件列表", "44"));
            return $vo;
        }

        public moseMoveTo($ui: FrameCompenent): void {

            var isSub: boolean = false

            for (var j: number = 0; j < this.subMenuUiArr.length; j++) {
                if (this.subMenuUiArr[j].txt == $ui) {
   
                    isSub = true
                } else {
          
                }
                this.drwarColor(this.subMenuUiArr[j], this.subMenuUiArr[j].txt == $ui)
            }
            if (!isSub) {
                for (var i: number = 0; i < this.mainMenuUiArr.length; i++) {
                    if (this.mainMenuUiArr[i].txt == $ui) {
          
                        this.showSubMenu(this.mainMenuUiArr[i].data.subMenu, i);
                    } else {
            
                    }
                    this.drwarColor(this.mainMenuUiArr[i], this.mainMenuUiArr[i].txt == $ui)
                }
      
            }

        }
        private drwarColor(vo: RightMenuVo, value: boolean): void {
            if (value) {
                vo.drawFrontToFrame(ColorType.Whiteffffff + vo.data.label, "#555555")
            } else {
                vo.drawFrontToFrame(ColorType.Black000000 + vo.data.label, "#6c6c6c")
            }

        }
        private clearSubMenu(): void {
            while (this.subMenuUiArr.length) {
                var $vo: RightMenuVo = this.subMenuUiArr.pop();
                $vo.removeStage()
            }
            this.lastShowsubMenu = null

        }


        private lastShowsubMenu: Array<MenuListData>
        public showSubMenu($subMenu: Array<MenuListData>, ty: number): void {
            if ($subMenu) {
                if (this.lastShowsubMenu != $subMenu) {
                    this.clearSubMenu();
                    for (var i: number = 0; i < $subMenu.length; i++) {
                        var $vo: RightMenuVo = new RightMenuVo;
                        $vo.initData(this, this._bottomRender, this._midRender, $subMenu[i], i, true);
                        $vo.y = (ty + i) * 21;
                        $vo.x = 102;
                        this.subMenuUiArr.push($vo);
                    }

                }
            } else {
                this.clearSubMenu()
            }
            this.lastShowsubMenu = $subMenu;
        }

        protected butClik(evt: InteractiveEvent): void {
            var $ui: FrameCompenent = <FrameCompenent>evt.target;
            var seleceVo: RightMenuVo;
            for (var j: number = 0; j < this.subMenuUiArr.length; j++) {
                if (this.subMenuUiArr[j].txt == $ui) {
                    seleceVo = this.subMenuUiArr[j]
                }
            }
            for (var i: number = 0; i < this.mainMenuUiArr.length; i++) {
                if (this.mainMenuUiArr[i].txt == $ui) {
                    seleceVo = this.mainMenuUiArr[i]
                }
            }
            if (seleceVo) {
                switch (seleceVo.data.key) {
                    case "1":
                        break
                    case "2":
                        break
                    case "3":
                        break
                    case "4":
                        break
                    case "11":
                        this.onTempNode(new MathAddNodeUI(), evt)
                        break;
                    case "12":
                        this.onTempNode(new MathSubNodeUI(), evt)
                        break;
                    case "13":
                        this.onTempNode(new MathMulNodeUI(), evt)
                        break;
                    case "14":
                        this.onTempNode(new MathDivNodeUI(), evt)
                        break;
                    case "15":
                        this.onTempNode(new MathSinNodeUI(), evt)
                        break;
                    case "16":
                        this.onTempNode(new MathCosNodeUI(), evt)
                        break;
                    case "22":
                        this.onTempNode(new ConstVec3NodeUI(), evt)
                        break;
                    case "23":
                        this.onTempNode(new ConstVec2NodeUI(), evt)
                        break;
                    case "24":
                        this.onTempNode(new ConstFloatNodeUI(), evt)
                        break;
                    case "25":
                        this.onTempNode(new TimeNodeUI(), evt)
                        break;
                    case "26":
                        this.onTempNode(new NormalNodeUI(), evt)
                        break;
                    case "31":
                        var textui: TextureSampleNodeUI = new TextureSampleNodeUI()
                        this.onTempNode(textui, evt)
                        textui.creatBase("assets/white.jpg");
                        break;
            
                 
                    case "32":
                        this.onTempNode(new TexCoordNodeUI(), evt)
                        break;
                    case "33":
                        this.onTempNode(new PannerNodeUI(), evt)
                        break;
                    case "34":
                        var textCubeui: TextureCubeNodeUI = new TextureCubeNodeUI()
                        this.onTempNode(textCubeui, evt)
                        textCubeui.creatBase("assets/white.jpg");
                        break;
                    case "35":
                        var text3dui: Texture3DNodeUI = new Texture3DNodeUI()
                        this.onTempNode(text3dui, evt)
                        text3dui.creatBase("assets/white.jpg");
                        break;
                    case "41":
                        this.onTempNode(new FresnelNodeUI(), evt)
                        break;
                    case "42":
                        //this.selectInputDae(evt)
                        filemodel.InputMaterialModel.getInstance().inputFile(evt)
                        break;
                    case "43":
                        this.onTempNode(new MathFunNodeUI(), evt)
                        break;
                    case "44":

  

                        Pan3d.ModuleEventManager.dispatchEvent(new folder.FolderEvent(folder.FolderEvent.SHOW_FOLDER_PANEL));
                        break;
                    default:
                        break;
                }

                console.log(seleceVo.data.key)

                ModuleEventManager.dispatchEvent(new RightMenuEvent(RightMenuEvent.HIDE_RIGHT_MENU));
            }


        }
        private _inputHtmlSprite: HTMLInputElement
        protected selectInputDae(evt: InteractiveEvent): void {
            this._inputHtmlSprite = <HTMLInputElement>document.createElement('input');
            this._inputHtmlSprite.setAttribute('id', '_ef');
            this._inputHtmlSprite.setAttribute('type', 'file');
            this._inputHtmlSprite.setAttribute("style", 'visibility:hidden');
            this._inputHtmlSprite.click();
            this._inputHtmlSprite.value;
            this._inputHtmlSprite.addEventListener("change", (cevt: any) => { this.changeFile(cevt) });
        }
        private changeFile(evt: any): void {
            for (var i: number = 0; i < this._inputHtmlSprite.files.length && i < 1; i++) {
                var simpleFile: File = <File>this._inputHtmlSprite.files[i];
                if (!/image\/\w+/.test(simpleFile.type)) {
                    var $reader: FileReader = new FileReader();
                    $reader.readAsText(simpleFile);
                    $reader.onload = ($temp: Event) => { this.readOnLod($temp) }
                } else {
                    alert("请确保文件类型为图像类型");
                }

            }
            this._inputHtmlSprite = null;
        }
        private readOnLod($temp: Event): void {
            var $reader: FileReader = <FileReader>($temp.target);
            var $materailTree: MaterialTree = new MaterialTree;
            $materailTree.url = "selectUrl.txt";
            var $obj: any = JSON.parse(<string>$reader.result)
            $materailTree.setData($obj);


            var $materialEvent: MaterialEvent = new MaterialEvent(MaterialEvent.INUPT_NEW_MATERIAL_FILE)
            $materialEvent.materailTree = $materailTree
            ModuleEventManager.dispatchEvent($materialEvent);


        }

        private onTempNode($ui: BaseMaterialNodeUI, evt: InteractiveEvent): void {
            $ui.left = evt.x / MtlUiData.Scale - 200;
            $ui.top = evt.y / MtlUiData.Scale - 30;
            MaterialCtrl.getInstance().addNodeUI($ui)
        }


        private drawFrontToFrame($ui: FrameCompenent, $str: string, $align: string = TextAlign.CENTER): void {
            var $toRect: Rectangle = $ui.getSkinCtxRect()
            var $ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D($toRect.width, $toRect.height, false);
            LabelTextFont.writeSingleLabelToCtx($ctx, $str, 12, 0, 0, $align);
            $ui.drawToCtx(this._topRender.uiAtlas, $ctx);
        }

        protected loadConfigCom(): void {

            this.initMainMenu();
        }
        public refrish(): void {
            this.clearSubMenu();
        }

    }
}