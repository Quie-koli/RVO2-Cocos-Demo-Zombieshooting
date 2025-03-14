
import { BaseSystem } from './BaseSystem';

export class EntityManager {
    entities: Map<Entity,Map<Function,IComponent>>=new Map()
    static systems: Map<Function,BaseSystem>=new Map()
    promises;
    numOfEnitity=0
    static registerComponent<T extends IComponent>(system: BaseSystem,type: new()=>T){
        EntityManager.systems.set(type,system)
    }

    addEntity(){
        let o=new Entity()
        o.id=this.numOfEnitity++;
        this.entities.set(o,new Map());
        return o;
    }

    setEntityActive(entity: Entity,active: boolean){
        if(entity.active!=active){
            entity.active=active
            let o=this.entities.get(entity)
            if(active){
                o.forEach((value,key)=>{
                    EntityManager.systems.get(key).components.set(entity,value)
                })
            }else{
                o.forEach((value,key)=>{
                    EntityManager.systems.get(key).components.delete(entity)
                })
            }
        }

    }
    
    removeEntity(entity: Entity){
        let o=this.entities.get(entity)
        o.forEach((valiue,key)=>{
            EntityManager.systems.get(key).components.delete(entity)
        })
        o.clear();
        this.entities.delete(entity)
    }
    
    addComponent<T extends IComponent>(entity: Entity,type: new()=>T): T{
        let p=new type
        let e=EntityManager.systems.get(type)
        e.components.set(entity,p)
        this.entities.get(entity).set(type,p)
        p.entity=entity;
        return p;
    }

    getComponent<T extends IComponent>(entity: Entity,type: new()=>T): T{
        return this.entities.get(entity).get(type) as T
    }

    removeComponent<T extends IComponent>(entity: Entity,type: new()=>T): boolean{
        let o=EntityManager.systems.get(type)
        o.components.delete(entity)
        return this.entities.get(entity).delete(type)
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

