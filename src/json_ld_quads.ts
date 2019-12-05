import * as jsonld from "jsonld";
import { DataFactory, Quad } from 'n3';
const { namedNode, literal, quad } = DataFactory;
import ns from 'n3/src/IRIs';
const {rdf} = ns;

export function eachJsonLdQuad(jsonLdObj: object, onQuad: (q: Quad) => void, done: () => void) {
    jsonld.expand(jsonLdObj, function onExpand(err, expanded) {
        if (err) {
            throw new Error();
        }
        (expanded as [object]).forEach(function (g) {
            var graph = g['@id'];
            var graphNode = namedNode(graph);
            g['@graph'].forEach(function (subj) {
                const subjNode = namedNode(subj['@id']);
                for (let pred in subj) {
                    if (pred === '@id') {
                        continue;
                    }
                    let predNode;
                    if (pred === "@type") {
                        predNode = namedNode(rdf.type);
                    } else {
                        predNode = namedNode(pred['@id']);
                    }
                    subj[pred].forEach(function (obj) {
                        const objNode = (obj['@id'] ? namedNode(obj['@id']) :
                            literal(obj['@value'], obj['@language'] || obj['@type']));
                        onQuad(quad(subjNode, predNode, objNode, graphNode));
                    });
                }
            });
        });
        done();
    });
}
;
