import { _decorator, animation, Component, instantiate, Node, Prefab, random, resources, SkinnedMeshRenderer, Vec3 } from 'cc';
import { GameMainManager } from './GameMainManager';
import Vector2D from './rvo2/Vector2D';
import { zombieCom } from './zombieSys';
import { Entity } from './easy_ecs/EntityManager';
const { ccclass, property } = _decorator;

@ccclass('zombieMgr')
export class zombieMgr {
    zombiespool: zombieCom[][];
    zombieshowings: Map<number, zombieCom> = new Map();
    zombieprefabs: Prefab[];
    numofzombietype=1;
    numofz=0;
    numofloadz=0;
    start_n(): void {
        let i: number;
        this.zombieprefabs=new Array(this.numofzombietype);
        this.zombiespool = new Array(this.numofzombietype);
        for(i=0;i<this.numofzombietype;i++){
            resources.load("zombies/zombie" +(i+1).toString(), Prefab, (err, Prefab) => {
                this.zombieprefabs[this.numofloadz] = Prefab;
                this.zombiespool[this.numofloadz]=new Array(0);
                this.numofloadz++;
            }
            );
            
        }
    }

    get(typeofz: number,pos: Vec3): zombieCom{
        let a: zombieCom;
        if(this.zombiespool[typeofz].length<=0){
            let c = instantiate(this.zombieprefabs[typeofz]);
            c.setParent(GameMainManager.instance.node);
            let g=GameMainManager.instance.entityManager.addEntity()
            a = GameMainManager.instance.entityManager.addComponent(g,zombieCom)
            a.animcontroller=c.getComponent(animation.AnimationController);
            a.node=c;
            a.zombietype=typeofz;
            a.id=this.numofz++;
            c.name=a.id.toString();
            a.node.position=pos
            a.agentid=GameMainManager.instance.addAgent(a)
            GameMainManager.instance.simulator.agents[a.agentid].tag=a.id;
            GameMainManager.instance.simulator.agents[a.agentid].type=1;
        }else{
            a=this.zombiespool[typeofz].pop();
            GameMainManager.instance.entityManager.setEntityActive(a.entity,true)
            a.node.position=pos
            GameMainManager.instance.simulator.enableAgent(a.agentid)
            GameMainManager.instance.simulator.setAgentPosition(a.agentid,a.node.position.x,a.node.position.z);
            a.animcontroller.setValue("state",0);
            a.goal=undefined
        }
        
        a.attack=false;
        a.idletype=0;
        a.state=0;
        a.hp=1;
        a.node.active=true;
        a.nextstate=0;
        a.count=240;
        this.zombieshowings.set(a.id,a);
        return a;
    }

    release(z: zombieCom){
        if(this.zombieshowings.has(z.id)){
            this.zombieshowings.delete(z.id);
        }
        this.zombiespool[z.zombietype].push(z);
        z.node.active=false;
        GameMainManager.instance.simulator.disableAgent(z.agentid)
        GameMainManager.instance.entityManager.setEntityActive(z.entity,false)
    }
}


