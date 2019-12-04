class SuffixLabels {
    constructor() {
        this.displayNodes = new Map(); // internal string : { label, link }
        this.usedSuffixes = {usedBy: null, children: new Map()};
    }

    planDisplayForNode(node) {
        const uri = node.nominalValue;
        this._planDisplayForUri(uri);
    };

    _planDisplayForUri(uri) {
        if (this.displayNodes.has(uri)) {
            return;
        }

        const segments = uri.split('/');
        let curs = this.usedSuffixes;
        let label = null;

        for (let i = segments.length - 1; i >= 0; i--) {
            const seg = segments[i];
            if (curs.usedBy && curs.usedBy != uri) {
                this._prependClashingUri(curs);
            }

            if (!curs.children.has(seg)) {
                const child = {usedBy: null, children: new Map()};
                curs.children.set(seg, child);

                if (label === null ) {
                    label = SuffixLabels._tailSegments(uri, segments.length - i);
                    child.usedBy = uri;
                }
            }
            curs = curs.children.get(seg);
        }
        this.displayNodes.set(uri, {label: label});
    }

    _prependClashingUri(curs) {
        // Claim: When a clash is discovered, only 1 uri needs to
        // change its length, and there will be only one child node to
        // follow, and the clashing uri can be changed to prepend that
        // one child (since we'll see it again if that one wasn't
        // enough).
        const clashNode = this.displayNodes.get(curs.usedBy);
        const nextLeftSeg = curs.children.entries().next().value;
        if (nextLeftSeg[1].usedBy) {
            throw new Error("unexpected");
        }

        clashNode.label = nextLeftSeg[0] + '/' + clashNode.label;
        nextLeftSeg[1].usedBy = curs.usedBy;
        curs.usedBy = null;

    }

    getLabelForNode(node) {
        return this.displayNodes.get(node.nominalValue).label;
    }

    static _tailSegments(uri, n) {
        let i = uri.length;
        for (let rep = 0; rep < n; rep++) {
            i = uri.lastIndexOf('/', i - 1);
        }
        return uri.substr(i + 1);
    }
};

export { SuffixLabels }
