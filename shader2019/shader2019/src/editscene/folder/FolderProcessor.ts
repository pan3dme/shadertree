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

    

    export class FolderEvent extends BaseEvent {
        public static SHOW_FOLDER_PANEL: string = "SHOW_FOLDER_PANEL"; 
 

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
        private _folderPanel: FolderPanel
        protected receivedModuleEvent($event: BaseEvent): void {
            if ($event instanceof FolderEvent) {
                var $materialEvent: FolderEvent = <FolderEvent>$event;
                if ($materialEvent.type == FolderEvent.SHOW_FOLDER_PANEL) {
                    if (!this._folderPanel) {
                        this._folderPanel = new FolderPanel()
                    }
                    UIManager.getInstance().addUIContainer(this._folderPanel);


                    if (!this._fileListPanel) {
                        this._fileListPanel = new FileListPanel()
                    }
                    UIManager.getInstance().addUIContainer(this._fileListPanel);
                }
           
            }
        }
        private _fileListPanel: FileListPanel
     
        protected listenModuleEvents(): Array<BaseEvent> {
            return [
                new FolderEvent(FolderEvent.SHOW_FOLDER_PANEL),
 
            ];
        }
    }

}