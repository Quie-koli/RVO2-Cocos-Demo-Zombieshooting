import { _decorator, Component, Node, Vec3, RigidBody, animation, CCFloat, resources, Prefab, instantiate} from 'cc';
import { playermodel } from './playermodel';
import { gundata } from './gundata';
import { bulletmgr } from './bulletmgr';
import Vector2D from './rvo2/Vector2D';
const { ccclass, property } = _decorator;

@ccclass('playercontrol')
export class playercontrol extends Component {
    static instance: playercontrol;
    rgb: RigidBody;
    animesate = 0;
    nextanimesate = 0;
    @property(playermodel)
    model: playermodel;
    movingdirection: Vec3 = new Vec3(0,0,0);
    zero: Vec3 = new Vec3(0,0,0);
    @property(CCFloat)
    speed=2;
    weapon: gundata;
    mynumofbullet=100;
    position: Vector2D=new Vector2D;
    protected onLoad(): void {
        playercontrol.instance=this;
    }

    start() {
        this.rgb = this.node.getComponent(RigidBody);
        this.loadweapon("m4a1");
        this.model.plc=this;
    }

    update(dt: number) {
        if(this.movingdirection.length()==0){
            this.nextanimesate=0;
        }
        else
        {
            let dotfor = this.model.node.forward.dot(this.movingdirection);
            let dotrig = this.model.node.right.dot(this.movingdirection);
            if(Math.abs(dotfor)>Math.abs(dotrig)){
                if(dotfor<0)this.nextanimesate=1;
                else this.nextanimesate=2;
            }
            else {
                if(dotrig<0)this.nextanimesate=4;
                    else this.nextanimesate=3;
            }
            this.rgb.setLinearVelocity(this.movingdirection.normalize().multiplyScalar(this.speed));
        }
        if(this.nextanimesate!=this.animesate) {
            this.model.animcontrol.setValue("state",this.nextanimesate);
            this.animesate=this.nextanimesate;
        }
        this.position.x=this.node.position.x;
        this.position.y=this.node.position.z;
       // this.rgb.setAngularVelocity(this.zero);
    }
    fire(){
        if(this.weapon.bulletalreadyloaded<=0){
            this.reload();
            return;
        }
        this.model.animcontrol.setValue("shoot",true);
        this.weapon.animchange("shoot");
        this.schedule(this.eject, 1.167/this.weapon.speed);
    }
    stopfire(){
        this.model.animcontrol.setValue("shoot",false);
        this.weapon.animchange("idle");
        this.unschedule(this.eject);
    }
    reload(){
        this.model.animcontrol.setValue("reload",true);
        this.weapon.animchange("reload");
        this.scheduleOnce(this.stopreload,3.3);
    }
    stopreload(){
        this.model.animcontrol.setValue("reload",false);
        this.weapon.animchange("idle");
        let a=Math.min(this.weapon.numofbullet,this.weapon.bulletalreadyloaded+this.mynumofbullet);
        this.mynumofbullet-=a-this.weapon.bulletalreadyloaded;
        this.weapon.bulletalreadyloaded=a;
    }

    loadweapon(gunname: string){
        resources.load("guns/" + gunname, Prefab, (err, Prefab) => {
            const newNode = instantiate(Prefab);
            this.model.gunpoint.addChild(newNode);
            this.weapon = newNode.getComponent(gundata);
            this.model.animcontrol.setValue("shootspeed",this.weapon.speed);
            this.weapon.muzzle.active=false
        });
    }

    eject(){
        const a=bulletmgr.instance.get();
        a.lifetime=100;
        a.node.position=this.weapon.muzzle.worldPosition;
        a.node.forward=this.weapon.muzzle.right.multiplyScalar(-1);
        this.weapon.bulletalreadyloaded--;
        this.weapon.muzzle.active=true
        this.scheduleOnce(this.hidemuzzlefire,0.1)
        if(this.weapon.bulletalreadyloaded<=0){
            this.stopfire();
            this.reload();
            return;
        }
    }
    hidemuzzlefire(){
        this.weapon.muzzle.active=false
    }
}


