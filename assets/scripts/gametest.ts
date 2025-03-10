import { _decorator, Component, math, Node, random, Vec3 } from 'cc';
import { zombieMgr } from './zombieMgr';
const { ccclass, property } = _decorator;

@ccclass('gametest')
export class gametest extends Component {
    start() {
        this.scheduleOnce(function(){
            for(let i=0;i<8;i++)
            zombieMgr.instance.get(0,new Vec3(i-4,0.8,0));
           
        },2);
        
    }


}
