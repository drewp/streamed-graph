import * as jsonld from "jsonld";
import { Quad, NamedNode, Literal, N3Store } from 'n3';



import { DataFactory } from 'n3';
const { literal, quad, namedNode } = DataFactory;

import ns from 'n3/src/IRIs';
const { rdf } = ns;

function _emitQuad(
    onQuad: (q: Quad) => void,
    subjNode: NamedNode,
    pred: string | { '@id': string },
    subj: any,
    graphNode: NamedNode) {
    let predNode: NamedNode;
    if (pred === "@type") {
        predNode = namedNode(rdf.type);
    }
    else {
        predNode = namedNode(pred['@id']);
    }
    subj[pred as string].forEach(function (obj: any) {
        const objNode = (obj['@id'] ? namedNode(obj['@id']) :
            literal(obj['@value'],
                obj['@language'] || obj['@type']));
        onQuad(quad(subjNode, predNode, objNode, graphNode));
    });
}

export async function eachJsonLdQuad(jsonLdObj: object, onQuad: (q: Quad) => void) {

    return new Promise(function (resolve, reject) {

        jsonld.expand(jsonLdObj, function onExpand(err, expanded) {
            if (err) {
                reject(err);
            }
            (expanded as [object]).forEach(function (g) {
                var graph = g['@id'];
                var graphNode = namedNode(graph);
                g['@graph'].forEach(function (subj) {
                    const subjNode = namedNode(subj['@id']);
                    for (let pred in subj) {
                        if (pred === '@id') {
                            continue;
                        } 2
                        _emitQuad(onQuad, subjNode, pred, subj, graphNode);
                    }
                });
            });
            resolve();
        });
    });
}
;
