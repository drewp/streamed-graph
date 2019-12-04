import { Quad, Node } from "./rdf_types";
import * as jsonld from "jsonld";

function quadFromExpandedStatement(rdfEnv: any, subj: any, pred: string, obj: any, graphNode: any): Quad {
    return {
        subject: rdfEnv.createNamedNode(subj['@id']),
        predicate: rdfEnv.createNamedNode(pred),
        object: (obj['@id'] ? rdfEnv.createNamedNode(obj['@id']) :
            rdfEnv.createLiteral(obj['@value'], obj['@language'], obj['@type'])),
        graph: graphNode,
    };
}
function quadFromTypeStatement(rdfEnv: any, subj: any, obj: any, graphNode: any): Quad {
    return {
        subject: rdfEnv.createNamedNode(subj['@id']),
        predicate: rdfEnv.createNamedNode('rdf:type'),
        object: rdfEnv.createNamedNode(obj),
        graph: graphNode,
    };
}

export function eachJsonLdQuad(rdfEnv: any, jsonLdObj: object, onQuad: (Quad) => void, done: () => void) {
    jsonld.expand(jsonLdObj, function onExpand(err, expanded) {
        if (err) {
            throw new Error();
        }
        (expanded as [object]).forEach(function (g) {
            var graph = g['@id'];
            var graphNode = rdfEnv.createNamedNode(graph) as Node;
            g['@graph'].forEach(function (subj) {
                for (let pred in subj) {
                    if (pred.match(/^[^@]/)) {
                        subj[pred].forEach(function (obj) {
                            onQuad(quadFromExpandedStatement(rdfEnv, subj, pred, obj, graphNode));
                        });
                    }
                    else {
                        if (pred === "@type") {
                            subj[pred].forEach((obj) => {
                                onQuad(quadFromTypeStatement(rdfEnv, subj, obj, graphNode));
                            });
                        }
                    }
                }
            });
        });
        done();
    });
}
;
