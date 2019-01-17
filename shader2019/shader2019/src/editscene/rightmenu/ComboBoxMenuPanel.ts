﻿module materialui {
    import UIRenderComponent = Pan3d.UIRenderComponent
    import FrameCompenent = Pan3d.FrameCompenent
    import InteractiveEvent = Pan3d.InteractiveEvent
    import Scene_data = Pan3d.Scene_data
    import UICompenent = Pan3d.UICompenent
    import Rectangle = Pan3d.Rectangle
    import TextAlign = Pan3d.TextAlign
    import UIManager = Pan3d.UIManager
    import LabelTextFont = Pan3d.LabelTextFont
    import ColorType = Pan3d.ColorType
    

    export class ComboBoxMenuPanel extends UIPanel {


        public _bottomRender: UIRenderComponent;
        public _midRender: UIRenderComponent;
        public _topRender: UIRenderComponent;



        public constructor() {
            super();

            this.width = 200;
            this.height = 200;
            this.layer = 110;
   

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
        private comboboxItem: Array<FrameCompenent>
        private loadConfigCom(): void {
            this.d_empty_bg = this.addEvntBut("d_empty_bg", this._bottomRender)
            this.d_empty_bg.top = 0;
            this.d_empty_bg.left = 0;
            this.d_empty_bg.width = Scene_data.stageWidth;
            this.d_empty_bg.height = Scene_data.stageHeight;


        }
        private d_empty_bg: UICompenent
        protected butClik(evt: InteractiveEvent): void {
            switch (evt.target) {
                case this.d_empty_bg:
                    break
                default:
                    this._comBoxFun && this._comBoxFun(evt.target.data);
                    break;
            }
            this.hide();
        }
        private _comboxData: Array<any>;
        private _comBoxFun: Function
        public showComboBoxList($comboxData: Array<any>, $comBoxFun: Function): void {
            this._comboxData = $comboxData
            this._comBoxFun = $comBoxFun
            this.clear()
            for (var i: number = 0; i < this._comboxData.length; i++) {
                var $ui: FrameCompenent = this.addEvntBut("d_combobox_frame", this._topRender)
                $ui.goToAndStop(i)
                $ui.data = this._comboxData[i].type
                this.comboboxItem.push($ui);
                this.drawFrontToFrame($ui, ColorType.Black000000+  String(this._comboxData[i].name))
                $ui.x = 0;
                $ui.y = i * 21;
            }

        }
        private hide(): void {
            UIManager.getInstance().removeUIContainer(this);
        }
        private clear(): void {
            if (!this.comboboxItem) {
                this.comboboxItem = new Array()
            }
            while (this.comboboxItem.length) {
                var $ui: FrameCompenent = this.comboboxItem.pop();
                this.removeChild($ui)
            }
        }
        private drawFrontToFrame($ui: FrameCompenent, $str: string, $align: string = TextAlign.CENTER): void {
            var $toRect: Rectangle = $ui.getSkinCtxRect()
            var $ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D($toRect.width, $toRect.height, false);
            $ctx.clearRect(0, 0, $toRect.width, $toRect.height)
            $ctx.fillStyle = "#ffffff"; // text color
            $ctx.fillRect(0, 0, $toRect.width, $toRect.height);
            LabelTextFont.writeSingleLabelToCtx($ctx, $str, 12, 0, 0, $align);
            $ui.drawToCtx(this._topRender.uiAtlas, $ctx);
        }
    }
}