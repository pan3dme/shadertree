module materialui {

    export class ConstVec2NodeUI extends BaseMaterialNodeUI {

        private  outItem: ItemMaterialUI;

        private _constValue: Vector2D;

        public get constValue(): Vector2D {
            return this._constValue;
        }
        public set constValue(value: Vector2D) {
            this._constValue = value;

            (<NodeTreeVec2>this.nodeTree).constValue = value;
            this.showDynamic();
        }
        public showDynamic(): void {
            /*
            if (nodeTree.isDynamic) {
                _titleLabel.text = "vec2<" + nodeTree.paramName + ">(" + getNumStr(_constValue.x) + "," + getNumStr(_constValue.y) + ")"
            } else {
                _titleLabel.text = "vec2(" + getNumStr(_constValue.x) + "," + getNumStr(_constValue.y) + ")"
            }
            */
            if (this.nodeTree.isDynamic) {
                this.drawTitleToFrame("vec2<" + this.nodeTree.paramName + ">(" + this.getNumStr(this._constValue.x) + "," + this.getNumStr(this._constValue.y) + ")")
            } else {
                this.drawTitleToFrame("vec2(" + this.getNumStr(this.constValue.x) + "," + this.getNumStr(this.constValue.y)  + ")")
            }
        }
        public getNumStr(num: number): string {
            var n: number = Math.floor(num * 100) / 100;
            return n.toString();
        }
        public constructor() {
            super();

            this.gap = 20;
            this.width = 162;
            this.height = 95;

            this.gap = 20;
            this.width = 162;
            this.height = 65;

            this._constValue = new Vector2D;

            this.nodeTree = new NodeTreeVec2;
            this.nodeTree.ui = this;
            this.nodeTree.type = NodeTree.VEC2;

            this.outItem = new ItemMaterialUI("out", MaterialItemType.VEC2, false);
            this.addItems(this.outItem);

            this.drawTitleToFrame("vec2")

        }


    }
}