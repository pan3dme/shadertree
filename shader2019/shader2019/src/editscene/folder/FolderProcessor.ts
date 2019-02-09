module folder {
    import BaseEvent = Pan3d.BaseEvent;
    import Module = Pan3d.Module;
    import Processor = Pan3d.Processor;
    import BaseProcessor = Pan3d.BaseProcessor;
    import Vector2D = Pan3d.Vector2D;
    import UIManager = Pan3d.UIManager;
    import UIData = Pan3d.UIData;
    import InteractiveEvent = Pan3d.InteractiveEvent;
    import Scene_data = Pan3d.Scene_data;
    import ModuleEventManager = Pan3d.ModuleEventManager;
    import FileListPanel = filelist.FileListPanel
    import BaseFolderWindow = basefolderwin.BaseFolderWindow
    import OssFolderPanel = ossfolder.OssFolderPanel;



    export class FolderEvent extends BaseEvent {
        public static SHOW_FOLDER_PANEL: string = "SHOW_FOLDER_PANEL";

        public static FILE_LIST_PANEL_CHANG: string = "FILE_LIST_PANEL_CHANG";
        public static LIST_DIS_ALL_FILE: string = "LIST_DIS_ALL_FILE";

        public data: any

        public posv2d: Vector2D;
        public comboxData: Array<any>;
        public comboxFun: Function


    }
    export class FolderModule extends Module {
        public getModuleName(): string {
            return "FolderModule";
        }
        protected listProcessors(): Array<Processor> {
            return [new FolderProcessor()];
        }
    }

    export class FolderProcessor extends BaseProcessor {
        public getName(): string {
            return "FolderProcessor";
        }
        private _folderPanel: OssFolderPanel
 
        protected receivedModuleEvent($event: BaseEvent): void {
            if ($event instanceof FolderEvent) {
                var _folderEvent: FolderEvent = <FolderEvent>$event;
                if (_folderEvent.type == FolderEvent.SHOW_FOLDER_PANEL) {

                    if (!this._baseFolderWindow) {
                        this._baseFolderWindow = new BaseFolderWindow()
                    }
                    UIManager.getInstance().addUIContainer(this._baseFolderWindow);
                    if (!this._folderPanel) {
                        this._folderPanel = new OssFolderPanel();
                    }
                    UIManager.getInstance().addUIContainer(this._folderPanel);
                    if (!this._fileListPanel) {
                        this._fileListPanel = new FileListPanel();
                    }
                    UIManager.getInstance().addUIContainer(this._fileListPanel);
                }
                if (_folderEvent.type == FolderEvent.FILE_LIST_PANEL_CHANG) {
                    var base: Pan3d.Rectangle = _folderEvent.data;

                    this._folderPanel.panelEventChanger(new Pan3d.Rectangle(base.x, base.y, base.width, base.height));
                    var leftw: number = this._folderPanel.getPageRect().width;
                    this._fileListPanel.panelEventChanger(new Pan3d.Rectangle(base.x + leftw, base.y, base.width - leftw, base.height));
                }
                if (_folderEvent.type == FolderEvent.LIST_DIS_ALL_FILE) {
            
                    this._fileListPanel.refrishPath(String(_folderEvent.data));
                }
            }
        }
        

        private _fileListPanel: FileListPanel
        private _baseFolderWindow: BaseFolderWindow
        protected listenModuleEvents(): Array<BaseEvent> {
            return [
                new FolderEvent(FolderEvent.SHOW_FOLDER_PANEL),
                new FolderEvent(FolderEvent.FILE_LIST_PANEL_CHANG),
                new FolderEvent(FolderEvent.LIST_DIS_ALL_FILE),

            ];
        }
    }

}