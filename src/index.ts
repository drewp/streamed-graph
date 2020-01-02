import { customElement, property, computed } from "@polymer/decorators";
import { N3Store } from "n3";
import { PolymerElement, html } from "@polymer/polymer";
import { render } from "lit-html";

import { GraphView } from "./graph_view";
import { StreamedGraphClient } from "./streamed_graph_client";

export interface VersionedGraph {
  version: number;
  store: N3Store | undefined;
}

@customElement("streamed-graph")
export class StreamedGraph extends PolymerElement {
  @property({ type: String })
  url: string = "";

  @property({ type: Object })
  graph!: VersionedGraph;

  @property({ type: Boolean })
  expanded: boolean = false;

  @computed("expanded")
  get expandAction() {
    return this.expanded ? "-" : "+";
  }

  @property({ type: String })
  status: string = "";

  sg!: StreamedGraphClient;
  graphView!: Element;
  graphViewDirty = true;

  static get template() {
    return html`
      <link rel="stylesheet" href="/rdf/streamed-graph.css" />
      <div id="ui">
        <span class="expander"
          ><button on-click="toggleExpand">{{expandAction}}</button></span
        >
        StreamedGraph <a href="{{url}}">[source]</a>: {{status}}
      </div>
      <div id="graphView"></div>
    `;
  }

  ready() {
    super.ready();
    this.graph = { version: -1, store: undefined };
    this.graphView = (this.shadowRoot as ShadowRoot).getElementById(
      "graphView"
    ) as Element;

    this._onUrl(this.url); // todo: watch for changes and rebuild
    if (this.expanded) {
      this.redrawGraph();
    }
  }

  toggleExpand() {
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.redrawGraph();
    } else {
      this.graphViewDirty = false;
      render(null, this.graphView);
    }
  }

  redrawGraph() {
    this.graphViewDirty = true;
    requestAnimationFrame(this._redrawLater.bind(this));
  }

  _onUrl(url: string) {
    if (this.sg) {
      this.sg.close();
    }
    this.sg = new StreamedGraphClient(
      url,
      this.onGraphChanged.bind(this),
      this.set.bind(this, "status"),
      [], //window.NS,
      []
    );
  }

  onGraphChanged() {
    this.graph = {
      version: this.graph.version + 1,
      store: this.sg.store
    };
    if (this.expanded) {
      this.redrawGraph();
    }
  }

  _redrawLater() {
    if (!this.graphViewDirty) return;

    if ((this.graph as VersionedGraph).store && this.graph.store) {
      render(
        new GraphView(this.url, this.graph.store).makeTemplate(),
        this.graphView
      );
      this.graphViewDirty = false;
    } else {
      render(
        html`
          <span>waiting for data...</span>
        `,
        this.graphView
      );
    }
  }
}
