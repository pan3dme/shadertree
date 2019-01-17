﻿module materialui {
    import MouseType = Pan3d.MouseType
    import BaseEvent = Pan3d.BaseEvent
    import KeyboardType = Pan3d.KeyboardType
    

    export class MathFunNodeUI extends BaseMaterialNodeUI {
        private intAItem: ItemMaterialUI;


        private outItem: ItemMaterialUI;
        public constructor() {
            super();
            this.left = 600
            this.top = 300;

            this.nodeTree = new NodeTreeFun;
            this.nodeTree.ui = this;
            this.nodeTree.type = NodeTree.FUN;


            this.drawTitleToFrame("函数(Fun*)")

            this.gap = 20;
            this.width = 162;
            this.height = 30;
            this.resetBgSize();
           

            this.inPutFunStr()

        }
        /*
        public onKeyDown($evt: KeyboardEvent): void {
            document.addEventListener(MouseType.KeyDown, ($evt: KeyboardEvent) => { this.onKeyDown($evt) })
            if ($evt.keyCode == KeyboardType.G) {
                var $agalStr: string = "vec3 ic(vec3 lightuv,float size){\n" +
                    "return lightuv*size;\n" +
                    "}\n";

                this.inPutFunStr($agalStr)
            }
        }
        */
        public inPutFunStr($baseStr: string = null): void {
        
            var $agalStr: string = "vec3 die(vec3 lightuv,vec3 movePos){\n" +
                "return vec3(1,0,1);\n" +
                "}\n";
            if ($baseStr) {
                $agalStr = $baseStr;
            }

            var $funName: string = NodeTreeFun.getMathFunName($agalStr);
            var $returnType: string = NodeTreeFun.getMathFunReturnType($agalStr)
            var $arr: Array<DataMathFunNode> = NodeTreeFun.getDataMathFunArr($agalStr);
            (<NodeTreeFun>this.nodeTree).funStr = $agalStr;
            (<NodeTreeFun>this.nodeTree).funName = $funName;

            this.clearNode();
            for (var i: number = 0; i < $arr.length; i++) {
                var $temp = new ItemMaterialUI($arr[i].name, $arr[i].type);
                this.addItems($temp);
                this.addEvents($temp);
                this.addDisEvent($temp);
            }
            this.outItem = new ItemMaterialUI("out", $returnType, false);
            this.addItems(this.outItem);
            this.addEvents(this.outItem);
            this.addDisEvent(this.outItem);
            this.resetBgSize();
        }
        /*
           private makeInputPoint(): void {
            var $arr: Array<DataMathFunNode> = new Array();
            $arr.push(new DataMathFunNode("a", MaterialItemType.VEC3));
            $arr.push(new DataMathFunNode("b", MaterialItemType.FLOAT));
            for (var i: number = 0; i < $arr.length; i++) {

                var $temp = new ItemMaterialUI($arr[i].name, $arr[i].type);
                this.addItems($temp);
                this.addEvents($temp);
                this.addDisEvent($temp);
            }
            this.outItem = new ItemMaterialUI("out", MaterialItemType.VEC3, false);
            this.addItems(this.outItem);
            this.addEvents(this.outItem);
            this.addDisEvent(this.outItem);

        }
        private makeInputOne(): void {
            this.clearNode()

            var $arr: Array<DataMathFunNode> = new Array();
            $arr.push(new DataMathFunNode("lightuv", MaterialItemType.VEC3));
            $arr.push(new DataMathFunNode("movePos", MaterialItemType.VEC3));
            for (var i: number = 0; i < $arr.length; i++) {

                var $temp = new ItemMaterialUI($arr[i].name, $arr[i].type);
                this.addItems($temp);
                this.addEvents($temp);
                this.addDisEvent($temp);
            }
            this.outItem = new ItemMaterialUI("out", MaterialItemType.VEC3, false);
            this.addItems(this.outItem);
            this.addEvents(this.outItem);
            this.addDisEvent(this.outItem);
            this.resetBgSize();

            var $outstr: string = "vec3 " + (<NodeTreeFun>this.nodeTree).funName+"(vec3 lightuv,vec3 movePos){\n" +
                   "return lightuv*movePos;\n" +
                "}\n";

            (<NodeTreeFun>this.nodeTree).funStr = $outstr;

        }
        private makeInputTwo(): void {
            this.clearNode()

            var $arr: Array<DataMathFunNode> = new Array();
            $arr.push(new DataMathFunNode("trueX", MaterialItemType.FLOAT));
            $arr.push(new DataMathFunNode("trueY", MaterialItemType.FLOAT));
            $arr.push(new DataMathFunNode("trueZ", MaterialItemType.FLOAT));
            for (var i: number = 0; i < $arr.length; i++) {

                var $temp = new ItemMaterialUI($arr[i].name, $arr[i].type);
                this.addItems($temp);
                this.addEvents($temp);
                this.addDisEvent($temp);
            }
            this.outItem = new ItemMaterialUI("out", MaterialItemType.FLOAT, false);
            this.addItems(this.outItem);
            this.addEvents(this.outItem);
            this.addDisEvent(this.outItem);

     
            this.resetBgSize();

            var $outstr: string = "vec3 ic(float trueX,float trueY,float trueZ);\n" +
                "{;\n" +
                "return vec3(1.0,1.0,0.0);\n" +
                "};\n";
            (<NodeTreeFun>this.nodeTree).funStr = $outstr;
        }
        */
        private clearNode(): void {
            this.removeAllNodeLine()
            while (this.inPutItemVec.length) {
                this.removeItem(this.inPutItemVec.pop());
            }
            while (this.outPutItemVec.length) {
                this.removeItem(this.outPutItemVec.pop());
            }
        }
        /*
            "vec3 dY(vec3 T,vec3 N,vec3 U,float eH){
                 float eI=1.0-saturate(dot(T,N));\n" +
                "float eJ=eI*eI;\n" +
                "eI*=eJ*eJ;\n" +ggg
                "eI*=eH;\n" +
                "vec3 endData=(U-eI*U)+eI*uFresnel"
                "return endData;\n" +
            "}\n" +
         */
        protected resetBgSize(): void {
            this.height = this.inPutItemVec.length * 30;
            super.resetBgSize()
        }
        public addEvents($nodeUI: ItemMaterialUI): void {
            $nodeUI.addEventListener("Connect", this.onConnect, this);
        }
        public addDisEvent($nodeUI: ItemMaterialUI): void {
            $nodeUI.addEventListener("DisConnect", this.disConnect, this);
        }

        public removeEvents($nodeUI: ItemMaterialUI): void {
            $nodeUI.removeEventListener("Connect", this.onConnect, this);
        }
        public removeDisEvent($nodeUI: ItemMaterialUI): void {
            $nodeUI.removeEventListener("DisConnect", this.disConnect, this);
        }


        public disConnect(event: BaseEvent): void {
            this.checkItem();
        }
        protected onConnect(event: BaseEvent): void {

            var target: ItemMaterialUI = <ItemMaterialUI>event.target;
            var typets: string = target.typets;
            target.changeType(typets);

            this.checkItem();


        }
        public checkItem(): void {
            console.log("checkItem")
            this.resetBgSize()
        }
        public setData(obj: any): void {
            super.setData(obj);
            (<NodeTreeFun>this.nodeTree).funStr = obj.funStr;
            this.inPutFunStr((<NodeTreeFun>this.nodeTree).funStr);
        }
        public getData(): Object {
            var obj: any = super.getData();
            obj.funStr = (<NodeTreeFun>this.nodeTree).funStr;
            return obj;
        }
        public setInItemByData(ary: Array<any>): void {
            super.setInItemByData(ary);
            console.log("setInItemByData")

        }

        public setOutItemByData(ary: Array<any>): void {
            super.setOutItemByData(ary);
            console.log("setOutItemByData")


        }

    }
} 