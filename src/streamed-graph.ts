
// these are just for timebank- move them out
import '@polymer/polymer/lib/elements/dom-bind.js';


import { PolymerElement, html } from '@polymer/polymer';
import { customElement, property, computed } from '@polymer/decorators';
import { render } from 'lit-html';
import { graphView } from './graph_view';
import { N3Store } from "n3"

import { StreamedGraphClient } from './streamed_graph_client';

@customElement('streamed-graph')
class StreamedGraph extends PolymerElement {
    @property({ type: String })
    url: string = '';

    @property({ type: Object })
    graph: {version: number, graph: N3Store};

    @property({ type: Boolean })
    expanded: Boolean = false;

    @computed('expanded')
    get expandAction() {
        return this.expanded ? '-' : '+';
    }

    @property({ type: String })
    status: String = '';

    sg: StreamedGraphClient;
    graphView: Element;
    graphViewDirty = true;

    static get template() {
        return html`
            <link rel="stylesheet" href="../src/streamed-graph.css">
            <div id="ui">
                <span class="expander"><button on-click="toggleExpand">{{expandAction}}</button></span>
                StreamedGraph <a href="{{url}}">[source]</a>:
                {{status}}
            </div>
            <div id="graphView"></div>`;
    }

    ready() {
        super.ready();
        this.graph = {version: -1, graph: null};
        this.graphView = this.shadowRoot.getElementById("graphView");

        this._onUrl(this.url); // todo: watch for changes and rebuild
    }

    toggleExpand(ev) {
        this.expanded = !this.expanded;
        if (this.expanded) {
            this.redrawGraph()
        } else {
            this.graphViewDirty = false;
            render(null, this.graphView);
        }
    }

    redrawGraph() {
        this.graphViewDirty = true;
        requestAnimationFrame(this._redrawLater.bind(this));
    }

    _onUrl(url) {
        if (this.sg) { this.sg.close(); }
        this.sg = new StreamedGraphClient(
            url,
            this.onGraphChanged.bind(this),
            this.set.bind(this, 'status'),
            [],//window.NS,
            []
        );
    }

    onGraphChanged() {
        this.graph = { version: this.graph.version + 1, graph: this.sg.store };
        if (this.expanded) {
            this.redrawGraph();
        }
    }

    _redrawLater() {
        if (!this.graphViewDirty) return;
        render(graphView(this.graph.graph), this.graphView);
        this.graphViewDirty = false;
    }


}