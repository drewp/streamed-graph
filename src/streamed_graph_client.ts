// from /my/site/homepage/www/rdf/streamed-graph.js

import * as async from "async";
import * as jsonld from "jsonld";

//import eachJsonLdQuad from "./json_ld_quads";
import { Store, DataFactory } from "n3"

/// <reference types="eventsource" />
const EventSource = window.EventSource;

export class StreamedGraphClient {
    // onStatus: (msg: string) => void;
    // onGraphChanged: () => void;
    // store: Store;
    // events: EventSource;
    constructor(
        eventsUrl: string,
        onGraphChanged: () => void,
        onStatus: (status: string) => void,
        prefixes: Array<Record<string, string>>,
        staticGraphUrls: Array<string>) {
        console.log('new StreamedGraph', eventsUrl);
        // holds a rdfstore.js store, which is synced to a server-side
    //     // store that sends patches over SSE
    //     this.onStatus = onStatus;
    //     this.onGraphChanged = onGraphChanged;
    //     this.onStatus('startup...');

    //     this.store = new Store({});

    //     //             Object.keys(prefixes).forEach((prefix) => {
    //     //                 this.store.setPrefix(prefix, prefixes[prefix]);
    //     //             });

    //     this.connect(eventsUrl);
    //     this.reconnectOnWake();

    //     staticGraphUrls.forEach((url) => {
    //         fetch(url).then((response) => response.text())
    //             .then((body) => {
    //                 // parse with n3, add to output
    //             });
    //     });

    }

    // reconnectOnWake() {
    //     // it's not this, which fires on every mouse-in on a browser window, and doesn't seem to work for screen-turned-back-on
    //     //window.addEventListener('focus', function() { this.connect(eventsUrl); }.bind(this));

    // }

    // connect(eventsUrl: string) {
    //     // need to exit here if this obj has been replaced

    //     this.onStatus('start connect...');
    //     this.close();
    //     if (this.events && this.events.readyState != EventSource.CLOSED) {
    //         this.onStatus('zombie');
    //         throw new Error("zombie eventsource");
    //     }


    //     this.events = new EventSource(eventsUrl);

    //     this.events.addEventListener('error', (ev) => {
    //         // todo: this is piling up tons of retries and eventually multiple connections
    //         this.testEventUrl(eventsUrl);
    //         this.onStatus('connection lost- retrying');
    //         setTimeout(() => {
    //             requestAnimationFrame(() => {
    //                 this.connect(eventsUrl);
    //             });
    //         }, 3000);
    //     });

    //     this.events.addEventListener('fullGraph', (ev) => {
    //         // this.updates.push({ type: 'fullGraph', data: ev.data });
    //         // this.flushUpdates();
    //     });

    //     this.events.addEventListener('patch', (ev) => {
    //         // this.updates.push({ type: 'patch', data: ev.data });
    //         // this.flushUpdates();
    //     });
    //     this.onStatus('connecting...');
    // }

    // replaceFullGraph(jsonLdText: string, done: () => void) {
    //     // this.quadStore.clear();
    //     // eachJsonLdQuad(this.store.rdf, JSON.parse(jsonLdText),
    //     //     this.quadStore.add.bind(this.quadStore), function () {
    //     //         done();
    //     //     });
    //     // or this.store.insert([quad], quad.graph, function() {});
    // }


    // patchGraph(patchJson: string, done: () => void) {
    //     var patch = JSON.parse(patchJson).patch;

    //     // if (!this.store) {
    //     //     throw new Error('store ' + this.store);
    //     // }

    //     async.series([
    //         // (done) => {
    //         //     eachJsonLdQuad(this.store.rdf, patch.deletes,
    //         //         this.quadStore.remove.bind(this.quadStore), done);
    //         // },
    //         (done) => {
    //             // eachJsonLdQuad(this.store.rdf, patch.adds,
    //             //     this.quadStore.add.bind(this.quadStore), done);
    //         },
    //         /* seriesDone */ (done) => {
    //             done();
    //         }
    //     ], done);
    // }
    // close() {
    //     if (this.events) {
    //         this.events.close();
    //     }
    // }

    // testEventUrl(eventsUrl: string): Promise<void> {
    //     return new Promise<void>((resolve, reject) => {
    //         this.onStatus('testing connection');
    //         fetch(eventsUrl, {
    //             method: "HEAD",
    //             credentials: "include",
    //         }).then((value) => {
    //             if (value.status == 403) {
    //                 reject();
    //                 return;
    //             }
    //             resolve();
    //         }).catch((err) => {
    //             reject();
    //         });
    //     });
    // }

    // flushOneUpdate(update: Update, done: () => void) {
    //     if (update.type == 'fullGraph') {
    //         this.onStatus('sync- full graph update');
    //         let onReplaced = () => {
    //             this.onStatus('synced');
    //             this.onGraphChanged();
    //             done();
    //         };
    //         this.replaceFullGraph(update.data, onReplaced);
    //     } else if (update.type == 'patch') {
    //         this.onStatus('sync- updating');
    //         let onPatched = () => {
    //             this.onStatus('synced');
    //             this.onGraphChanged();
    //             done();
    //         };
    //         this.patchGraph(update.data, onPatched);
    //     } else {
    //         this.onStatus('sync- unknown update');
    //         throw new Error(update.type);
    //     }
    // }

}