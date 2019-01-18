var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Md5MoveSprite = md5list.Md5MoveSprite;
var Md5animAnalysis = md5list.Md5animAnalysis;
var Md5Analysis = md5list.Md5Analysis;
var MeshImportSort = md5list.MeshImportSort;
var MeshToObjUtils = md5list.MeshToObjUtils;
var left;
(function (left) {
    var LocalMd5MoveSprite = /** @class */ (function (_super) {
        __extends(LocalMd5MoveSprite, _super);
        function LocalMd5MoveSprite() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LocalMd5MoveSprite.prototype.addLocalMeshByStr = function ($str) {
            this.md5MeshData = new Md5Analysis().addMesh($str);
            new MeshImportSort().processMesh(this.md5MeshData);
            this.md5objData = new MeshToObjUtils().getObj(this.md5MeshData);
        };
        LocalMd5MoveSprite.prototype.addLocalAdimByStr = function ($str) {
            var $matrixAry = new Md5animAnalysis().addAnim($str);
            this.frameQuestArr = new Array;
            for (var i = 0; i < $matrixAry.length; i++) {
                var $frameAry = $matrixAry[i];
                for (var j = 0; j < $frameAry.length; j++) {
                    $frameAry[j].prepend(this.md5objData.invertAry[j]);
                }
                this.frameQuestArr.push(this.makeDualQuatFloat32Array($matrixAry[i]));
            }
        };
        LocalMd5MoveSprite.prototype.loadBodyMesh = function () {
        };
        LocalMd5MoveSprite.prototype.loadAnimFrame = function () {
        };
        return LocalMd5MoveSprite;
    }(Md5MoveSprite));
    left.LocalMd5MoveSprite = LocalMd5MoveSprite;
})(left || (left = {}));
//# sourceMappingURL=LocalMd5MoveSprite.js.map