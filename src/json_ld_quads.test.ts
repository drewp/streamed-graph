import { eachJsonLdQuad } from './json_ld_quads';
import { Literal, DataFactory } from 'n3';
const { literal } = DataFactory;

describe("eachJsonLdQuad", () => {
    test("finds multiple graphs", () => {
    });
    test("returns quads", async () => {
        let results: Array<any> = [];
        await eachJsonLdQuad([
            {
                "@id": "http://example.com/g1",
                "@graph": [{
                    "@id": "http://example.com/s1",
                    "http://example.com/p1": [{ "@value": "lit1" }]
                }],
            }
        ], (res: any) => results.push(res));
        expect(results).toHaveLength(1);
        expect(results[0].subject.value).toEqual("http://example.com/s1");
        expect(results[0].predicate.value).toEqual("http://example.com/p1");
        expect((results[0].object as Literal).equals(literal("lit1"))).toBeTruthy();
        expect(results[0].graph.value).toEqual("http://example.com/g1");

    });
});