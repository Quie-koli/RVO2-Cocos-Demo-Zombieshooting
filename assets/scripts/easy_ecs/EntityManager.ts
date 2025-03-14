
import { BaseSystem } from './BaseSystem';

export class EntityManager {
    entities: Map<number,Map<Function,IComponent>>=new Map()
    static systems: Map<Function,BaseSystem>=new Map()
    promises;
    numOfEnitity=0
    static registerComponent<T extends IComponent>(system: BaseSystem,type: new()=>T){
        EntityManager.systems.set(type,system)
    }

    addEntity(){
        let o=new Entity()
        o.id=this.numOfEnitity++;
        this.entities.set(o.id,new Map());
        return o;
    }

    setEntityActive(entity: Entity,active: boolean){
        if(entity.active!=active){
            entity.active=active
            let o=this.entities.get(entity.id)
            if(active){
                o.forEach((value,key)=>{
                    EntityManager.systems.get(key).components.set(entity.id,value)
                })
            }else{
                o.forEach((value,key)=>{
                    EntityManager.systems.get(key).components.delete(entity.id)
                })
            }
        }

    }
    
    removeEntity(entity: Entity){
        let o=this.entities.get(entity.id)
        o.forEach((valiue,key)=>{
            EntityManager.systems.get(key).components.delete(entity.id)
        })
        o.clear();
        this.entities.delete(entity.id)
    }
    
    addComponent<T extends IComponent>(entity: Entity,type: new()=>T): T{
        let p=new type
        let e=EntityManager.systems.get(type)
        e.components.set(entity.id,p)
        this.entities.get(entity.id).set(type,p)
        p.entity=entity;
        return p;
    }

    getComponent<T extends IComponent>(entity: Entity,type: new()=>T): T{
        return this.entities.get(entity.id).get(type) as T
    }

    removeComponent<T extends IComponent>(entity: Entity,type: new()=>T): boolean{
        let o=EntityManager.systems.get(type)
        o.components.delete(entity.id)
        return this.entities.get(entity.id).delete(type)
    }

    update(deltaTime: number) {
        for(const [key,value] of EntityManager.systems){
            new Promise(()=>{
                value.allUpdate(deltaTime)
            })
        }
    }
}


export class Entity{
    id: number;
    active: boolean=true;
}

export class IComponent{
    enable: boolean=true;
    entity: Entity;

}

