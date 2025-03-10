import { _decorator, animation, Component, instantiate, Node, Prefab, random, resources, Vec3 } from 'cc';
import { GameMainManager } from './GameMainManager';
import Vector2D from './rvo2/Vector2D';
const { ccclass, property } = _decorator;

@ccclass('zombieMgr')
export class zombieMgr extends Component {
    static instance: zombieMgr;
    zombiespool: zombieCom[][];
    zombieshowings: Map<number, zombieCom> = new Map();
    zombieprefabs: Prefab[];
    numofzombietype=1;
    numofz=0;
    numofloadz=0;
    protected onLoad(): void {
        zombieMgr.instance=this;    
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
            c.setParent(this.node);
            a=new zombieCom();
            a.animcontroller=c.getComponent(animation.AnimationController);
            a.node=c;
            a.zombietype=typeofz;
            a.id=this.numofz++;
            c.name=a.id.toString();
            a.node.position=pos
            a.agentid=GameMainManager.instance.addAgent(a)
        }else{
            a=this.zombiespool[typeofz].pop();
            a.node.position=pos
            GameMainManager.instance.simulator.enableAgent(a.agentid)
            GameMainManager.instance.simulator.setAgentPosition(a.agentid,a.node.position.x,a.node.position.z);
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
    }
}


export class zombieCom{
    zombietype: number;
    id: number;
    animcontroller: animation.AnimationController;
    state: number;
    attack: boolean;
    idletype: number;
    hp: number;
    node: Node;
    nextstate: number;
    count: number;
    agentid: number;
    goal: Vector2D;
}