module prop {
    import ModuleEventManager = Pan3d.ModuleEventManager;
    export class NodeTimePropPanel extends MetaDataView {

        private timeNodeUI: materialui.TimeNodeUI;
        public getView(): Array<any> {
            var ary: Array<any> =
                [
                    { Type: ReflectionData.NumberInput, Label: "x:", FunKey: "constValue", target: this, Step: 0.01 },

                ];
            return ary;
        }
        public set data(value: any) {
            this._data = value;
            this.timeNodeUI = this._data;
            this.refreshViewValue()
        }
        public get data(): any {
            return this._data
        }

        public get constValue(): number {
            return this.timeNodeUI.speed
        }
        public set constValue(value: number) {
            this.timeNodeUI.speed = value;
            this.changeData();

        }
        private changeData(): void {
            ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
        }
    }
}