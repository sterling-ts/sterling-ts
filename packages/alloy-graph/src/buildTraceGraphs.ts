import { AlloyEdge, AlloyGraph, AlloyNode } from '@/alloy-graph';
import { AlloyTrace } from '@/alloy-instance';
import { SterlingTheme } from '@/sterling-theme';
import { newGraph } from '@graph-ts/graph-lib';
import { Dict, PathDef } from '@graph-ts/graph-svg';
import _ from 'lodash';
import {
  AtomNode,
  getVisibleGraphComponents
} from './getVisibleGraphComponents';
import { layoutGraph } from './layoutGraph';
import { layoutNodes } from './layoutNodes';
import { projectInstances } from './projectInstances';

/**
 * Build graphs for each instance in an Alloy trace, ensuring consistent
 * placement for nodes shared among the graphs.
 *
 * @param trace
 * @param theme
 */
export function buildTraceGraphs(
  trace: AlloyTrace,
  theme?: SterlingTheme
): [AlloyGraph, Dict<PathDef>][] {
  // Apply projections to all instances
  const instances = projectInstances(trace.instances, theme);

  // Get the graph components for each instance
  const graphComponents = instances.map((instance) =>
    getVisibleGraphComponents(instance, theme)
  );

  // Get the graph components for the complete trace
  const traceNodes: AtomNode[] = _.chain(
    graphComponents.map((comp) => comp.nodes)
  )
    .flatten()
    .uniqBy((node: AtomNode) => node.atom.id)
    .value();
  const traceEdges: AlloyEdge[] = _.chain(
    graphComponents.map((comp) => comp.edges)
  )
    .flatten()
    .uniqBy((edge: AlloyEdge) => edge.id)
    .value();

  const { nodes, edgePaths } = layoutGraph({
    nodes: traceNodes,
    edges: traceEdges
  });
  const nodeDict = _.keyBy(nodes, (node: AlloyNode) => node.id);

  return graphComponents.map((components) => {
    const graphNodes = components.nodes.map(
      (atomNode) => nodeDict[atomNode.id]
    );
    const graphEdges = components.edges;
    return [newGraph(graphNodes, graphEdges), edgePaths];
  });
}
