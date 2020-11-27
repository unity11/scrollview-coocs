// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


export class X12PUtils {

    public static creatEventHandler(target:cc.Node,component:string,handler:string,customEventData:string):cc.Component.EventHandler{
        let eventHandler = new cc.Component.EventHandler();
        eventHandler.target=target;
        eventHandler.component=component;
        eventHandler.handler = handler;
        eventHandler.customEventData=customEventData;
        return eventHandler;
    }

    public static loadResSync(url:string):Promise<cc.Asset[]>{
        return new Promise<cc.Asset[]>((reovle, reject)=>{
            cc.resources.loadDir(url,cc.Asset,(err,res)=>{
                if(err!=null){
                    reject(err);
                }else{
                    reovle(res);
                }
            });
        });
    }
}
