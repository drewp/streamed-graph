import * as jsonld from "jsonld";
import { JsonLd, JsonLdArray } from 'jsonld/jsonld-spec';
import { Quad, NamedNode, DataFactory } from 'n3';
const { literal, quad, namedNode } = DataFactory;

// import {} from 'n3';
// const { rdf } = ns;
const rdf = { type: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" };

function _emitQuad(
    onQuad: (q: Quad) => void,
    subjNode: NamedNode,
    pred: string,
    subj: any,
    graphNode: NamedNode) {
    let predNode: NamedNode;
    if (pred === "@type") {
        predNode = namedNode(rdf.type);
    }
    else {
        predNode = namedNode(pred);
    }
    subj[pred as string].forEach(function (obj: any) {
        const objNode = (obj['@id'] ? namedNode(obj['@id']) :
            literal(obj['@value'],
                obj['@language'] || obj['@type']));
        onQuad(quad(subjNode, predNode, objNode, graphNode));
    });
}

export async function eachJsonLdQuad(jsonLdObj: object, onQuad: (q: Quad) => void) {

    const expanded = await jsonld.expand(jsonLdObj);

    (expanded as JsonLdArray).forEach(function (g: JsonLd) {
        var graph = (g as { '@id': string })['@id'];
        var graphNode = namedNode(graph);
        (g as { '@graph': JsonLdArray })['@graph'].forEach(function (subj: { [predOrId: string]: any; }) {
            const subjNode = namedNode(subj['@id']);
            for (let pred in subj) {
                if (pred === '@id') {
                    continue;
                }
                _emitQuad(onQuad, subjNode, pred, subj, graphNode);
            }
        });
    });
}
