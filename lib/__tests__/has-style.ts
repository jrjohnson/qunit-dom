/* eslint-env jest */

import TestAssertions from '../helpers/test-assertions';

describe('assert.dom(...).hasStyle()', () => {
  let assert: TestAssertions;

  beforeEach(() => {
    assert = new TestAssertions();
    document.body.innerHTML =
      '<div class="foo" style="opacity: 1; width: 200px; text-align: center;">quit-dom ftw!</div>';
  });

  test('succeeds for correct content', () => {
    assert.dom('.foo').hasStyle({
      opacity: '1',
      width: '200px',
      'text-align': 'center',
    });
    expect(assert.results).toEqual([
      {
        actual: { opacity: '1', width: '200px', 'text-align': 'center' },
        expected: { opacity: '1', width: '200px', 'text-align': 'center' },
        message: 'Element .foo has style "{"opacity":"1","width":"200px","text-align":"center"}"',
        result: true,
      },
    ]);
  });

  test('succeeds for checking styles applied by CSS stylesheets', () => {
    let styleNode = document.createElement('style');
    styleNode.innerHTML = '.foo { color: blue }';
    document.body.appendChild(styleNode);
    assert.dom('.foo').hasStyle({
      opacity: '1',
      width: '200px',
      'text-align': 'center',
      color: 'blue',
    });
    expect(assert.results).toEqual([
      {
        actual: { opacity: '1', width: '200px', 'text-align': 'center', color: 'blue' },
        expected: { opacity: '1', width: '200px', 'text-align': 'center', color: 'blue' },
        message:
          'Element .foo has style "{"opacity":"1","width":"200px","text-align":"center","color":"blue"}"',
        result: true,
      },
    ]);
    document.body.removeChild(styleNode);
  });

  test('succeeds for partial style checking', () => {
    assert.dom('.foo').hasStyle({
      opacity: '1',
    });
    expect(assert.results).toEqual([
      {
        actual: { opacity: '1' },
        expected: { opacity: '1' },
        message: 'Element .foo has style "{"opacity":"1"}"',
        result: true,
      },
    ]);
  });

  test('succeeds when actual precision is significantly higher than expected', () => {
    document.body.innerHTML ='<div style="opacity: .1000000000001;">quit-dom ftw!</div>';
    assert.dom('div').hasStyle({
      opacity: 0.1,
    });
    expect(assert.results).toEqual([
      {
        actual: { opacity: '0.1000000000001' },
        expected: { opacity: 0.1 },
        message: 'Element div has style "{"opacity":0.1}"',
        result: true,
      },
    ]);
  });

  test('fails for wrong content', () => {
    assert.dom('.foo').hasStyle({
      opacity: 0,
    });
    expect(assert.results).toEqual([
      {
        actual: { opacity: '1' },
        expected: { opacity: 0 },
        message: 'Element .foo has style "{"opacity":0}"',
        result: false,
      },
    ]);
  });

  test('fails for missing element', () => {
    assert.dom('#missing').hasStyle({
      opacity: 0,
    });
    expect(assert.results).toEqual([
      {
        message: 'Element #missing should exist',
        result: false,
      },
    ]);
  });

  test('throws for unexpected parameter types', () => {
    //@ts-ignore -- These assertions are for JavaScript users who don't have type checking
    expect(() => assert.dom(5).hasStyle({ opacity: 1 })).toThrow('Unexpected Parameter: 5');
    //@ts-ignore
    expect(() => assert.dom(true).hasStyle({ opacity: 1 })).toThrow('Unexpected Parameter: true');
    expect(() => assert.dom(undefined).hasStyle({ opacity: 1 })).toThrow(
      'Unexpected Parameter: undefined'
    );
    //@ts-ignore
    expect(() => assert.dom({}).hasStyle({ opacity: 1 })).toThrow(
      'Unexpected Parameter: [object Object]'
    );
    //@ts-ignore
    expect(() => assert.dom(document).hasStyle({ opacity: 1 })).toThrow(
      'Unexpected Parameter: [object Document]'
    );
  });

  test('throws for empty expectation object', () => {
    expect(() => assert.dom('div').hasStyle({})).toThrow(
      'Missing style expectations. There must be at least one style property in the passed in expectation object.'
    );
  });

  test('supports chaining', () => {
    document.body.innerHTML = '<h1 class="bar">foo</h1>';

    assert.dom('h1').hasStyle({ top: 42 }).hasStyle({ left: 0 });

    expect(assert.results.length).toEqual(2);
  });
});
