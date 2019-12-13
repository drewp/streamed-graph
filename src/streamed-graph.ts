
// these are just for timebank- move them out
import '@polymer/polymer/lib/elements/dom-bind.js';


import { PolymerElement, html } from '@polymer/polymer';
import { customElement, property, computed } from '@polymer/decorators';
import { render } from 'lit-html';
import { GraphView } from './graph_view';
import { N3Store } from "n3"

import { StreamedGraphClient } from './streamed_graph_client';

@customElement('streamed-graph')
class StreamedGraph extends PolymerElement {
    @property({ type: String })
    url: string = '';

    // @property({ type: Object })
    // graph: {version: number, store!: N3Store};

    // @property({ type: boolean })
    // expanded: boolean = false;

    // @computed('expanded')
    // expandAction(): string {
    //     return this.expanded ? '-' : '+';
    // }

    // @property({ type: string })
    // status: string = '';

    // sg: StreamedGraphClient;
    // graphView: Element;
    // graphViewDirty = true;

    // static get template() {
    //     return html`
    //         <link rel="stylesheet" href="../src/streamed-graph.css">
    //         <div id="ui">
    //             <span class="expander"><button on-click="toggleExpand">{{expandAction}}</button></span>
    //             StreamedGraph <a href="{{url}}">[source]</a>:
    //             {{status}}
    //         </div>
    //         <div id="graphView"></div>`;
    // }

    // ready() {
    //     super.ready();
    //     this.graph = {version: -1, store: null};
    //     this.graphView = (this.shadowRoot as ShadowRoot).getElementById("graphView") as Element;

    //     this._onUrl(this.url); // todo: watch for changes and rebuild
    // }

    // toggleExpand(ev) {
    //     this.expanded = !this.expanded;
    //     if (this.expanded) {
    //         this.redrawGraph()
    //     } else {
    //         this.graphViewDirty = false;
    //         render(null, this.graphView);
    //     }
    // }

    // redrawGraph() {
    //     this.graphViewDirty = true;
    //     requestAnimationFrame(this._redrawLater.bind(this));
    // }

    // _onUrl(url) {
    //     if (this.sg) { this.sg.close(); }
    //     this.sg = new StreamedGraphClient(
    //         url,
    //         this.onGraphChanged.bind(this),
    //         this.set.bind(this, 'status'),
    //         [],//window.NS,
    //         []
    //     );
    // }

    // onGraphChanged() {
    //     this.graph = { 
    //         version: this.graph.version + 1, 
    //         store: this.sg.store
    //      };
    //     if (this.expanded) {
    //         this.redrawGraph();
    //     }
    // }

    // _redrawLater() {
    //     if (!this.graphViewDirty) return;
    //     render(new GraphView(this.url, this.graph.store).makeTemplate(), this.graphView);
    //     this.graphViewDirty = false;
    // }


}