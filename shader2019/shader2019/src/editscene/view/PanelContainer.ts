module materialui {
    import UIRenderComponent = Pan3d.UIRenderComponent
    import FrameCompenent = Pan3d.FrameCompenent
    import Rectangle = Pan3d.Rectangle
    import LabelTextFont = Pan3d.LabelTextFont
    import UIManager = Pan3d.UIManager
    import TextAlign = Pan3d.TextAlign
    export class PanelContainer  {

        private uiRender: UIRenderComponent
        private labelRender: UIRenderComponent
        private panel: UIPanel
        public constructor($panel: UIPanel, $label: UIRenderComponent, $render: UIRenderComponent) {

            this.panel = $panel;
            this.labelRender = $label;
            this.uiRender = $render;

            if (!PanelContainer.strItem) {
                PanelContainer.strItem = new Array()
                PanelContainer.strItem.push("out")
                PanelContainer.strItem.push("rgb")
                PanelContainer.strItem.push("r")
                PanelContainer.strItem.push("g")
                PanelContainer.strItem.push("b")
                PanelContainer.strItem.push("a")
                PanelContainer.strItem.push("rgba")
                PanelContainer.strItem.push("UV")
                PanelContainer.strItem.push("xy")
                PanelContainer.strItem.push("alpha")
                PanelContainer.strItem.push("coordinate")
                PanelContainer.strItem.push("speed")
            }
     

        }
        public removeChild($ui: ItemMaterialUI): void
        {
            this.panel.removeChild($ui.pointframe);
            this.panel.removeChild($ui.labelframe);
            $ui.pointframe = null
            $ui.labelframe = null
            $ui.parent=null
        }
        public addChild($ui: ItemMaterialUI): void
        {
            if (!$ui.pointframe) {
                $ui.pointframe = this.panel.addEvntBut("a_point_frame", this.uiRender);
                $ui.labelframe = this.panel.addEvntBut("a_label_txt", this.labelRender);
                $ui.pointframe.data = $ui
            }
            var $num: number = PanelContainer.strItem.indexOf($ui.titleLabeltext);
            if ($num == -1) {
                switch ($ui.titleLabeltext) {
                    case "漫反射(Diffuse)":
                    case "金属(metallic)":
                    case "高光(Specular)":
                    case "粗糙度(Roughness)":
                    case "法线(Normal)":
                    case "反射(Reflection)":
                    case "表面散射(subsurface)":
                    case "透明度(alpha)":
                    case "不透明蒙版(alphaMask)":
                    case "天空盒(skyBox)":
                        $num = $ui.labelframe.totalcurrent-1
                        break
                    default:
                        PanelContainer.strItem.push($ui.titleLabeltext)
                        $num = PanelContainer.strItem.indexOf($ui.titleLabeltext);
                        $ui.labelframe.goToAndStop($num)
                        this.drawTextToName($ui.labelframe, $ui.titleLabeltext);
                        break;
                }
            }
            $ui.labelframe.goToAndStop($num)

  
            $ui.drawSp();


        }
        private static strItem: Array<string>

        private drawTextToName($ui: FrameCompenent, $str: string): void {

            var $toRect: Rectangle = $ui.getSkinCtxRect()
            var $ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D($toRect.width, $toRect.height, false);
            LabelTextFont.writeSingleLabelToCtx($ctx, $str, 12, 0, 3, TextAlign.CENTER)
            $ui.drawToCtx(BaseMaterialNodeUI.baseUIAtlas, $ctx)

        }
      
        
    }
}