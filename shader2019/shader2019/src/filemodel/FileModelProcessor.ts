module filemodel {
    import BaseEvent = Pan3d.BaseEvent;
    import Module = Pan3d.Module;
    import Processor = Pan3d.Processor;
    import BaseProcessor = Pan3d.BaseProcessor;
    import UIManager = Pan3d.UIManager;
    import ModuleEventManager = Pan3d.ModuleEventManager;

    export class FileModelEvent extends BaseEvent {
        public static SHOW_FILEMODEL_PANEL: string = "SHOW_FILEMODEL_PANEL"; //显示面板
        public static HIDE_FILEMODEL_PANEL: string = "HIDE_FILEMODEL_PANEL"; //显示面板
    }
    export class FileModelModule extends Module {
        public getModuleName(): string {
            return "FileModelModule";
        }
        protected listProcessors(): Array<Processor> {
            return [new FileModelProcessor()];
        }
    }

    export class FileModelProcessor extends BaseProcessor {
        public getName(): string {
            return "FileModelProcessor";
        }
        protected receivedModuleEvent($event: BaseEvent): void {
            if ($event instanceof FileModelEvent) {
                var $leftEvent: FileModelEvent = <FileModelEvent>$event;

                if ($leftEvent.type == FileModelEvent.SHOW_FILEMODEL_PANEL) {
                    this.showLeftPanel();
         
                }
                if ($leftEvent.type == FileModelEvent.HIDE_FILEMODEL_PANEL) {
                    this.hideLeftPanel();
                }
            }
        }
    
        private hideLeftPanel(): void {
            if (this.fileModelPanel) {
                this.fileModelPanel.hidePanel()
            }
        }
        private showLeftPanel(): void {
            if (!this.fileModelPanel) {
                this.fileModelPanel = new FileModelPanel
            }
            this.fileModelPanel.showPanel()
        }
        private fileModelPanel: FileModelPanel
        protected listenModuleEvents(): Array<BaseEvent> {
            return [
                new FileModelEvent(FileModelEvent.SHOW_FILEMODEL_PANEL),
                new FileModelEvent(FileModelEvent.HIDE_FILEMODEL_PANEL),


            ];
        }
    }
}