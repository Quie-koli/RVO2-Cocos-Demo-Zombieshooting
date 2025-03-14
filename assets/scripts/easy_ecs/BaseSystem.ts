

export abstract class BaseSystem {
    abstract components;
    abstract update(value, deltaTime: number) ;
    allUpdate(deltaTime: number){
        for(const [key,value] of this.components){
            this.update(value,deltaTime)
        }
    }
}


