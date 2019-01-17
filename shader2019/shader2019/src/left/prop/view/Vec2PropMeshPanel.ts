module prop {
    import ModuleEventManager = Pan3d.ModuleEventManager;
    export class Vec2PropMeshPanel extends MetaDataView {
        private constVec2NodeUI: materialui.ConstVec2NodeUI;
        public getView(): Array<any> {
            var ary: Array<any> =
                [
                    { Type: ReflectionData.NumberInput, Label: "x:", FunKey: "constXValue", target: this, Step: 0.1 },
                    { Type: ReflectionData.NumberInput, Label: "y:", FunKey: "constYValue", target: this, Step: 0.1 },
                ];
            return ary;
        }
        private _ve2d: Vector2D
        public set data(value: any) {
            this._data = value;
            this.constVec2NodeUI = this._data;

            this._ve2d = this.constVec2NodeUI.constValue
            this.refreshViewValue()


        }
        public get data(): any {
            return this._data
        }
        public get constXValue(): number {
            return this._ve2d.x
        }
        public set constXValue(value: number) {
            this._ve2d.x = value
            this.constVec2NodeUI.constValue = this._ve2d
            this.changeData()
        }

        public get constYValue(): number {

            return this._ve2d.y
        }
        public set constYValue(value: number) {
            this._ve2d.y = value
            this.constVec2NodeUI.constValue = this._ve2d
            this.changeData()
        }

 
        private changeData(): void {
            ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
        }
    }
}