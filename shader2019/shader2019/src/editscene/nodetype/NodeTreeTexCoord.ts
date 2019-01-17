﻿module materialui {

    export class NodeTreeTexCoord extends NodeTree {
        public constValue: Vector2D = new Vector2D;
        public constructor() {

            super();
            this.canDynamic = true;
        }
        public getComponentID($id: number): string {
            if ($id == 0) {
                return CompileTwo.VI + "0.xy";
            }
            return null;
        }


    }
}