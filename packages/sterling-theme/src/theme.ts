import { GraphSVGDivProps, ShapeDef } from '@graph-ts/graph-svg';
import { CSSProperties, SVGProps } from 'react';

export type StyleSet = Pick<
  GraphSVGDivProps,
  'nodeLabels' | 'nodeStyles' | 'nodeShapes' | 'edgeLabels' | 'edgeStyles'
>;

export interface SterlingTheme {
  sterling: 'v0';
  nodes?: NodeStyleSpec[];
  edges?: EdgeStyleSpec[];
  projections?: Projection[];
}

export interface NodeStyleSpec {
  targets?: ThemeTypeTarget[];
  shape?: ShapeDef;
  styles?: {
    node?: CSSProperties;
    label?: CSSProperties;
  };
  props?: {
    label?: SVGProps<SVGTextElement>;
  };
  visible?: boolean;
}

export interface EdgeStyleSpec {
  targets?: ThemeRelationTarget[];
  styles?: {
    edge?: CSSProperties;
    label?: CSSProperties;
  };
  collapse?: boolean;
}

export interface Projection {
  type: string;
}

export type ThemeTypeTarget =
  | {
      type: string;
    }
  | '*';

export type ThemeRelationTarget =
  | {
      relation: string;
    }
  | '*';
