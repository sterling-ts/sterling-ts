import { require as d3require } from 'd3-require';
import {Tree, VisTree} from './Tree';
import { VisualObject } from './VisualObject';
import { TextBox } from './TextBox';
import { Circle } from './Circle';
const d3 = require("d3")

export class Stage{
    Children: VisualObject[]

    constructor(){
        this.Children = []
    }
    add(addObject:VisualObject){
        this.Children.push(addObject)
    }
    addAll(addObjects:VisualObject[]){
        addObjects.forEach((o) => {
            this.Children.push(o);
        })
    }

    children_to_tree_recurse(root:VisualObject):VisTree{
        const descriptiveText:string = root.constructor.name;
        const returnNode:VisTree = {
            visualObject:new TextBox({text: descriptiveText}),
            children: [],
        }
        if(root.getChildren().length == 0){
            return returnNode;
        }
        else{ //recursive step
            root.children.forEach((child:VisualObject) => {
                returnNode.children.push(this.children_to_tree_recurse(child));
            })
        }

        return returnNode;

    }
    
    // render_dep_tree(svg: any, document?:any){
    //     d3.selectAll("svg > *").remove();

    //     const root = this.Children;
    //     const treeRoot:VisTree = this.children_to_tree_recurse(root);
    //     const tree:Tree = new Tree({root: treeRoot, height: 700,width: 700, coords: {x:100,y:100}});
    //     tree.render(svg);
    //     if(document){
    //         const svgContainer = document.getElementById('svg-container')
    //         svgContainer.getElementsByTagName('svg')[0].style.height = '200%'
    //         svgContainer.getElementsByTagName('svg')[0].style.width = '200%'
    //     }
        
    // }
    render(svg:any, document?:any){
        d3.selectAll("svg > *").remove();
        this.Children.forEach(pane => pane.render(svg))
        if(document){
            const svgContainer = document.getElementById('svg-container')
            svgContainer.getElementsByTagName('svg')[0].style.height = '200%'
            svgContainer.getElementsByTagName('svg')[0].style.width = '200%'
        }
    }
}