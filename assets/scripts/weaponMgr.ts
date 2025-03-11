import { _decorator, Component, instantiate, Node, Prefab, resources } from 'cc';
import { weaponData } from './weaponData';
import { playercontrol } from './playercontrol';
const { ccclass, property } = _decorator;

@ccclass('weaponMgr')
export class weaponMgr {
    Weapons: Map<string,Prefab>=new Map()
    start_n() {
        resources.loadDir("weapons/" ,Prefab, (err, prefab) => {
            prefab.forEach((value)=>{
                this.Weapons.set(value.name,value)
            })
        })
    }

    get(name: string){
        if(this.Weapons.has(name)){
            const newNode = instantiate(this.Weapons.get(name));
            return newNode
        }
        return null  
    }

}


