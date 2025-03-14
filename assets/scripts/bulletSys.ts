import { _decorator, Node} from 'cc';
import { GameMainManager } from './GameMainManager';
import { Entity, EntityManager, IComponent } from './easy_ecs/EntityManager';
import { BaseSystem } from './easy_ecs/BaseSystem';
import Vector2D from './rvo2/Vector2D';



export class bulletCom extends IComponent {
    cid: number=0;
    speed: number=10;
    lifetime: number=2;
    node: Node;
    a: any;
}

export class bulletSys extends BaseSystem{
    components: Map<number,bulletCom>=new Map()


    update(value: bulletCom, deltaTime: number) {
        value.node.position=(value.node.right.multiplyScalar(-value.speed*deltaTime).add(value.node.position));
        let temp=new Vector2D(value.node.position.x,value.node.position.z);
        temp.x=value.node.position.x;
        temp.y=value.node.position.z;
        let tempAgents=[]
        try{
            if(GameMainManager.instance.simulator.kdTree._checkObstacleTreeByPos(temp,0.1)){
                GameMainManager.instance.bulletmgr.release(value)
                return;
            }
            GameMainManager.instance.simulator.kdTree._queryPosdTree(temp,0.1,0, tempAgents,1)
            if(tempAgents.length>0){
                let i=GameMainManager.instance.simulator.agents[tempAgents[0]];
                if(i.type==1){
                    GameMainManager.instance.zombiesys.hit(i.tag);
                }
                GameMainManager.instance.bulletmgr.release(value)
                return;
            }
           
        }catch{

        }
        value.lifetime-=deltaTime;
        if(value.lifetime<=0)GameMainManager.instance.bulletmgr.release(value)

        
    }

}
EntityManager.registerComponent(new bulletSys,bulletCom)