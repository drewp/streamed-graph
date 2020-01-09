import * as jsonld from "jsonld";
import { JsonLd, JsonLdArray } from "jsonld/jsonld-spec";
import { Quad, NamedNode, DataFactory } from "n3";
const { literal, quad, namedNode } = DataFactory;

// const { rdf } = ns;
const rdf = { type: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" };

function parseObjNode(obj: any) {
  if (obj["@id"]) {
    return namedNode(obj["@id"]);
  } else {
    if (obj["@value"] === undefined) {
      throw new Error("no @id or @value");
    }
    return literal(obj["@value"], obj["@language"] || obj["@type"]);
  }
}

function parsePred(
  onQuad: (q: Quad) => void,
  graphNode: NamedNode,
  subjNode: NamedNode,
  predKey: string,
  subjGroup: any
) {
  let predNode: NamedNode;
  if (predKey === "@type") {
    subjGroup["@type"].forEach((aType: string) => {
      onQuad(quad(subjNode, namedNode(rdf.type), namedNode(aType), graphNode));
    });
    return;
  }
  predNode = namedNode(predKey);
  subjGroup[predKey].forEach(function(obj: any) {
    const objNode = parseObjNode(obj);
    onQuad(quad(subjNode, predNode, objNode, graphNode));
  });
}
function parseSubj(
  onQuad: (q: Quad) => void,
  graphNode: NamedNode,
  subjGroup: { [predOrId: string]: any }
) {
  const subjNode = namedNode(subjGroup["@id"]);
  for (let predKey in subjGroup) {
    if (predKey === "@id") {
      continue;
    }
    parsePred(onQuad, graphNode, subjNode, predKey, subjGroup);
  }
}
function parseGraph(onQuad: (q: Quad) => void, g: JsonLd) {
  var graph = (g as { "@id": string })["@id"];
  var graphNode = namedNode(graph);
  (g as { "@graph": JsonLdArray })["@graph"].forEach(subj => {
    parseSubj(onQuad, graphNode, subj);
  });
}

export async function eachJsonLdQuad(
  jsonLdObj: object,
  onQuad: (q: Quad) => void
) {
  const expanded = await jsonld.expand(jsonLdObj);
  (expanded as JsonLdArray).forEach((g: JsonLd) => parseGraph(onQuad, g));
}
