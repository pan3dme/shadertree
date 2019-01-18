import Md5MoveSprite = md5list.Md5MoveSprite
import Md5animAnalysis = md5list.Md5animAnalysis
import Md5Analysis = md5list.Md5Analysis
import MeshImportSort = md5list.MeshImportSort
import MeshToObjUtils = md5list.MeshToObjUtils
 
 
module left {
    
    export class LocalMd5MoveSprite extends Md5MoveSprite {

        public addLocalMeshByStr($str: string): void {
            this.md5MeshData = new Md5Analysis().addMesh($str);
            new MeshImportSort().processMesh(this.md5MeshData);
            this.md5objData = new MeshToObjUtils().getObj(this.md5MeshData);
        }
        public addLocalAdimByStr($str: string): void {
            var $matrixAry: Array<Array<Matrix3D>> = new Md5animAnalysis().addAnim($str);
            this.frameQuestArr = new Array;
            for (var i: number = 0; i < $matrixAry.length; i++) {
                var $frameAry: Array<Matrix3D> = $matrixAry[i];
                for (var j: number = 0; j < $frameAry.length; j++) {
                    $frameAry[j].prepend(this.md5objData.invertAry[j]);
                }
                this.frameQuestArr.push(this.makeDualQuatFloat32Array($matrixAry[i]));
            }
        }
        protected loadBodyMesh(): void {
        }
        protected loadAnimFrame(): void {
             
        }
    }
}
