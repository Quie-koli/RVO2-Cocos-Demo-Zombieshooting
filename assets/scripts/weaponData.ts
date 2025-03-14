import { _decorator, Component, Node ,Animation} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('weaponData')
export class weaponData extends Component {
    anim: Animation;
    @property(Node)
    muzzle: Node;
    @property
    speed=5;
    @property
    numofbullet=30;
    @property
    time_ShootingAnim= 1.167;
    bulletalreadyloaded=0;
    protected onLoad(): void {
        this.anim=this.node.getComponent(Animation);
        this.bulletalreadyloaded=this.numofbullet;
    }

    start() {

    }

    animchange(n: string){
        this.anim.crossFade(n,0.2);
    }

}


