import { _decorator, Component, Node ,input , Input, EventKeyboard, KeyCode, EventMouse, view, Vec3} from 'cc';
import { playercontrol } from './playercontrol';
import { zombieMgr } from './zombieMgr';
import { GameMainManager } from './GameMainManager';

const { ccclass, property } = _decorator;

@ccclass('keyboardcontroler')
export class keyboardcontroler extends Component {

    pc: playercontrol; 
    turn=0;
    angel=0;
    onLoad () {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

    }

    onDestroy () {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {
        this.pc = this.node.getComponent(playercontrol);

        
    }

    update(deltaTime: number) {
        this.angel+=this.turn*deltaTime;
        this.pc.model.node.setRotationFromEuler(new Vec3(0,this.angel,0));
    }

    onKeyDown (event: EventKeyboard) {
        switch(event.keyCode) {
            case KeyCode.KEY_A:
                this.pc.movingdirection.x=-1;
                break;
            case KeyCode.KEY_D:
                this.pc.movingdirection.x=1;
                break;
            case KeyCode.KEY_W:
                this.pc.movingdirection.z=-1;
                break;
            case KeyCode.KEY_S:
                this.pc.movingdirection.z=1;
                break;
            case KeyCode.ARROW_LEFT:
                this.turn=90;
                break;   
            case KeyCode.ARROW_RIGHT:
                this.turn=-90;
                break;   
            case KeyCode.SPACE:
                this.pc.fire();
                break;    
            case KeyCode.KEY_R:
                this.pc.reload();
                break;    
            case KeyCode.KEY_Q:
                GameMainManager.instance.zombiemgr.get(0,new Vec3(0,0.8,0));
                break;
            case KeyCode.DIGIT_1:
                GameMainManager.instance.player.loadweapon("m4a1");
                break;
            case KeyCode.DIGIT_2:
                GameMainManager.instance.player.loadweapon("ak47");
                break;
        }
    }
    onKeyUp (event: EventKeyboard) {
        switch(event.keyCode) {
            case KeyCode.KEY_A:
                this.pc.movingdirection.x=0;
                break;
            case KeyCode.KEY_D:
                this.pc.movingdirection.x=0;
                break;
            case KeyCode.KEY_W:
                this.pc.movingdirection.z=0;
                break;
            case KeyCode.KEY_S:
                this.pc.movingdirection.z=0;
                break;
            case KeyCode.ARROW_LEFT:
                this.turn=0;
                break;   
            case KeyCode.ARROW_RIGHT:
                this.turn=0;
                break;   
            case KeyCode.SPACE:
                this.pc.stopfire();
                break;    
           
        }
    }
}


