import { _decorator, BoxCollider, Component, Node } from 'cc';
import Vector2D from './rvo2/Vector2D';
import { GameMainManager } from './GameMainManager';
const { ccclass, property } = _decorator;

@ccclass('ObstacleCollect')
export class ObstacleCollect extends Component {
    start() {
        this.schedule(this.colleting,1,0)
        
    }
    colleting(){
        let box:any = this.node.getComponentsInChildren(BoxCollider);
        let w1,h1,w2,h2;
        
        box.forEach(element => {
            let obstacle: Vector2D[] = [];
            let angel=element.node.eulerAngles.y*Math.PI/180;
            w1=element.node.scale.x/2*Math.cos(angel);
            h1=element.node.scale.z/2*Math.sin(angel);
            w2=element.node.scale.x/2*Math.sin(angel);
            h2=element.node.scale.z/2*Math.cos(angel);
            obstacle.push(new Vector2D(element.node.position.x+w1-h1, element.node.position.z+w2+h2));
            obstacle.push(new Vector2D(element.node.position.x-w1-h1, element.node.position.z-w2+h2));
            obstacle.push(new Vector2D(element.node.position.x-w1+h1, element.node.position.z-w2-h2));
            obstacle.push(new Vector2D(element.node.position.x+w1+h1, element.node.position.z+w2-h2));
            GameMainManager.instance.simulator.addObstacle(obstacle);
            
        });
        GameMainManager.instance.simulator.processObstacles();
    }
    update(deltaTime: number) {
        
    }
}


