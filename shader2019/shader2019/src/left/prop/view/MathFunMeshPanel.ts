module prop {
    import ModuleEventManager = Pan3d.ModuleEventManager;
    export class MathFunMeshPanel extends MetaDataView {

        private mathFunNodeUI: materialui.MathFunNodeUI;
        public getView(): Array<any> {
            var ary: Array<any> =
                [
                    { Type: ReflectionData.AgalFunUI, Label: "函数名:", FunKey: "constValue", target: this,  Step: 0.01 },

                ];
            return ary;
        }
        public set data(value: any) {
            this._data = value;
            this.mathFunNodeUI = this._data;
            this.refreshViewValue();
            this.setInputTxtPos()
        }
        private chatHtmlInput: HTMLTextAreaElement;
        private setInputTxtPos(): void {
            if (!this.chatHtmlInput) {
                this.chatHtmlInput = document.createElement("textarea")
                this.chatHtmlInput.style.position = "absolute";
                this.chatHtmlInput.style["z-index"] = 100
                this.chatHtmlInput.style.background = "transparent"
                this.chatHtmlInput.style.color = "#ffffff";
                document.body.appendChild(this.chatHtmlInput);
                this.chatHtmlInput.addEventListener("change", (cevt: any) => { this.changeFile(cevt) });
            }

            this.chatHtmlInput.style.left = "10px";
            this.chatHtmlInput.style.top = this.top+60+ "px";
     

            var tw: number =280
            var th: number = 280;
            var textSize: number = 100
            this.chatHtmlInput.style.fontSize = String(12) + "px";
            this.chatHtmlInput.style.width = String(tw) + "px";
            this.chatHtmlInput.style.height = String(th) + "px";
            this.chatHtmlInput.value = (<materialui.NodeTreeFun>this.mathFunNodeUI.nodeTree).funStr
         
            this.resize()
        }
        private changeFile(evt: any): void {
            var $agalStr: string = this.chatHtmlInput.value
            if (materialui.NodeTreeFun.isNeedChangePanel($agalStr, (<materialui.NodeTreeFun>this.mathFunNodeUI.nodeTree).funStr)) {
                this.mathFunNodeUI.inPutFunStr($agalStr)
            } else {
                (<materialui.NodeTreeFun>this.mathFunNodeUI.nodeTree).funStr = $agalStr
                this.changeData();
            }
      
        }
        protected resize(): void {
            super.resize()
            if (this.chatHtmlInput) {
                this.chatHtmlInput.style.top = this.top + 60 + "px";
            }
          
        }
        public destory(): void {
            super.destory()
            if (this.chatHtmlInput) {
                this.chatHtmlInput.removeEventListener("change", (cevt: any) => { this.changeFile(cevt) });
                document.body.removeChild(this.chatHtmlInput);
                this.chatHtmlInput = null
            }
        }
        public get data(): any {
            return this._data
        }

        public get constValue(): materialui.MathFunNodeUI {
            return this.mathFunNodeUI
        }
        public set constValue(value: materialui.MathFunNodeUI) {
            
            this.changeData();

        }
        private changeData(): void {
            ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
        }
    }
}