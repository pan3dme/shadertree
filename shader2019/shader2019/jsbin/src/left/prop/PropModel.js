var prop;
(function (prop) {
    var PropModel = /** @class */ (function () {
        function PropModel() {
            this._top = 350;
        }
        PropModel.getInstance = function () {
            if (!this._instance) {
                this._instance = new PropModel();
            }
            return this._instance;
        };
        PropModel.prototype.hidePanel = function () {
            if (this.metaDataView) {
                this.metaDataView.destory();
                this.metaDataView = null;
            }
            this.lastNodel = null;
        };
        PropModel.prototype.showPanel = function ($ui) {
            if (this.lastNodel != $ui) {
                if (this.metaDataView) {
                    this.metaDataView.destory();
                    this.metaDataView = null;
                }
                if ($ui instanceof materialui.ConstVec3NodeUI) {
                    this.metaDataView = new prop.Vec3PropMeshPanel();
                }
                else if ($ui instanceof materialui.ConstVec2NodeUI) {
                    this.metaDataView = new prop.Vec2PropMeshPanel();
                }
                else if ($ui instanceof materialui.ConstFloatNodeUI) {
                    this.metaDataView = new prop.FloatPropMeshPanel();
                }
                else if ($ui instanceof materialui.TimeNodeUI) {
                    this.metaDataView = new prop.NodeTimePropPanel();
                }
                else if ($ui instanceof materialui.PannerNodeUI) {
                    this.metaDataView = new prop.PannerPropPanel();
                }
                else if ($ui instanceof materialui.TextureSampleNodeUI) {
                    this.metaDataView = new prop.TexturePropMeshPanel();
                }
                else if ($ui instanceof materialui.Texture3DNodeUI) {
                    this.metaDataView = new prop.Texture3DMeshPanel();
                }
                else if ($ui instanceof materialui.TextureCubeNodeUI) {
                    this.metaDataView = new prop.TextureCubeMeshPanel();
                }
                else if ($ui instanceof materialui.ResultNodeUI) {
                    this.metaDataView = new prop.OpPropMeshPanel();
                }
                else if ($ui instanceof materialui.MathFunNodeUI) {
                    this.metaDataView = new prop.MathFunMeshPanel();
                }
                else {
                    this.showSciencePropPanel();
                }
                this.lastNodel = $ui;
                this.metaDataView.data = $ui;
                this.metaDataView.top = this._top;
            }
        };
        PropModel.prototype.showSciencePropPanel = function () {
            if (this.metaDataView) {
                this.metaDataView.destory();
                this.metaDataView = null;
                this.lastNodel = null;
            }
            this.metaDataView = new prop.SciencePropMeshPanel();
        };
        PropModel.prototype.moveTop = function ($ty) {
            this._top = $ty;
            if (this.metaDataView) {
                this.metaDataView.top = this._top;
            }
        };
        return PropModel;
    }());
    prop.PropModel = PropModel;
})(prop || (prop = {}));
//# sourceMappingURL=PropModel.js.map