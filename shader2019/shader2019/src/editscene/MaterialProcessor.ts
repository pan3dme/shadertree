module materialui {

    import BaseEvent = Pan3d.BaseEvent;
    import Vector2D = Pan3d.Vector2D;
    import Module = Pan3d.Module;
    import Processor = Pan3d.Processor;
    import BaseProcessor = Pan3d.BaseProcessor;
    import UIManager = Pan3d.UIManager;
    import ModuleEventManager = Pan3d.ModuleEventManager;
    import KeyboardType = Pan3d.KeyboardType;
    import Scene_data = Pan3d.Scene_data;
    import MouseType = Pan3d.MouseType;
    import UICompenent = Pan3d.UICompenent;
    import UIConatiner = Pan3d.UIConatiner;
    import Rectangle = Pan3d.Rectangle
    import UIAtlas = Pan3d.UIAtlas;
    
    export class MaterialEvent extends BaseEvent {
        public static SHOW_MATERIA_PANEL: string = "INIT_MATERIA_PANEL"; //
        public static SAVE_MATERIA_PANEL: string = "SAVE_MATERIA_PANEL"; //
        public static SELECT_MATERIAL_NODE_UI: string = "SELECT_MATERIAL_NODE_UI"; //
        public static COMPILE_MATERIAL: string = "COMPILE_MATERIAL"; //
        public static SCENE_UI_TRUE_MOVE: string = "SCENE_UI_TRUE_MOVE"; //
        public static INUPT_NEW_MATERIAL_FILE: string = "CLEAR_MATERIAL_ALL_UI"; //
        public nodeUi: BaseMaterialNodeUI
        public v2d: Vector2D
        public materailTree: MaterialTree

    }
    export class MaterialModule extends Module {
        public getModuleName(): string {
            return "MaterialModule";
        }
        protected listProcessors(): Array<Processor> {
            return [new MaterialProcessor()];
        }
    }

    export class MaterialProcessor extends BaseProcessor {
        public getName(): string {
            return "MaterialProcessor";
        }

        protected receivedModuleEvent($event: BaseEvent): void {
            if ($event instanceof MaterialEvent) {
                var $materialEvent: MaterialEvent = <MaterialEvent>$event;
                if ($materialEvent.type == MaterialEvent.SHOW_MATERIA_PANEL) {
                    this.openMaterialPanel()
                }
                if ($materialEvent.type == MaterialEvent.SAVE_MATERIA_PANEL) {
                    this.saveMateriaPanel()
                }
                
                if ($materialEvent.type == MaterialEvent.SELECT_MATERIAL_NODE_UI) {
                    this.selectNodeUi($materialEvent.nodeUi)
                }
                if ($materialEvent.type == MaterialEvent.COMPILE_MATERIAL) {
                    MaterialCompile.getInstance().compile(MaterialCtrl.getInstance().nodeList, this.baseMaterialTree)
                }
                if ($materialEvent.type == MaterialEvent.SCENE_UI_TRUE_MOVE) {
                    this.stageMoveTx($materialEvent.v2d)
                }
                if ($materialEvent.type == MaterialEvent.INUPT_NEW_MATERIAL_FILE) {
                    this.clearAllMaterialUi($materialEvent.materailTree);
                }

                
            }
            if ($event instanceof MEvent_Material_Connect) {

                var $mevent_Material_Connect: MEvent_Material_Connect = <MEvent_Material_Connect>$event;
                if ($mevent_Material_Connect.type == MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STARTDRAG) {
                    this.startDragLine($mevent_Material_Connect.itemNode);
                }
                if ($mevent_Material_Connect.type == MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STOPDRAG) {
                    this.stopDragLine($mevent_Material_Connect.itemNode);
                }
                if ($mevent_Material_Connect.type == MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_REMOVELINE) {
                    this.removeLine($mevent_Material_Connect.line);
                }
                if ($mevent_Material_Connect.type == MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_DOUBLUELINE) {
        
                    this.setConnetLine($mevent_Material_Connect.startNode, $mevent_Material_Connect.endNode);
                }


            }
     

        }
        private clearAllMaterialUi($materailTree: MaterialTree): void {
            var $len: number = UIManager.getInstance()._containerList.length
            for (var i: number = ($len-1); i >=0; i--) {
                var $temp: BaseMaterialNodeUI = <BaseMaterialNodeUI>UIManager.getInstance()._containerList[i]
                if ($temp.name) {
                    this.delUI($temp);
                }
            }
           
            this.stageMoveTx(new Vector2D(-Arpg2dGameStart.stagePos.x, - Arpg2dGameStart.stagePos.y))
            MtlUiData.Scale = 1;

            MaterialCtrl.getInstance().initData();
            this.baseMaterialTree = $materailTree;
            MaterialViewBuildUtils.getInstance().setData($materailTree.data);

            this.resetMaterialListUi()
        }
        private resetMaterialListUi(): void {
          
     

            var $len: number = UIManager.getInstance()._containerList.length
            var $rect: Rectangle
            for (var i: number = 0; i < $len ;i++) {
                var $ui: BaseMaterialNodeUI = <BaseMaterialNodeUI>UIManager.getInstance()._containerList[i]
                if ($ui.name) {
                    var temp: Rectangle = new Rectangle($ui.x, $ui.y, $ui.x + $ui.width, $ui.y + $ui.height)
                    if ($rect) {
                        $rect.x = Math.min($rect.x, temp.x)
                        $rect.y = Math.min($rect.y, temp.y)
                        $rect.width = Math.max($rect.width, temp.width)
                        $rect.height = Math.max($rect.height, temp.height)
                    } else {
                        $rect = new Rectangle(temp.x, temp.y, temp.width, temp.height)
                    }
                }
       
            }
            if ($rect) {
                console.log($rect)
                console.log(Arpg2dGameStart.stagePos)
            }
        }
 
        public  setConnetLine($startItem: ItemMaterialUI, $endItem: ItemMaterialUI):void {
            this.lineContainer.addConnentLine($startItem, $endItem);

        }
        private  _materialTree: MaterialTree;
        private saveMateriaPanel(): void {
            this._materialTree = new MaterialTree()
            this._materialTree.data= MaterialCtrl.getInstance().getObj()
            console.log(this._materialTree.data);

            filemodel.FileModel.getInstance().upMaterialTreeToWeb(this._materialTree)


        }
 
        private selectNodeUi($nodeUi: BaseMaterialNodeUI): void {
       
            for (var i: number = 0; i < UIManager.getInstance()._containerList.length; i++) {
                var $temp: BaseMaterialNodeUI = <BaseMaterialNodeUI>UIManager.getInstance()._containerList[i]
                if ($temp) {
                    $temp.select = Boolean($nodeUi == $temp);
                }
            
            }
        }
  
        public  removeLine($line:MaterialNodeLineUI):void{
            this.lineContainer.removeLine($line);
        }
        public  startDragLine($node:ItemMaterialUI):void{
            this.lineContainer.startLine($node);
        }

        public  stopDragLine($node: ItemMaterialUI): void {
            this.lineContainer.stopLine($node);
        }


        protected listenModuleEvents(): Array<BaseEvent> {
            return [
                new MaterialEvent(MaterialEvent.SHOW_MATERIA_PANEL),
                new MaterialEvent(MaterialEvent.SELECT_MATERIAL_NODE_UI),
                new MaterialEvent(MaterialEvent.SAVE_MATERIA_PANEL),
                new MaterialEvent(MaterialEvent.COMPILE_MATERIAL),
                new MaterialEvent(MaterialEvent.SCENE_UI_TRUE_MOVE),
                new MaterialEvent(MaterialEvent.INUPT_NEW_MATERIAL_FILE),
                
                new MEvent_Material_Connect(MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STARTDRAG),
                new MEvent_Material_Connect(MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STOPDRAG),
                new MEvent_Material_Connect(MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_REMOVELINE),
                new MEvent_Material_Connect(MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_DOUBLUELINE),

            ];
        }
        private openMaterialPanel(): void
        {
            Arpg2dGameStart.stagePos = new Vector2D()
            BaseMaterialNodeUI.baseUIAtlas = new UIAtlas()
            BaseMaterialNodeUI.baseUIAtlas.setInfo("pan/marmoset/uilist/baseui.txt", "pan/marmoset/uilist/baseui.png", () => { this.loadConfigCom() });
    

        }
        private lineContainer: MaterialLineContainer
        private loadConfigCom(): void {

            this.lineContainer = new MaterialLineContainer()
            UIManager.getInstance().addUIContainer(this.lineContainer);

            this.readMaterialTree()

            document.addEventListener(MouseType.MouseWheel, ($evt: MouseWheelEvent) => { this.onMouseWheel($evt) });
            document.addEventListener(MouseType.MouseDown, ($evt: MouseEvent) => { this.onMouse($evt) });
            document.addEventListener(MouseType.MouseMove, ($evt: MouseEvent) => { this.onMouseMove($evt) });
            document.addEventListener(MouseType.MouseUp, ($evt: MouseEvent) => { this.onMouseUp($evt) });

            document.addEventListener(MouseType.KeyDown, ($evt: KeyboardEvent) => { this.onKeyDown($evt) })
            document.addEventListener(MouseType.KeyUp, ($evt: KeyboardEvent) => { this.onKeyUp($evt) })
           
            document.addEventListener("contextmenu", (event: any) => {
                event.preventDefault();
                var $rightMenuEvet: RightMenuEvent = new RightMenuEvent(RightMenuEvent.SHOW_RIGHT_MENU);
                $rightMenuEvet.posv2d = new Vector2D(event.clientX, event.clientY)
                ModuleEventManager.dispatchEvent($rightMenuEvet);

            });

          
        }
        private baseMaterialTree: MaterialTree
        private readMaterialTree(): void {
       
            //var $url: string = "pan/marmoset/uilist/baseTexturedata0.txt";
            //MaterialTreeManager.getInstance().getMaterial($url, ($materialTree: MaterialTree) => {
            //    this.baseMaterialTree = $materialTree
            //    MaterialViewBuildUtils.getInstance().addFun = (ui: BaseMaterialNodeUI) => { MaterialCtrl.getInstance().addNodeUI(ui)};
            //    MaterialViewBuildUtils.getInstance().setData($materialTree.data)
            //    ModuleEventManager.dispatchEvent(new left.LeftEvent(left.LeftEvent.SHOW_LEFT_PANEL));
            //});
            MaterialViewBuildUtils.getInstance().addFun = (ui: BaseMaterialNodeUI) => { MaterialCtrl.getInstance().addNodeUI(ui) };
            ModuleEventManager.dispatchEvent(new left.LeftEvent(left.LeftEvent.SHOW_LEFT_PANEL));
          //  filemodel.FileModel.getInstance().selectFileById(1)
        }
       


        public onKeyDown($evt: KeyboardEvent): void {
            Arpg2dGameStart.altKey = $evt.altKey
            switch ($evt.keyCode) {
                case KeyboardType.C:
                    break
                case KeyboardType.Delete:
                    var $selectUi: BaseMaterialNodeUI = this.getSelUI();
                    if ($selectUi ) {
                        if ( !($selectUi instanceof ResultNodeUI)) {
                            this.delUI($selectUi);
                        }
                    }
                    break
                case KeyboardType.S:
                    if ($evt.altKey) {
                        ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.SAVE_MATERIA_PANEL));
                   
                    }
                    break
                case KeyboardType.O:
                    //ModuleEventManager.dispatchEvent(new left.LeftEvent(left.LeftEvent.SHOW_LEFT_PANEL));
                 
                    break
                case KeyboardType.Z:

                    MtlUiData.Scale += 0.1
                    UIManager.getInstance().resize();

                    break
                default:
                    break
            }
          
        }
        private delUI($ui: BaseMaterialNodeUI): void {
           
            MaterialCtrl.getInstance().removeUI($ui)
            $ui.removeAllNodeLine();
            UIManager.getInstance().removeUIContainer($ui)
          
        }
        private getSelUI(): BaseMaterialNodeUI {
            for (var i: number = 0; i < UIManager.getInstance()._containerList.length; i++) {
                var $temp: BaseMaterialNodeUI = <BaseMaterialNodeUI>UIManager.getInstance()._containerList[i]
                if ($temp && $temp.select) {
                    return $temp
                }
            }
            return null;
        }
   
        public onKeyUp($evt: KeyboardEvent): void {
            Arpg2dGameStart.altKey = $evt.altKey
        }
        private _isMidelMouse: boolean
        private onMouse($e: MouseEvent): void {
            if ($e.type == MouseType.MouseDown) {
                if ($e.button == 1) {
                    this._isMidelMouse = true
                    this.mouseXY = new Vector2D($e.x, $e.y)
                }
            }


        }
        private onMouseMove($e: MouseEvent): void {
            if (this._isMidelMouse) {
                var $txy: Vector2D = new Vector2D($e.x - this.mouseXY.x, $e.y - this.mouseXY.y)
                $txy.x/= MtlUiData.Scale;
                $txy.y /= MtlUiData.Scale;

                this.stageMoveTx($txy)

          
                this.mouseXY = new Vector2D($e.x, $e.y);
        

            }
        }
        private onMouseUp($e: MouseEvent): void {
            this._isMidelMouse = false
        }
        private mouseXY: Vector2D;
        public onMouseWheel($evt: MouseWheelEvent): void {

       
            var $slectUi: UICompenent = UIManager.getInstance().getObjectsUnderPoint(new Vector2D($evt.x, $evt.y))
 

            if (!$slectUi || $slectUi.parent instanceof BaseMaterialNodeUI) {
                this.changeScalePanle($evt)
            }  
          
         
        }
        private changeScalePanle($evt: MouseWheelEvent): void {

            var $v2d: Vector2D = new Vector2D(($evt.x - Arpg2dGameStart.stagePos.x), ($evt.y - Arpg2dGameStart.stagePos.y))
            var tx: number = $evt.x / MtlUiData.Scale
            var ty: number = $evt.y / MtlUiData.Scale
            var $oldScale: number = MtlUiData.Scale

            var $addScale: number = $evt.wheelDelta > 0 ? +0.1 : -0.1;
            MtlUiData.Scale += $addScale;

            MtlUiData.Scale = Math.max(0.5, MtlUiData.Scale);
            MtlUiData.Scale = Math.min(MtlUiData.Scale, 1.2);

            var $se: number = (MtlUiData.Scale - $oldScale);
            this.stageMoveTx(new Vector2D(-tx * $se / MtlUiData.Scale, -ty * $se / MtlUiData.Scale))
        }
  
           
        private stageMoveTx($txy: Vector2D): void {
            Arpg2dGameStart.stagePos.x += $txy.x;
            Arpg2dGameStart.stagePos.y += $txy.y;
   
            for (var i: number = 0; i < UIManager.getInstance()._containerList.length; i++) {
                var $uiConatiner: UIConatiner = UIManager.getInstance()._containerList[i];
                if ($uiConatiner instanceof BaseMaterialNodeUI) {
                    $uiConatiner.left += $txy.x;
                    $uiConatiner.top += $txy.y;

                    $uiConatiner.uiScale = MtlUiData.Scale;
                }
            
            }
            UIManager.getInstance().resize();
        }
    }
}