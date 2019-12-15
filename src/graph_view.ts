import { html, TemplateResult } from 'lit-html';
import { Quad, Term, NamedNode, N3Store } from 'n3';
import { DataFactory, Util } from 'n3';
const { namedNode } = DataFactory;

import { SuffixLabels } from './suffixLabels';
// import ns from 'n3/src/IRIs';
// const { rdf } = ns;
const rdf = { type: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" };

type TypeToSubjs = Map<NamedNode, Set<NamedNode>>;
function groupByRdfType(graph: N3Store): { byType: TypeToSubjs, untyped: Set<NamedNode> } {
  const rdfType = namedNode(rdf.type);
  const byType: TypeToSubjs = new Map();
  const untyped: Set<NamedNode> = new Set(); // subjs
  const internSubjs = new Map<string, NamedNode>();
  graph.forEach((q) => {
    if (!Util.isNamedNode(q.subject)) {
      throw new Error("unsupported " + q.subject.value);
    }
    const subj = q.subject as NamedNode;

    let subjType: NamedNode | null = null;

    graph.forObjects((o: Quad) => {
      if (Util.isNamedNode(o.object)) {
        subjType = o.object as NamedNode;
      }
    }, subj, rdfType, null);

    if (subjType !== null) {
      // (subj, rdf:type, subjType) in graph
      if (!byType.has(subjType)) {
        byType.set(subjType, new Set());
      }
      (byType.get(subjType) as Set<NamedNode>).add(subj);
    } else {
      // no rdf:type stmt in graph
      if (!internSubjs.has(subj.value)) {
        internSubjs.set(subj.value, subj);
      }
      const intSubj: NamedNode = internSubjs.get(subj.value as string) as NamedNode;
      untyped.add(intSubj);
    }
  }, null, null, null, null);
  return { byType: byType, untyped: untyped };
}


class NodeDisplay {
  labels: SuffixLabels;
  constructor(labels: SuffixLabels) {
    this.labels = labels;
  }
  getHtml(n: Term): TemplateResult {
    if (n.termType == "Literal") {
      let dtPart: any = "";
      if (n.datatype) {
        dtPart = html`
            ^^<span class="literalType">
              ${this.getHtml(n.datatype)}
            </span>`;
      }
      return html`<span class="literal">${n.value}${dtPart}</span>`;
    }

    if (n.termType == "NamedNode") {
      let shortened = false;
      let uriValue: string = n.value;
      for (let [long, short] of [
        ["http://www.w3.org/1999/02/22-rdf-syntax-ns#", "rdf:"],
        ["http://www.w3.org/2000/01/rdf-schema#", "rdfs:"],
        ["http://purl.org/dc/elements/1.1/", "dc:"],
        ["http://www.w3.org/2001/XMLSchema#", "xsd:"]]) {
        if (uriValue?.startsWith(long)) {
          uriValue = short + uriValue.substr(long.length);
          shortened = true;
          break;
        }
      }
      if (!shortened) {

        let dn: string | undefined = this.labels.getLabelForNode(uriValue);
        if (dn === undefined) {
          throw new Error(`dn=${dn}`);
        }
        uriValue = dn;
      }


      return html`<a class="graphUri" href="${n.value}">${uriValue}</a>`;
    }

    return html`[${n.termType} ${n.value}]`;
  }
}

export class GraphView {
  url: string;
  graph: N3Store;
  nodeDisplay: NodeDisplay;
  constructor(url: string, graph: N3Store) {
    this.url = url;
    this.graph = graph;

    const labels = new SuffixLabels();
    this._addLabelsForAllTerms(labels);
    this.nodeDisplay = new NodeDisplay(labels);
  }

  _addLabelsForAllTerms(labels: SuffixLabels) {
    return this.graph.forEach((q: Quad) => {
      if (q.subject.termType === "NamedNode") { labels.planDisplayForNode(q.subject); }
      if (q.predicate.termType === "NamedNode") { labels.planDisplayForNode(q.predicate); }
      if (q.object.termType === "NamedNode") { labels.planDisplayForNode(q.object); }
      if (q.object.termType === "Literal" && q.object.datatype) {
        labels.planDisplayForNode(q.object.datatype);
      }
    }, null, null, null, null);
  }

  _subjBlock(subj: NamedNode) {
    const predsSet: Set<NamedNode> = new Set();
    this.graph.forEach((q: Quad) => {
      predsSet.add(q.predicate as NamedNode);
    }, subj, null, null, null);
    const preds = Array.from(predsSet.values());
    preds.sort();
    return html`
      <div class="subject">${this.nodeDisplay.getHtml(subj)}
        <!-- todo: special section for uri/type-and-icon/label/comment -->
        <div>
          ${preds.map((p) => { return this._predBlock(subj, p); })}
        </div>
      </div>
    `;
  }

  _objBlock(obj: Term) {
    return html`
      <div class="object">
        ${this.nodeDisplay.getHtml(obj)} <!-- indicate what source or graph said this stmt -->
      </div>
    `;
  }

  _predBlock(subj: NamedNode, pred: NamedNode) {
    const objsSet = new Set<Term>();
    this.graph.forEach((q: Quad) => {
      objsSet.add(q.object);
    }, subj, pred, null, null);
    const objs = Array.from(objsSet.values());
    objs.sort();
    return html`
      <div class="predicate">${this.nodeDisplay.getHtml(pred)}
        <div>
          ${objs.map(this._objBlock.bind(this))}
        </div>
      </div>
    `;
  }


  //   const byTypeBlock = (typeUri) => {
  //     const subjs = Array.from(byType.get(typeUri));
  //     subjs.sort();

  //     const graphCells = new Map(); // [subj, pred] : objs
  //     const preds = new Set();

  //     subjs.forEach((subj) => {
  //       graph.getQuads({ subject: new NamedNode(subj) }, (q) => {
  //         preds.add(q.predicate.toString());
  //         const cellKey = subj + '|||' + q.predicate.toString();
  //         if (!graphCells.has(cellKey)) {
  //           graphCells.set(cellKey, new Set());
  //         }
  //         graphCells.get(cellKey).add(q.object);
  //       });
  //     });
  //     const predsList = Array.from(preds);
  //     predsList.splice(predsList.indexOf('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), 1);
  //     // also pull out label, which should be used on 1st column
  //     predsList.sort();

  //     const thead = () => {
  //       const predColumnHead = (pred) => {
  //         return html`<th>${rdfNode(new NamedNode(pred))}</th>`;
  //       };
  //       return html`
  //               <thead>
  //                 <tr>
  //                   <th></th>
  //                   ${predsList.map(predColumnHead)}
  //                 </tr>
  //               </thead>`;
  //     };

  //     const instanceRow = (subj) => {
  //       const cell = (pred) => {
  //         const objs = graphCells.get(subj + '|||' + pred);
  //         if (!objs) {
  //           return html`<td></td>`;
  //         }
  //         const objsList = Array.from(objs);
  //         objsList.sort();
  //         const draw = (obj) => {
  //           return html`<div>${rdfNode(obj)}</div>`
  //         };
  //         return html`<td>${objsList.map(draw)}</td>`;
  //       };

  //       return html`
  //               <tr>
  //                 <td>${rdfNode(new NamedNode(subj))}</td>
  //                 ${predsList.map(cell)}
  //               </tr>
  //             `;
  //     };

  //     return html`
  //           <div>[icon] ${rdfNode(new NamedNode(typeUri))} resources</div>
  // <div class="typeBlockScroll">
  //           <table class="typeBlock">
  //             ${thead()}
  //             ${subjs.map(instanceRow)}
  //           </table>
  // </div>
  //         `;
  //   };

  makeTemplate(): TemplateResult {

    const { byType, untyped } = groupByRdfType(this.graph);
    const typedSubjs = Array.from(byType.keys());
    typedSubjs.sort();

    const untypedSubjs = Array.from(untyped.values());
    untypedSubjs.sort();

    return html`
        <link rel="stylesheet" href="../src/streamed-graph.css">

        <section>
          <h2>
            Current graph (<a href="${this.url}">${this.url}</a>)
          </h2>
          <div>
           <!-- todo: graphs and provenance.
            These statements are all in the
            <span data-bind="html: $root.createCurie(graphUri())">...</span> graph.-->
          </div>
          {typedSubjs.map(byTypeBlock)}
          <div class="spoGrid">
            ${untypedSubjs.map(this._subjBlock.bind(this))}
          </div>
        </section>
      `;
  }
}
