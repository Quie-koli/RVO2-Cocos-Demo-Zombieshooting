import { _decorator, Component, Node, Vec3, RigidBody, animation, CCFloat, resources, Prefab, instantiate} from 'cc';
import { playermodel } from './playermodel';
import { weaponData } from './weaponData';
import { bulletMgr } from './bulletmgr';
import Vector2D from './rvo2/Vector2D';
import { GameMainManager } from './GameMainManager';
import { cameraAnim } from './cameraAnim';
const { ccclass, property } = _decorator;

@ccclass('playercontrol')
export class playercontrol extends Component {
    rgb: RigidBody;
    animesate = 0;
    nextanimesate = 0;
    @property(playermodel)
    model: playermodel;
    movingdirection: Vec3 = new Vec3(0,0,0);
    zero: Vec3 = new Vec3(0,0,0);
    @property(CCFloat)
    speed=2;
    weapon: weaponData;
    mynumofbullet=100;
    position: Vector2D=new Vector2D;
    reloading=false;
    @property
    time_ReloadingAnim= 3.3;

    protected onLoad(): void {
    }

    start() {
        this.rgb = this.node.getComponent(RigidBody);
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
    }
    fire(){
        if(!this.weapon || this.reloading)return
        if(this.weapon.bulletalreadyloaded<=0){
            this.reload();
            return;
        }
        this.model.animcontrol.setValue("shoot",true);
        this.weapon.animchange("shoot");
        this.schedule(this.eject, this.weapon.time_ShootingAnim/this.weapon.speed);
    }
    stopfire(){
        if(!this.weapon)return
        this.model.animcontrol.setValue("shoot",false);
        this.weapon.animchange("idle");
        this.unschedule(this.eject);
    }
    reload(){
        if(!this.weapon)return
        this.reloading=true
        this.model.animcontrol.setValue("reload",true);
        this.weapon.animchange("reload");
        this.scheduleOnce(this.stopreload,this.time_ReloadingAnim);
    }
    stopreload(){
        if(!this.weapon)return
        this.reloading=false
        this.model.animcontrol.setValue("reload",false);
        this.weapon.animchange("idle");
        let a=Math.min(this.weapon.numofbullet,this.weapon.bulletalreadyloaded+this.mynumofbullet);
        this.mynumofbullet-=a-this.weapon.bulletalreadyloaded;
        this.weapon.bulletalreadyloaded=a;
    }

    loadweapon(name: string){
        if(this.weapon){
            this.weapon.node.destroy();
        }
        const newNode = GameMainManager.instance.weaponmgr.get(name);
        this.model.gunpoint.addChild(newNode);
        this.reloading=false;
        this.weapon = newNode.getComponent(weaponData);
        this.model.animcontrol.setValue("shootspeed",this.weapon.speed);
        this.weapon.muzzle.active=false
        
    }
    static temp:Vec3=new Vec3(0,0,0);
    eject(){
        const a=GameMainManager.instance.bulletmgr.get();
        a.node.position=this.weapon.muzzle.worldPosition;
         //a.node.forward=this.weapon.muzzle.right.multiplyScalar(-1);
        this.weapon.muzzle.getWorldRotation().getEulerAngles(playercontrol.temp)
        playercontrol.temp.x=playercontrol.temp.y
        a.node.setRotationFromEuler(playercontrol.temp)
        this.weapon.bulletalreadyloaded--;
        this.weapon.muzzle.active=true
        this.scheduleOnce(this.hidemuzzlefire,0.1)
        cameraAnim.instance.shaking(0.1,3);
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


