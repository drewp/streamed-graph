// from /my/site/homepage/www/rdf/streamed-graph.js

import { eachJsonLdQuad } from "./json_ld_quads";
import { N3Store } from "n3";
import { Store } from "n3";

export class StreamedGraphClient {
  // holds a n3 Store, which is synced to a server-side
  // store that sends patches over SSE

  onStatus: (msg: string) => void;
  onGraphChanged: () => void;
  store: N3Store;
  events!: EventSource;
  constructor(
    eventsUrl: string,
    onGraphChanged: () => void,
    onStatus: (status: string) => void,
    prefixes: Array<Record<string, string>>,
    staticGraphUrls: Array<string>
  ) {
    console.log("new StreamedGraph", eventsUrl);
    this.onStatus = onStatus;
    this.onGraphChanged = onGraphChanged;
    this.onStatus("startup...");

    this.store = new Store();

    //     //             Object.keys(prefixes).forEach((prefix) => {
    //     //                 this.store.setPrefix(prefix, prefixes[prefix]);
    //     //             });

    this.connect(eventsUrl);
    this.reconnectOnWake();

    //     staticGraphUrls.forEach((url) => {
    //         fetch(url).then((response) => response.text())
    //             .then((body) => {
    //                 // parse with n3, add to output
    //             });
    //     });
  }

  reconnectOnWake() {
    // it's not this, which fires on every mouse-in on a browser window, and doesn't seem to work for screen-turned-back-on
    //window.addEventListener('focus', function() { this.connect(eventsUrl); }.bind(this));
  }

  connect(eventsUrl: string) {
    // need to exit here if this obj has been replaced

    this.onStatus("start connect...");
    this.close();
    if (this.events && this.events.readyState != EventSource.CLOSED) {
      this.onStatus("zombie");
      throw new Error("zombie eventsource");
    }

    this.events = new EventSource(eventsUrl);

    this.events.addEventListener("error", ev => {
      // todo: this is piling up tons of retries and eventually multiple connections
      // this.testEventUrl(eventsUrl);
      this.onStatus("connection lost- retrying");
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.connect(eventsUrl);
        });
      }, 3000);
    });

    this.events.addEventListener("fullGraph", async ev => {
      this.onStatus("sync- full graph update");
      await this.replaceFullGraph((ev as MessageEvent).data);
      this.onStatus(`synced ${this.store.size}`);
      this.onGraphChanged();
    });

    this.events.addEventListener("patch", async ev => {
      this.onStatus("sync- updating");
      await this.patchGraph((ev as MessageEvent).data);
      this.onStatus(`synced ${this.store.size}`);
      this.onGraphChanged();
    });
    this.onStatus("connecting...");
  }

  // these need some locks
  async replaceFullGraph(jsonLdText: string) {
    this.store = new Store();
    await eachJsonLdQuad(
      JSON.parse(jsonLdText),
      this.store.addQuad.bind(this.store)
    );
  }

  async patchGraph(patchJson: string) {
    var patch = JSON.parse(patchJson).patch;

    await eachJsonLdQuad(patch.deletes, this.store.removeQuad.bind(this.store));
    await eachJsonLdQuad(patch.adds, this.store.addQuad.bind(this.store));
  }

  close() {
    if (this.events) {
      this.events.close();
    }
  }

  async testEventUrl(eventsUrl: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.onStatus("testing connection");
      fetch(eventsUrl, {
        method: "HEAD",
        credentials: "include"
      })
        .then(value => {
          if (value.status == 403) {
            reject();
            return;
          }
          resolve();
        })
        .catch(err => {
          reject();
        });
    });
  }
}
