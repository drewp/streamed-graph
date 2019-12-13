// import {describe, test, expect} from 'jest';
// import { SuffixLabels } from './suffixLabels';

// describe('_tailSegments', () => {
//   test("returns right amount", () => {
//     expect(SuffixLabels._tailSegments('http://foo/a/bb', 0)).toEqual('');
//     //   t.is(SuffixLabels._tailSegments('http://foo/a/bb', 1), 'bb');
//     //   t.is(SuffixLabels._tailSegments('http://foo/a/bb', 2), 'a/bb');
//     //   t.is(SuffixLabels._tailSegments('http://foo/a/bb', 3), 'foo/a/bb');
//     //   t.is(SuffixLabels._tailSegments('http://foo/a/bb', 4), '/foo/a/bb');
//     //   t.is(SuffixLabels._tailSegments('http://foo/a/bb', 5), 'http://foo/a/bb');
//   });
//   // test("_tailSegments ok with trailing slash", (t) => {
//   //   t.is(SuffixLabels._tailSegments('http://foo/', 0), '');
//   //   t.is(SuffixLabels._tailSegments('http://foo/', 1), '');
//   //   t.is(SuffixLabels._tailSegments('http://foo/', 2), 'foo/');
// });


// describe("suffixLabels", () => {
//   const fakeNode = (uri: string) => { return { nominalValue: uri } };

//   it("returns whole url segments", () => {
//     const suf = new SuffixLabels();
//     suf._planDisplayForUri('http://a/b/c/dd');
//     suf._planDisplayForUri('http://a/b/c/ee');

//     t.is(suf.getLabelForNode('http://a/b/c/dd'), 'dd');
//     t.is(suf.getLabelForNode('http://a/b/c/ee'), 'ee');
//   });

//   it("doesn't treat a repeated uri as a name clash", () => {
//     const suf = new SuffixLabels();
//     suf._planDisplayForUri('http://a/b/c');
//     suf._planDisplayForUri('http://a/b/c');

//     t.is(suf.getLabelForNode('http://a/b/c'), 'c');
//   });

//   it("moves to two segments when needed", () => {
//     const suf = new SuffixLabels();
//     suf._planDisplayForUri('http://a/b/c/d');
//     suf._planDisplayForUri('http://a/b/f/d');

//     t.is(suf.getLabelForNode('http://a/b/c/d'), 'c/d');
//     t.is(suf.getLabelForNode('http://a/b/f/d'), 'f/d');
//   });

//   it("is ok with clashes at different segment positions", () => {
//     const suf = new SuffixLabels();
//     suf._planDisplayForUri('http://z/z/z/a/b/c');
//     suf._planDisplayForUri('http://a/b/c');

//     t.is(suf.getLabelForNode('http://z/z/z/a/b/c'), 'z/a/b/c');
//     t.is(suf.getLabelForNode('http://a/b/c'), '/a/b/c');
//   });

//   it("uses appropriately long suffixes per uri", () => {
//     const suf = new SuffixLabels();
//     suf._planDisplayForUri('http://a/b/c/d/e');
//     suf._planDisplayForUri('http://a/b/f/d/e');
//     suf._planDisplayForUri('http://a/b/c/g');
//     suf._planDisplayForUri('http://a/z');

//     t.is(suf.getLabelForNode('http://a/b/c/d/e'), 'c/d/e');
//     t.is(suf.getLabelForNode('http://a/b/f/d/e'), 'f/d/e');
//     t.is(suf.getLabelForNode('http://a/b/c/g'), 'g');
//     t.is(suf.getLabelForNode('http://a/z'), 'z');
//   });

// });