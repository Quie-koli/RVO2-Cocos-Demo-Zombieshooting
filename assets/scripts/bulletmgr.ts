import { _decorator, Component, instantiate, Node, PhysicsSystem, Prefab, resources } from 'cc';

import { GameMainManager } from './GameMainManager';
import Vector2D from './rvo2/Vector2D';
import { bulletCom } from './bulletSys';
const { ccclass, property } = _decorator;

@ccclass('bulletMgr')
export class bulletMgr{
    bulletprefab: Prefab;
    bulletpool: bulletCom[] = new Array(0);
    bulletnum: number=0;
    temp: Vector2D=new Vector2D(0,0)
    tempAgents: number[]=[]
    start_n(): void { 
        resources.load("bullet" , Prefab, (err, Prefab) => {this.bulletprefab = Prefab;});
    }

    get(): bulletCom{
        let a: bulletCom;   
        if(this.bulletpool.length==0)
        {
            let p = instantiate(this.bulletprefab)
            let e = GameMainManager.instance.entityManager.addEntity()
            a=GameMainManager.instance.entityManager.addComponent(e,bulletCom)
            a.node=p
            a.cid=this.bulletnum++;
           
            a.node.setParent(GameMainManager.instance.node);
        }
        else
        {
            a =this.bulletpool.pop();
            GameMainManager.instance.entityManager.setEntityActive(a.entity,true)
            a.node.active=true;
        }
        a.speed=10;
        a.lifetime=2;


        return a;
    }

    release(n: bulletCom){
        this.bulletpool.push(n);
        n.node.active=false;
        GameMainManager.instance.entityManager.setEntityActive(n.entity,false)
    }
}


