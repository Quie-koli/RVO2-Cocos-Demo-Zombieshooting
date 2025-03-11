import { _decorator, Component, math, Node, random, Vec3 } from 'cc';
import { zombieMgr } from './zombieMgr';
import { playercontrol } from './playercontrol';
import { GameMainManager } from './GameMainManager';
const { ccclass, property } = _decorator;

@ccclass('gametest')
export class gametest {
    start() {
       if(!GameMainManager.instance.player){
        GameMainManager.instance.loadPlayer(new Vec3(0,0,0));
        
    }
            for(let i=0;i<8;i++){
                GameMainManager.instance.zombiemgr.get(0,new Vec3(i-4,0.8,0));
            }
            GameMainManager.instance.player.loadweapon("m4a1");
        
        
    }


}
