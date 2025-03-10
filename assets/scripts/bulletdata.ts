import { _decorator, Component, ICollisionEvent, ITriggerEvent, Node, SphereCollider } from 'cc';
import { bulletmgr } from './bulletmgr';
import { zombieMgr } from './zombieMgr';
import { zombieSys } from './zombieSys';
const { ccclass, property } = _decorator;

@ccclass('bulletdata')
export class bulletdata extends Component {
    cid: number=0;
    speed: number=0.12;
    lifetime: number=0;
    a: any;
    collider: SphereCollider;
    protected onLoad(): void {
        this.collider=this.node.getComponent(SphereCollider);
        this.collider.on('onCollisionEnter',this.onCollisionEnter);
       
    }
    onCollisionEnter(event: ICollisionEvent){
        if(event.otherCollider.node.layer==1) zombieSys.instance.hit(Number.parseInt(event.otherCollider.node.name));
        bulletmgr.instance.release(event.selfCollider.node.getComponent(bulletdata));
    }
}


