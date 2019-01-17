import Scene_data = Pan3d.Scene_data
import LoadManager = Pan3d.LoadManager
import TextureManager = Pan3d.TextureManager
import TextureRes = Pan3d.TextureRes
import UICompenent = Pan3d.UICompenent;
import UIData = Pan3d.UIData

class H5UIConatiner extends Pan3d.UIConatiner {
    protected uiLoadComplte: boolean;
    protected h5UIAtlas: H5UIAtlas;

    protected win_tip_bg: UICompenent;

    protected set winUiScale(value: number) {
        this._winUiScale = value;
        var temp = Pan3d.UIData.Scale;
        Pan3d.UIData.Scale = this._winUiScale;
        this.resize();
        Pan3d.UIData.Scale = temp
    }
    protected _winUiScale: number = 1
    protected get winUiScale() {
        return this._winUiScale;
    }
 

    public resize(): void {
        super.resize();
        if (this.uiLoadComplte && this.win_tip_bg) {
            this.win_tip_bg.top = 0;
            this.win_tip_bg.left = 0;
            this.win_tip_bg.height = Scene_data.stageHeight / UIData.Scale;
            this.win_tip_bg.width = Scene_data.stageWidth / UIData.Scale;
        }

    }


}

class H5UIAtlas extends Pan3d.UIAtlas {
    public isLoadError: boolean;
    private last; any;
    private static configxmlDic: any = {} //用来记录原来的ui配置文件
    public setInfo(configUrl: string, imgUrl: string, $fun: Function, useImgUrl: string = null): void {
        this.last = {};
        this.last.configUrl = configUrl
        this.last.imgUrl = imgUrl
        this.last.$fun = $fun
        this.last.useImgUrl = useImgUrl

        this.isLoadError = false;
        this._useImgUrl = useImgUrl;

        if (H5UIAtlas.configxmlDic[configUrl]) {
            this.configData = H5UIAtlas.configxmlDic[configUrl].uiArr;
            this.layoutData = H5UIAtlas.configxmlDic[configUrl].panelArr;
            this.loadImgUrl(imgUrl, $fun);
        } else {
            LoadManager.getInstance().load(Scene_data.fileRoot + configUrl, LoadManager.XML_TYPE, ($str: any) => {
                H5UIAtlas.configxmlDic[configUrl] = JSON.parse($str);
                this.configData = H5UIAtlas.configxmlDic[configUrl].uiArr;
                this.layoutData = H5UIAtlas.configxmlDic[configUrl].panelArr;
                this.loadImgUrl(imgUrl, $fun);
            }, {
                    failfun: () => {
                        console.log("没加载成功XML");
                        this.isLoadError = true
                    }
                });
        }



    }
    public testLoading(): void {
        if (this.isLoadError) {
            console.log("上次加载时网络中断，现在重新玩");
            this.setInfo(this.last.configUrl, this.last.imgUrl, this.last.$fun, this.last.useImgUrl);
        }
    }
    public loadImgUrl(imgUrl: string, $fun: Function): void {
        super.loadImgUrl(imgUrl, $fun);
        LoadManager.getInstance().load(Scene_data.fileRoot + imgUrl, LoadManager.IMG_TYPE, ($img: any) => {
        }, {
                failfun: () => {
                    console.log("纹理没加载成功");
                    this.isLoadError = true;
                }
            });
    }

}

