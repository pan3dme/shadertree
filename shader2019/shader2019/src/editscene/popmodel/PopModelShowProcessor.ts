module popmodel {
    import BaseEvent = Pan3d.BaseEvent;
    import Module = Pan3d.Module;
    import Processor = Pan3d.Processor;
    import BaseProcessor = Pan3d.BaseProcessor;
    import UIManager = Pan3d.UIManager;
    import ModuleEventManager = Pan3d.ModuleEventManager;

    export class PopModelShowEvent extends BaseEvent {
        public static SHOW_POP_MODEL_PANEL: string = "SHOW_LEFT_PANEL"; //显示面板
        public static HIDE_POP_MODEL_PANEL: string = "HIDE_LEFT_PANEL"; //显示面板
    }
    export class PopModelShowModule extends Module {
        public getModuleName(): string {
            return "PopModelShowModule";
        }
        protected listProcessors(): Array<Processor> {
            return [new PopModelShowProcessor()];
        }
    }

    export class PopModelShowProcessor extends BaseProcessor {
        public getName(): string {
            return "PopModelShowProcessor";
        }
        protected receivedModuleEvent($event: BaseEvent): void {
            if ($event instanceof PopModelShowEvent) {
                var $leftEvent: PopModelShowEvent = <PopModelShowEvent>$event;

                if ($leftEvent.type == PopModelShowEvent.SHOW_POP_MODEL_PANEL) {
                    this.showLeftPanel();
                }
                if ($leftEvent.type == PopModelShowEvent.HIDE_POP_MODEL_PANEL) {
                    this.hideLeftPanel();
                }
            }
        }
 
        private hideLeftPanel(): void {
            if (this.popModelShowPanel) {
                UIManager.getInstance().removeUIContainer(this.popModelShowPanel)
            }
        }
        private showLeftPanel(): void {
            if (!this.popModelShowPanel) {
                this.popModelShowPanel = new PopModelShowPanel
            }
            if (!this.popModelShowPanel.hasStage) {
                UIManager.getInstance().addUIContainer(this.popModelShowPanel)
            } 


        }
        private popModelShowPanel: PopModelShowPanel
        protected listenModuleEvents(): Array<BaseEvent> {
            return [
                new PopModelShowEvent(PopModelShowEvent.SHOW_POP_MODEL_PANEL),
                new PopModelShowEvent(PopModelShowEvent.HIDE_POP_MODEL_PANEL),


            ];
        }
    }
}