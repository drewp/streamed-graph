import { N3Store, NamedNode } from "n3";

export function getStringValue(
  store: N3Store | undefined,
  subj: NamedNode,
  pred: NamedNode,
  defaultValue: string = ""
): string {
  if (store === undefined) {
    // this is so you can use the function before you have a graph
    return "...";
  }
  const objs = store.getObjects(subj, pred, null);
  if (objs.length == 0) {
    return defaultValue;
  }
  return objs[0].value;
}
