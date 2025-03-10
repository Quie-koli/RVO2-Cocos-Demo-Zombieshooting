import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';
import Simulator from './rvo2/Simulator';
import RVOMath from "./rvo2/RVOMath"
import Vector2D from "./rvo2/Vector2D";
import { zombieCom } from './zombieMgr';
const { ccclass, property } = _decorator;

@ccclass('GameMainManager')
export class GameMainManager extends Component {
    static instance: GameMainManager;
    simulator: Simulator;
    agentNodemap: Map<number,zombieCom>=new Map();
    @property(Number)
    ground_y:number;
    start() {
        GameMainManager.instance=this;
        this.simulator = new Simulator();
        let simulator = this.simulator;
        simulator.setTimeStep(0.02);
        simulator.setAgentDefaults(
            //在寻找周围邻居的搜索距离，这个值设置越大，会让小球在越远距离做出避障行为
            1, // neighbor distance (min = radius * radius)

            //寻找周围邻居的最大数目，这个值设置越大，最终计算的速度越 精确，但会加大计算量
            10, // max neighbors

            //计算动态的物体时的时间窗口
            0.4, // time horizon

            //代表计算静态的物体时的时间窗口，比如在RTS游戏中，小兵 向城墙移动时，没必要做出避障，这个值需要设置的很
            0.4, // time horizon obstacles

            //代表计算ORCA时的小球的半径，这个值不一定与小球实际显示的半径 一样，偏小有利于小球移动顺畅
            0.3, // agent radius

            //小球最大速度值
            2, // max speed
            //初始速度
            // 0, // default velocity for x
            // 0, // default velocity for y
        )
        this.schedule(this.step,0.02)
    }
    addAgent(zcom: zombieCom){
        let id=GameMainManager.instance.simulator.addAgent(new Vector2D(zcom.node.position.x,zcom.node.position.y))        
        this.agentNodemap.set(id,zcom)
        return id;
    }
    deleteAgent(id: number){
        return GameMainManager.instance.agentNodemap.delete(id);
    }
    step() {
        GameMainManager.instance.simulator.run(this.checkGoal);

    }
   protected update(dt: number): void {
        let simulator = this.simulator;
        let c;
        for (var i = 0; i < simulator.agentsinuse.length; i++) {
            c=simulator.agentsinuse[i];
            c.update(dt);
            this.updateNode(c.id);
        }
   }
    checkGoal(i:number){
        let zcom=GameMainManager.instance.agentNodemap.get(i)
        if(zcom){
            if(zcom.goal){
                let o=zcom.goal.minus(GameMainManager.instance.simulator.getAgentPosition(i))
                if(RVOMath.absSq(o) < 1){
                    GameMainManager.instance.simulator.setAgentPrefVelocity(i, 0.0, 0.0);
                }
                else 
                {
                    // Agent is far away from its goal, set preferred velocity as unit vector towards agent's goal
                    let v = RVOMath.normalize(o).scale(2);
                    GameMainManager.instance.simulator.setAgentPrefVelocity(i, v.x, v.y);

                }
            }else{
                GameMainManager.instance.simulator.setAgentPrefVelocity(i, 0.0, 0.0);
            }
        }

    }
    updateNode(i:number){
        let zcom=GameMainManager.instance.agentNodemap.get(i)
        if(zcom){
            zcom.node.position=new Vec3(GameMainManager.instance.simulator.agents[i].position.x,GameMainManager.instance.ground_y,GameMainManager.instance.simulator.agents[i].position.y)
        }
       
    }   
}


