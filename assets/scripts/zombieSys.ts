import { _decorator, Component, math, Node, quat, Quat, Vec3 } from 'cc';
import { zombieMgr } from './zombieMgr';
import { zombieCom } from './zombieMgr';
import { playercontrol } from './playercontrol';
import Vector2D from './rvo2/Vector2D';
import { GameMainManager } from './GameMainManager';
import RVOMath from './rvo2/RVOMath';
const { ccclass, property } = _decorator;
const rta=1/3.14*180;
@ccclass('zombieSys')
export class zombieSys{

    upfucs: Function[] = [this.idleup,this.idleup,this.runup,this.dieup];
    inifucs: Function[] = [this.idleini,this.idleini,this.runini,this.dieini];

    async update(deltaTime: number) {
        
        GameMainManager.instance.zombiemgr.zombieshowings.forEach((value , key) =>{
            this.upfucs[value.state](deltaTime,value);
            if(value.nextstate != value.state){
                value.state = value.nextstate;
                value.animcontroller.setValue("state",value.state);
                this.inifucs[value.state](value);
            }
           
        });
    }

    idleup(deltaTime: number,z: zombieCom){
        let temp=new Vector2D(GameMainManager.instance.player.position.x-z.node.position.x,GameMainManager.instance.player.position.y-z.node.position.z) 
        let dis =temp.abs()
        if(dis<z.dis_catching){
            z.nextstate=2;
        }
    }
    checkGoal(i:number){
        let zcom=GameMainManager.instance.agentNodemap.get(i)
        if(zcom){
            if(zcom.goal){
                let o=zcom.goal.minus(GameMainManager.instance.simulator.getAgentPosition(i))
                if(RVOMath.absSq(o) < 1){
                    GameMainManager.instance.simulator.setAgentPrefVelocity(i, 0.0, 0.0);
                }
                else 
                {
                    // Agent is far away from its goal, set preferred velocity as unit vector towards agent's goal
                    let v = RVOMath.normalize(o).scale(2);
                    GameMainManager.instance.simulator.setAgentPrefVelocity(i, v.x, v.y);
                }
            }else{
                GameMainManager.instance.simulator.setAgentPrefVelocity(i, 0.0, 0.0);
            }
        }

    }

    runup(deltaTime: number,z: zombieCom){
        let temp=new Vector2D(GameMainManager.instance.player.position.x-z.node.position.x,GameMainManager.instance.player.position.y-z.node.position.z) 
        let dis =temp.abs()
        if(dis>z.dis_catching){
            z.nextstate=0;
        }
        else
        if(dis<z.dis_hit){
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
        z.goal=GameMainManager.instance.player.position;
    
        //插值化丝滑地朝向玩家
        let quat: Quat = new Quat();
        Quat.fromEuler(quat,0,(z.node.eulerAngles.y, 90-Math.atan2(temp.y,temp.x)*rta),0)
        Quat.slerp(quat,z.node.rotation,quat,deltaTime);
        z.node.setRotationFromEuler(new Vec3(0,(z.node.eulerAngles.y, 90-Math.atan2(temp.y,temp.x)*rta),0));
        
        let c=GameMainManager.instance.simulator.agents[z.agentid];
        c.update(deltaTime);
        z.node.position=new Vec3(GameMainManager.instance.simulator.agents[z.agentid].position.x,GameMainManager.instance.ground_y,GameMainManager.instance.simulator.agents[z.agentid].position.y)
    }

    dieup(deltaTime: number,z: zombieCom){
        z.count--;
        if(z.count==0)GameMainManager.instance.zombiemgr.release(z);
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
        let a = GameMainManager.instance.zombiemgr.zombieshowings.get(id);
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

