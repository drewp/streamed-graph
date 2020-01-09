import { customElement, property, computed } from "@polymer/decorators";
import { N3Store } from "n3";
import { PolymerElement, html } from "@polymer/polymer";
import { render } from "lit-html";

import { GraphView } from "./graph_view";
import { StreamedGraphClient } from "./streamed_graph_client";

import style from "./style.styl";

export interface VersionedGraph {
  version: number;
  store: N3Store | undefined;
}

function templateWithStyle(style: string, tmpl: HTMLTemplateElement) {
  const styleEl = document.createElement("style");
  styleEl.textContent = style;
  tmpl.content.insertBefore(styleEl, tmpl.content.firstChild);
  return tmpl;
}

@customElement("streamed-graph")
export class StreamedGraph extends PolymerElement {
  @property({ type: String })
  url: string = "";

  @property({ type: Object, notify: true })
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
  graphViewEl!: Element;
  graphViewDirty = true;

  static get template() {
    return templateWithStyle(
      style,
      html`
        <div id="ui">
          <span class="expander"
            ><button on-click="toggleExpand">{{expandAction}}</button></span
          >
          StreamedGraph <a href="{{url}}">[source]</a>: {{status}}
        </div>
        <div id="graphView"></div>
      `
    );
  }

  ready() {
    super.ready();
    this.graph = { version: -1, store: undefined };
    this.graphViewEl = (this.shadowRoot as ShadowRoot).getElementById(
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
      this._graphAreaClose();
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
      this._graphAreaShowGraph(new GraphView(this.url, this.graph.store));
      this.graphViewDirty = false;
    } else {
      this._graphAreaShowPending();
    }
  }

  _graphAreaClose() {
    render(null, this.graphViewEl);
  }

  _graphAreaShowPending() {
    render(
      html`
        <span>waiting for data...</span>
      `,
      this.graphViewEl
    );
  }

  _graphAreaShowGraph(graphView: GraphView) {
    render(graphView.makeTemplate(), this.graphViewEl);
  }
}
