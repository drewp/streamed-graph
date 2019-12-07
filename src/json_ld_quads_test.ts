import { eachJsonLdQuad } from './json_ld_quads';

describe("eachJsonLdQuad", () => {
    it("finds multiple graphs", () => {
    });
    it("returns quads", async () => {
        let results = [];
        await eachJsonLdQuad([
            {
                "@id": "http://example.com/g1",
                "@graph": [{
                    "@id": "http://example.com/s1",
                    "http://example.com/p1": [{ "@value": "lit1" }]
                }],
            }
        ], results.push);
        expect(results).toEqual('f')
    });
});