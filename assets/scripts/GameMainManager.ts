import { _decorator, Camera, Component, instantiate, Node, Prefab, resources, Scene, Vec2, Vec3 } from 'cc';
import Simulator from './rvo2/Simulator';
import RVOMath from "./rvo2/RVOMath"
import Vector2D from "./rvo2/Vector2D";
import { zombieMgr } from './zombieMgr';
import { ObstacleCollect } from './ObstacleCollect';
import { playercontrol } from './playercontrol';
import { zombieCom, zombieSys } from './zombieSys';
import { bulletMgr } from './bulletmgr';
import { gametest } from './gametest';
import { weaponMgr } from './weaponMgr';
import { EntityManager } from './easy_ecs/EntityManager';
const { ccclass, property } = _decorator;

@ccclass('GameMainManager')
export class GameMainManager extends Component {
    static instance: GameMainManager;
    simulator: Simulator;
    entityManager: EntityManager=new EntityManager()
    agentNodemap: Map<number,zombieCom>=new Map();
    @property(Number)
    ground_y:number;
    @property(Node)
    obstacleRoot:Node;
    @property(Node)
    mainCamera:Node;
    player: playercontrol;
    zombiemgr: zombieMgr
    zombiesys: zombieSys
    bulletmgr: bulletMgr
    weaponmgr: weaponMgr
    start() {
        GameMainManager.instance=this;
        this.loadPlayer(new Vec3(0,0,0));
        this.simulator = new Simulator();
        let simulator = this.simulator;
        simulator.setTimeStep(0.02);
        simulator.setAgentDefaults(1,10,0.4,0.4,0.3,2,)
        this.schedule(this.step,0.02)
        this.obstacleRoot.addComponent(ObstacleCollect);
        this.zombiemgr=new (zombieMgr)()
        this.zombiemgr.start_n();
        this.zombiesys=new (zombieSys)()
        this.bulletmgr=new bulletMgr()
        this.bulletmgr.start_n();
        this.weaponmgr=new weaponMgr()
        this.weaponmgr.start_n();
        this.scheduleOnce(()=>{
            let n=new gametest();
            n.start();
        },1)
        
    }
    loadPlayer(pos: Vec3){
        resources.load("player/playernode" , Prefab, (err, Prefab) => {
            let pre = instantiate(Prefab)
            pre.setParent(this.node.parent)
            pre.position=pos
            this.player=pre.getComponent(playercontrol)
            this.mainCamera.setParent(pre)
        });
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
        GameMainManager.instance.simulator.run(this.zombiesys.checkGoal);

    }
   protected update(dt: number): void {
        //this.zombiesys.update(dt)
        this.bulletmgr.update(dt)
        this.entityManager.update(dt)
   }
   
 
}


