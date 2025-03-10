import { _decorator, Component, Node ,animation} from 'cc';
import { playercontrol } from './playercontrol';
const { ccclass, property } = _decorator;

@ccclass('playermodel')
export class playermodel extends animation.AnimationController {
    @property(Node)
    gunpoint: Node;
    animcontrol: animation.AnimationController;
    plc: playercontrol;
    protected onLoad(): void {
        this.animcontrol = this.node.getComponent(animation.AnimationController);
        
    }
    start() {

    }

}


