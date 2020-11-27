// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import { X12PUtils } from "./X12PUtils";

const {ccclass, property} = cc._decorator;

export class Item{
    public node:cc.Node;
    public index:number;
    public id:number;
    public init(node:cc.Node,index:number){
        this.node = node;
        this.index = index;
    }
    public addEventHandler(target:cc.Node,component:string,handler:string,customEventData:string){
        this.node.getComponent(cc.Button).clickEvents.push(X12PUtils.creatEventHandler(target,component,handler,customEventData));
    }
}

@ccclass
export default class ScrollContent extends cc.Component {

    private scrollView:cc.ScrollView;
    private grid:cc.Node;
    private itemList:Item[]=[];

    private itemHeight:number;
    private itemSpace:number;
    private itemCount:number;

    private onReflesh:(item:Item)=>void;    //item刷新事件
    private onItemClick:(event:cc.Event,customEventData:string)=>void;  //item点击事件

    private cellHeight:number;


    

    init(prefab:cc.Prefab,dataCount:number,itemHeight:number,itemSpace:number,onReflesh:(item:Item)=>void,onItemClick:(event:cc.Event,customEventData:string)=>void){
        this.itemHeight = itemHeight;
        this.itemSpace = itemSpace;
        this.cellHeight = itemHeight+itemSpace;
        this.onReflesh = onReflesh;
        this.onItemClick = onItemClick;

        this.scrollView = this.getComponent(cc.ScrollView);
        let height = this.scrollView.node.getContentSize().height;
        this.itemCount = Math.ceil(height/this.cellHeight)+1;

        this.grid = this.scrollView.content;
        let size = this.grid.getContentSize();
        size.height = this.cellHeight*dataCount-itemSpace;
        this.grid.setContentSize(size.width,size.height);
        
        this.scrollView.node.anchorY=1;
        this.grid.anchorY=1;

        for(let i=0;i<this.itemCount;i++){
            let node = cc.instantiate(prefab);
            node.active=true;
            node.parent = this.grid;
            node.anchorY=1;
            let item = new Item();
            item.init(node,-i);
            item.addEventHandler(this.node,"ScrollContent","OnItemClick",null);
            this.itemList.push(item);
        }
        this.reflesh();
        this.scrollView.scrollEvents.push(X12PUtils.creatEventHandler(this.node,"ScrollContent","reflesh",null));
    }

    private OnItemClick(event:cc.Event,customEventData:string){
        this.onItemClick?.(event,customEventData);
    }

    reflesh(){
        let height = this.grid.position.y;
        //Mathf.Clamp(height, 0, this.grid.getContentSize().height-this.itemCount*this.CellHeight+this.itemSpace);

        let min = 0;
        let max = this.grid.getContentSize().height-this.itemCount*this.cellHeight+this.itemSpace;

        height = height<min?min:height;
        height = height>max?max:height;
        let id = Math.floor(height/this.cellHeight);

        for(let i=0;i<this.itemList.length;i++){
            let item = this.itemList[i];
            let k = id - item.index;
            item.id = k;
            item.node.position = cc.v3(0,-k*this.cellHeight,0);
            item.node.getComponent(cc.Button).clickEvents[0].customEventData =  item.id.toString();
            this.onReflesh?.(item);
        }
    }
}
