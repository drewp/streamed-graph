// from /my/site/homepage/www/rdf/browse/graphView.js


import { SuffixLabels } from './suffixLabels.js';

const groupByRdfType = (graph) => {
    const env = graph.store.rdf;
    const rdfType = env.createNamedNode('rdf:type');
    const byType = new Map(); // type : subjs
    const untyped = new Set(); // subjs
    graph.quadStore.quads({}, (q) => {
        let subjType = null;
        graph.quadStore.quads({subject: q.subject,
                               predicate: rdfType},
                              (q2) => { subjType = q2.object; });
        if (subjType){
            subjType = subjType.toString();
            if (!byType.has(subjType)) {
                byType.set(subjType, new Set());
            }
            byType.get(subjType).add(q.subject.toString());
        } else {
            untyped.add(q.subject.toString());
        }

    });
    return {byType: byType, untyped: untyped};
};

const graphView = (graph) => {
    const env = graph.store.rdf;

    const labels = new SuffixLabels();
    graph.quadStore.quads({}, (q) => {
        if (q.subject.interfaceName == "NamedNode") { labels.planDisplayForNode(q.subject); }
        if (q.predicate.interfaceName == "NamedNode") { labels.planDisplayForNode(q.predicate); }
        if (q.object.interfaceName == "NamedNode") { labels.planDisplayForNode(q.object); }
        if (q.object.interfaceName == "Literal" && q.object.datatype) { labels.planDisplayForNode(env.createNamedNode(q.object.datatype)); }
    });

    const rdfNode = (n) => {
        if (n.interfaceName == "Literal") {
            let dtPart = "";
            if (n.datatype) {
                dtPart = html`
        ^^<span class="literalType">
          ${rdfNode(env.createNamedNode(n.datatype))}
        </span>`;
            }
            return html`<span class="literal">${n.nominalValue}${dtPart}</span>`;
        }
        if (n.interfaceName == "NamedNode") {
            let dn = labels.getLabelForNode(n);
            if (dn.match(/XMLSchema#.*/)) { dn = dn.replace('XMLSchema#', 'xsd:'); }
            if (dn.match(/rdf-schema#.*/)) { dn = dn.replace('rdf-schema#', 'rdfs:'); }
            return html`<a class="graphUri" href="${n.toString()}">${dn}</a>`;
        }

        return html`[${n.interfaceName} ${n.toNT()}]`;
    }

    const objBlock = (obj) => {
        return html`
        <div class="object">
          ${rdfNode(obj)} <!-- indicate what source or graph said this stmt -->
        </div>
    `;
    };

    /// bunch of table rows
    const predBlock = (subj, pred) => {
        const objsSet = new Set();
        graph.quadStore.quads({ subject: subj, predicate: pred }, (q) => {

            if (q.object.length) {
                console.log(q.object)
            }
            objsSet.add(q.object);
        });
        const objs = Array.from(objsSet.values());
        objs.sort();
        return html`
      <div class="predicate">${rdfNode(pred)}
        <div>
          ${objs.map(objBlock)}
        </div>
      </div>
    `;
    };

    const {byType, untyped} = groupByRdfType(graph);
    const typedSubjs = Array.from(byType.keys());
    typedSubjs.sort();

    const untypedSubjs = Array.from(untyped.values());
    untypedSubjs.sort();

    const subjBlock = (subj) => {
        const subjNode = env.createNamedNode(subj);
        const predsSet = new Set();
        graph.quadStore.quads({ subject: subjNode }, (q) => {
            predsSet.add(q.predicate);
        });
        const preds = Array.from(predsSet.values());
        preds.sort();
        return html`
      <div class="subject">${rdfNode(subjNode)}
        <!-- todo: special section for uri/type-and-icon/label/comment -->
        <div>
          ${preds.map((p) => { return predBlock(subjNode, p); })}
        </div>
      </div>
    `;
    };
    const byTypeBlock = (typeUri) => {
        const subjs = Array.from(byType.get(typeUri));
        subjs.sort();

        const graphCells = new Map(); // [subj, pred] : objs
        const preds = new Set();

        subjs.forEach((subj) => {
            graph.quadStore.quads({subject: env.createNamedNode(subj)}, (q) => {
                preds.add(q.predicate.toString());
                const cellKey = subj + '|||' + q.predicate.toString();
                if (!graphCells.has(cellKey)) {
                    graphCells.set(cellKey, new Set());
                }
                graphCells.get(cellKey).add(q.object);
            });
        });
        const predsList = Array.from(preds);
        predsList.splice(predsList.indexOf('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), 1);
        // also pull out label, which should be used on 1st column
        predsList.sort();

        const thead = () => {
            const predColumnHead = (pred) => {
                return html`<th>${rdfNode(env.createNamedNode(pred))}</th>`;
            };
            return html`
              <thead>
                <tr>
                  <th></th>
                  ${predsList.map(predColumnHead)}
                </tr>
              </thead>`;
        };

        const instanceRow = (subj) => {
            const cell = (pred) => {
                const objs = graphCells.get(subj + '|||' + pred);
                if (!objs) {
                    return html`<td></td>`;
                }
                const objsList = Array.from(objs);
                objsList.sort();
                const draw = (obj) => {
                    return html`<div>${rdfNode(obj)}</div>`
                };
                return html`<td>${objsList.map(draw)}</td>`;
            };

            return html`
              <tr>
                <td>${rdfNode(env.createNamedNode(subj))}</td>
                ${predsList.map(cell)}
              </tr>
            `;
        };

        return html`
          <div>[icon] ${rdfNode(env.createNamedNode(typeUri))} resources</div>
<div class="typeBlockScroll">
          <table class="typeBlock">
            ${thead()}
            ${subjs.map(instanceRow)}
          </table>
</div>
        `;
    };

    return html`
      <link rel="stylesheet" href="/rdf/browse/style.css">

      <section>
        <h2>
          Current graph (<a href="${graph.events.url}">${graph.events.url}</a>)
        </h2>
        <div>
         <!-- todo: graphs and provenance.
          These statements are all in the
          <span data-bind="html: $root.createCurie(graphUri())">...</span> graph.-->
        </div>
        ${typedSubjs.map(byTypeBlock)}
        <div class="spoGrid">
          ${untypedSubjs.map(subjBlock)}
        </div>
      </section>
    `;
}
export { graphView }
