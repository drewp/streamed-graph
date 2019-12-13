import { Term } from 'n3';

type SuffixesNode = { usedBy?: string, children: Map<string, SuffixesNode> };
type DisplayNode = { label?: string, link?: string };
class SuffixLabels {
    displayNodes: Map<string, DisplayNode>;
    usedSuffixes: SuffixesNode;
    constructor() {
        this.displayNodes = new Map();
        this.usedSuffixes = { usedBy: undefined, children: new Map() };
    }

    planDisplayForNode(node: Term) {
        const uri = node.value;
        this._planDisplayForUri(uri);
    };

    _planDisplayForUri(uri: string) {
        if (this.displayNodes.has(uri)) {
            return;
        }

        const segments = uri.split('/');
        let curs = this.usedSuffixes;
        let label: string | undefined = undefined;

        for (let i = segments.length - 1; i >= 0; i--) {
            const seg = segments[i];
            if (curs.usedBy && curs.usedBy != uri) {
                this._prependClashingUri(curs);
            }

            if (!curs.children.has(seg)) {
                const child: SuffixesNode = { usedBy: undefined, children: new Map() };
                curs.children.set(seg, child);

                if (label === undefined) {
                    label = SuffixLabels._tailSegments(uri, segments.length - i);
                    child.usedBy = uri;
                }
            }
            curs = curs.children.get(seg)!;
        }
        this.displayNodes.set(uri, { label: label });
    }

    _prependClashingUri(curs: SuffixesNode) {
        // Claim: When a clash is discovered, only 1 uri needs to
        // change its length, and there will be only one child node to
        // follow, and the clashing uri can be changed to prepend that
        // one child (since we'll see it again if that one wasn't
        // enough).
        const clashNode: DisplayNode = this.displayNodes.get(curs.usedBy!)!;
        const nextLeftSeg = curs.children.entries().next().value;
        if (nextLeftSeg[1].usedBy) {
            throw new Error("unexpected");
        }

        clashNode.label = nextLeftSeg[0] + '/' + clashNode.label;
        nextLeftSeg[1].usedBy = curs.usedBy;
        curs.usedBy = undefined;

    }

    getLabelForNode(node: string) {
        return this.displayNodes.get(node)!.label;
    }

    static _tailSegments(uri: string, n: number) {
        let i = uri.length;
        for (let rep = 0; rep < n; rep++) {
            i = uri.lastIndexOf('/', i - 1);
        }
        return uri.substr(i + 1);
    }
};

export { SuffixLabels }
