import { SuffixLabels } from './suffixLabels';

describe("_tailSegments", () => {
  it("returns right amount", () => {
    expect(SuffixLabels._tailSegments('http://foo/a/bb', 0)).toEqual('');
    expect(SuffixLabels._tailSegments('http://foo/a/bb', 1)).toEqual('bb');
    expect(SuffixLabels._tailSegments('http://foo/a/bb', 2)).toEqual('a/bb');
    expect(SuffixLabels._tailSegments('http://foo/a/bb', 3)).toEqual('foo/a/bb');
    expect(SuffixLabels._tailSegments('http://foo/a/bb', 4)).toEqual('/foo/a/bb');
    expect(SuffixLabels._tailSegments('http://foo/a/bb', 5)).toEqual('http://foo/a/bb');
  });
  it("ok with trailing slash", () => {
    expect(SuffixLabels._tailSegments('http://foo/', 0)).toEqual('');
    expect(SuffixLabels._tailSegments('http://foo/', 1)).toEqual('');
    expect(SuffixLabels._tailSegments('http://foo/', 2)).toEqual('foo/');
  });
});

describe("suffixLabels", () => {
  const fakeNode = (uri: string) => { return { nominalValue: uri } };

  it("returns whole url segments", () => {
    const suf = new SuffixLabels();
    suf._planDisplayForUri('http://a/b/c/dd');
    suf._planDisplayForUri('http://a/b/c/ee');

    expect(suf.getLabelForNode('http://a/b/c/dd')).toEqual('dd');
    expect(suf.getLabelForNode('http://a/b/c/ee')).toEqual('ee');
  });

  it("doesn't treat a repeated uri as a name clash", () => {
    const suf = new SuffixLabels();
    suf._planDisplayForUri('http://a/b/c');
    suf._planDisplayForUri('http://a/b/c');

    expect(suf.getLabelForNode('http://a/b/c')).toEqual('c');
  });

  it("moves to two segments when needed", () => {
    const suf = new SuffixLabels();
    suf._planDisplayForUri('http://a/b/c/d');
    suf._planDisplayForUri('http://a/b/f/d');

    expect(suf.getLabelForNode('http://a/b/c/d')).toEqual('c/d');
    expect(suf.getLabelForNode('http://a/b/f/d')).toEqual('f/d');
  });

  it("is ok with clashes at different segment positions", () => {
    const suf = new SuffixLabels();
    suf._planDisplayForUri('http://z/z/z/a/b/c');
    suf._planDisplayForUri('http://a/b/c');

    expect(suf.getLabelForNode('http://z/z/z/a/b/c')).toEqual('z/a/b/c');
    expect(suf.getLabelForNode('http://a/b/c')).toEqual('/a/b/c');
  });

  it("uses appropriately long suffixes per uri", () => {
    const suf = new SuffixLabels();
    suf._planDisplayForUri('http://a/b/c/d/e');
    suf._planDisplayForUri('http://a/b/f/d/e');
    suf._planDisplayForUri('http://a/b/c/g');
    suf._planDisplayForUri('http://a/z');

    expect(suf.getLabelForNode('http://a/b/c/d/e')).toEqual('c/d/e');
    expect(suf.getLabelForNode('http://a/b/f/d/e')).toEqual('f/d/e');
    expect(suf.getLabelForNode('http://a/b/c/g')).toEqual('g');
    expect(suf.getLabelForNode('http://a/z')).toEqual('z');
  });

});