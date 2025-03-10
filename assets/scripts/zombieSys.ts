import { _decorator, Component, math, Node, quat, Quat, Vec3 } from 'cc';
import { zombieMgr } from './zombieMgr';
import { zombieCom } from './zombieMgr';
import { playercontrol } from './playercontrol';
import Vector2D from './rvo2/Vector2D';
import { GameMainManager } from './GameMainManager';
const { ccclass, property } = _decorator;
const rta=1/3.14*180;
@ccclass('zombieSys')
export class zombieSys extends Component {
    static instance: zombieSys;
    upfucs: Function[] = [this.idleup,this.idleup,this.runup,this.dieup];
    inifucs: Function[] = [this.idleini,this.idleini,this.runini,this.dieini];
    protected onLoad(): void {
        zombieSys.instance=this;    
    }

    start() {

    }

    update(deltaTime: number) {
        zombieMgr.instance.zombieshowings.forEach((value , key) =>{
            this.upfucs[value.state](deltaTime,value);
            if(value.nextstate != value.state){
                value.state = value.nextstate;
                value.animcontroller.setValue("state",value.state);
                this.inifucs[value.state](value);
            }
        });
    }

    idleup(deltaTime: number,z: zombieCom){
        let temp=new Vector2D(playercontrol.instance.position.x-z.node.position.x,playercontrol.instance.position.y-z.node.position.z) 
        let dis =temp.abs()
        if(dis<8){
            z.nextstate=2;
        }
    }
    

    runup(deltaTime: number,z: zombieCom){
        let temp=new Vector2D(playercontrol.instance.position.x-z.node.position.x,playercontrol.instance.position.y-z.node.position.z) 
        let dis =temp.abs()
        if(dis>8){
            z.nextstate=0;
        }
        else
        if(dis<2){
            if(!z.attack){
                
                z.animcontroller.setValue("attacktype",getRandomIntInclusive(0,1));
                z.animcontroller.setValue("attacking",true);
                z.attack=true;
            }
        }else{
            if(z.attack){
                z.animcontroller.setValue("attacking",false);
                z.attack=false;
            }
        }
 
        if(!z.goal)
        z.goal=playercontrol.instance.position;
    
        //插值化丝滑地朝向玩家
        let quat: Quat = new Quat();
        Quat.fromEuler(quat,0,(z.node.eulerAngles.y, 90-Math.atan2(temp.y,temp.x)*rta),0)
        Quat.slerp(quat,z.node.rotation,quat,deltaTime);
        z.node.setRotationFromEuler(new Vec3(0,(z.node.eulerAngles.y, 90-Math.atan2(temp.y,temp.x)*rta),0));
        
    }

    dieup(deltaTime: number,z: zombieCom){
        z.count--;
        if(z.count==0)zombieMgr.instance.release(z);
    }
    
    idleini(z: zombieCom){
        z.goal=undefined
    }

    runini(z: zombieCom){
    }

    dieini(z: zombieCom){
        GameMainManager.instance.simulator.disableAgent(z.agentid)
    }

    hit(id: number){
        let a = zombieMgr.instance.zombieshowings.get(id);
        a.hp--;
        if(a.hp<=0){
            a.animcontroller.setValue("attacking",false);
            a.nextstate=3;
        }
    }


}



function getRandomIntInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

