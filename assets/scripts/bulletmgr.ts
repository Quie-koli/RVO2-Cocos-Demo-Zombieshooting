import { _decorator, Component, instantiate, Node, PhysicsSystem, Prefab, resources } from 'cc';
import { bulletdata } from './bulletdata';
const { ccclass, property } = _decorator;

@ccclass('bulletmgr')
export class bulletmgr extends Component {
    static instance: bulletmgr;
    bulletprefab: Prefab;
    bulletpool: bulletdata[] = new Array(0);
    bulletshooting: Map<number, bulletdata> = new Map();
    bulletnum: number=0;
    protected onLoad(): void { 
        bulletmgr.instance=this;
        resources.load("guns/bullet" , Prefab, (err, Prefab) => {this.bulletprefab = Prefab;});
    }

    start() {

    }

    update(deltaTime: number) {
        this.bulletshooting.forEach((value , key) =>{
            value.node.setPosition(value.node.right.multiplyScalar(-value.speed).add(value.node.position));
            value.lifetime--;
            if(value.lifetime<=0)this.release(value);
        });
    }

    get(): bulletdata{
        let a: bulletdata;   
        if(this.bulletpool.length==0)
        {
            a = instantiate(this.bulletprefab).getComponent(bulletdata);
            a.cid=this.bulletnum++;
            a.node.setParent(this.node);
        }
        else
        {
            a =this.bulletpool.pop();
            a.node.active=true;
        }
        this.bulletshooting.set(a.cid,a);
        return a;
    }

    release(n: bulletdata){
        if(this.bulletshooting.has(n.cid)){
            this.bulletshooting.delete(n.cid);
        }
        this.bulletpool.push(n);
        n.node.active=false;
    }
}


