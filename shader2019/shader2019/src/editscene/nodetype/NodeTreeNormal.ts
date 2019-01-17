module materialui {

    export class NodeTreeNormal extends NodeTree {
        public constVec3: Vector3D = new Vector3D;
        public constructor() {

            super();
       
        }

        public getComponentID($id: number): string {
     
            return "normalVec.xyz";
        }

    }
}