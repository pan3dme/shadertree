module materialui {

    export class TimeNodeUI extends BaseMaterialNodeUI {
        private outItem: ItemMaterialUI;
        private _speed: number = 1;
        public constructor() {
            super();

            this.gap = 20;
            this.width = 162;
            this.height = 65;


            this.nodeTree = new NodeTreeTime;
            this.nodeTree.ui = this;
            this.nodeTree.type = NodeTree.TIME;

            this.outItem = new ItemMaterialUI("out", MaterialItemType.FLOAT, false);
            this.addItems(this.outItem);

            this.drawTitleToFrame("Time")
        }
        public get speed(): number {
            return this._speed
        }
        public set speed(value) {
            this._speed = value;
            (<NodeTreeTime>this.nodeTree).speed = this.speed;

        }
        public setData(obj: any): void {
            super.setData(obj);
            this.speed = obj.speed;
            (<NodeTreeTime>this.nodeTree).speed = this.speed;
        }
    }
}