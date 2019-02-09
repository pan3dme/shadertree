class Arpg2dGameStart extends Pan3d.GameStart {
    public static stagePos: Vector2D

    public static altKey: boolean
    public init(): void {

        Scene_data.fileRoot = "https://webpan.oss-cn-shanghai.aliyuncs.com/upfile/shadertree/"
        Scene_data.fileuiRoot = "res/"
        ModuleList.startup();//启动所有模块

        Pan3d.UIData.Scale = 1
        materialui.MtlUiData.Scale = 1;
        Pan3d.Engine.initPbr();
        Pan3d.GameMouseManager.getInstance().addMouseEvent();
       Pan3d.ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.SHOW_MATERIA_PANEL));


        Pan3d.ModuleEventManager.dispatchEvent(new popmodel.PopModelShowEvent(popmodel.PopModelShowEvent.SHOW_POP_MODEL_PANEL));
     //   Pan3d.ModuleEventManager.dispatchEvent(new folder.FolderEvent(folder.FolderEvent.SHOW_FOLDER_PANEL));


        Pan3d.UIData.resize = () => { this.resize() } //更尺寸变化

    }
    private resize(): void {
        Pan3d.UIData.Scale = 1;
    }


}