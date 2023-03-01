import { Shape } from './Shape';
import { require as d3require } from 'd3-require';
//import { require as d3require } from 'd3-require';
// This wasn't using d3require anyway, just old-style require, which caused d3 to have type "any"
//const d3 = require("d3")
import * as d3 from 'd3';
import { VisualObject } from './VisualObject';
import { BoundingBox, Coords, toFunc, averagePath, shiftList, boundsOfList } from './Utility';
import {
  DEFAULT_COLOR,
  DEFAULT_LINE_COLOR,
  DEFAULT_STROKE_WIDTH
} from './Constants';

export class Line extends VisualObject {
  pointsRelative: (() => Coords)[];
  color: () => string;
  width: () => number;
  opacity: () => number;

  arrow: boolean;

  /**
   * Creates a line on the given poitns.
   * @param points list of points for the line to pass through
   * @param color color of line
   * @param width width of line
   * @param opacity of the line
   */
  constructor(
      points: Coords[] | (() => Coords)[], 
      arrow?: boolean,
      color?: string | (() => string), 
      width?: number | (() => number),
      opacity?: number | (() => number)) {

    let pointsUnshifted: (() => Coords)[] = points.map(
        (point): (() => Coords) => toFunc({x: 0, y: 0}, point))

    super((): Coords => {
      return averagePath(pointsUnshifted.map((coordFunc) => coordFunc()))
      });

    
    this.pointsRelative = shiftList(pointsUnshifted, this.center)
    this.color = toFunc(DEFAULT_LINE_COLOR, color);
    this.width = toFunc(DEFAULT_STROKE_WIDTH, width);
    this.opacity = toFunc(1, opacity)
    this.arrow = arrow ?? false;
  }

  boundingBox(): BoundingBox {
    return boundsOfList(this.pointsRelative.map((pointFn) => {return {
      x: pointFn().x + this.center().x,
      y: pointFn().y + this.center().y
    }}));
  }

  setColor(color: string | (() => string)) { this.color = toFunc(this.color(), color); }
  setWidth(width: number | (() => number)) { this.width = toFunc(this.width(), width); }
  setOpacity(opacity: number | (() => number)) {this.opacity = toFunc(this.opacity(), opacity)}

  override render(svg: any) {
    let truePoints: Coords[] = this.pointsRelative.map((pointFn): Coords => {return {
      x: pointFn().x + this.center().x,
      y: pointFn().y + this.center().y
    }}
    )
    let path = d3.path();
    path.moveTo(truePoints[0].x, truePoints[0].y);
    truePoints.forEach((point: Coords) => {
      path.lineTo(point.x, point.y);
    });

    //add in definition for arrow
    d3.select(svg)
      .append('svg:defs')
      .append('svg:marker')
      .attr('id', 'triangle')
      .attr('refX', 11)
      .attr('refY', 6)
      .attr('markerWidth', 30)
      .attr('markerHeight', 30)
      .attr('markerUnits', 'userSpaceOnUse')
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 12 6 0 12 3 6')
      .style('fill', 'black');
// credit to : http://jsfiddle.net/igbatov/v0ekdzw1/
//for the arrows (thanks Igor Batov <3)

    // TypeScript will now enforce that we're passing the proper type to attr.
    // attr doesn't take Paths, but string will work.
    if(this.arrow){
        d3.select(svg)
            .append('path')
            .attr('d', path.toString())
            .attr('stroke-width', this.width)
            .attr('stroke', this.color)
            .attr('opacity', this.opacity())
            .attr("marker-end", "url(#triangle)")
            .attr('fill', 'transparent'); // Should prob make easier in future.
        super.render(svg);
    }
    else{
        d3.select(svg)
            .append('path')
            .attr('d', path.toString())
            .attr('stroke-width', this.width)
            .attr('stroke', this.color)
            .attr('opacity', this.opacity())
            .attr('fill', 'transparent'); // Should prob make easier in future.
        super.render(svg);
  }
    }
    
}