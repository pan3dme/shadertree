class TpGame {
    public static getArrByStr(str: String): Array<string> {
        var boneNameAry: Array<string> = str.split(/\s+/g);
        for (var i: number = boneNameAry.length - 1; i >= 0; i--) {
            if (String(boneNameAry[i]).length < 1) {
                boneNameAry.splice(i, 1);
            }
        }
        return boneNameAry;
    }
}
class ModuleList {
    public constructor() {

    }
    private static getModuleList(): Array<Pan3d.Module> {
        //所有的需要注册的模块  都写在这里

        var $arr: Array<Pan3d.Module> = [

            new materialui.MaterialModule(),
            new materialui.RightMenuModule(),
            new left.LeftModule(),
            new folder.FolderModule(),
            new filemodel.FileModelModule(),
            new popmodel.PopModelShowModule(),
            new colorview.ColorModule(),

        ];

        return $arr
    }


    /**
     * 启动所有模块 
     */
    public static startup(): void {
        var allModules: Array<Pan3d.Module> = ModuleList.getModuleList();
        for (var i: number = 0; i < allModules.length; i++) {
            Pan3d.Module.registerModule(allModules[i]);
        }
    }


}
