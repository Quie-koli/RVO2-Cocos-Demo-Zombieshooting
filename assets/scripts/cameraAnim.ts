import { _decorator, Camera, Component, math, Node, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('cameraAnim')
export class cameraAnim extends Component {
    static instance: cameraAnim;
    @property(Camera)
    camera: Camera
    rectpos: Vec2=Vec2.ZERO;
    shakingpos: Vec2[]=[new Vec2(5,7),new Vec2(-6,7),new Vec2(-13,3)
        ,new Vec2(3,-6),new Vec2(-5,5),new Vec2(2,-8),new Vec2(-8,-10)
        ,new Vec2(3,10),new Vec2(0,0)
    ];
    rect:math.Rect;
    targetposid=0;
    interval=0
    times=0
    timer=0
    start() {
        cameraAnim.instance=this;
        this.rect=new math.Rect(0,0,1,1);
        //this.camera=this.node.getComponent(Camera);
    }
    protected update(dt: number): void {
        if(this.times>0){
            let v: Vec2=new Vec2();
            Vec2.lerp(v,this.rectpos,this.shakingpos[this.targetposid],dt*1.5)
            this.rectpos=v
            this.rect.x=this.rectpos.x*0.002;
            this.rect.y=this.rectpos.y*0.005;
            this.camera.rect=this.rect
            this.timer+=dt;
            if(this.timer>this.interval){
                this.targetposid=(this.targetposid+1)%this.shakingpos.length;
                this.times--;
                this.timer=0;
                if(this.timer==1)this.targetposid=8;
                if(this.timer==0){
                    this.rectpos=Vec2.ZERO;
                    this.rect.x=this.rectpos.x;
                    this.rect.y=this.rectpos.y;
                    this.camera.rect=this.rect
                }
            }
        }
    }
    shaking(interval,times){
        this.interval=interval
        this.times=times
    }
}


