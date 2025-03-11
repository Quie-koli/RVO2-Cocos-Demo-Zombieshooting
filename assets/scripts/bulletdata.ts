import { _decorator, Component, ICollisionEvent, ITriggerEvent, Node, SphereCollider } from 'cc';
import { bulletMgr } from './bulletmgr';
import { zombieMgr } from './zombieMgr';
import { zombieSys } from './zombieSys';
import { GameMainManager } from './GameMainManager';
const { ccclass, property } = _decorator;

@ccclass('bulletdata')
export class bulletdata extends Component {
    cid: number=0;
    speed: number=0.12;
    lifetime: number=0;
    a: any;
    collider: SphereCollider;
    start(): void {
        this.collider=this.node.getComponent(SphereCollider);
        this.collider.on('onCollisionEnter',this.onCollisionEnter);
       
    }
    onCollisionEnter(event: ICollisionEvent){
        if(event.otherCollider.node.layer==1) GameMainManager.instance.zombiesys.hit(Number.parseInt(event.otherCollider.node.name));
            GameMainManager.instance.bulletmgr.release(event.selfCollider.node.getComponent(bulletdata));
    }
}


