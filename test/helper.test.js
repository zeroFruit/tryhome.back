import expect from 'expect';
import { isObjectKeyExist } from '../helpers/helper';

describe('helper', () => {
  it('is isObjectKeyExist() success test', () => {
    let obj = {a: 1, b: 2};
    let mask = ['a', 'b'];

    expect(isObjectKeyExist(obj, mask)).toBe(true);
  });

  it('is isObjectKeyExist() fail test', () => {
    let obj = {a: 1, b: 2, c: 3};
    let mask = ['a', 'c', 'b', 'd', 'e'];

    expect(isObjectKeyExist(obj, mask)).toBe(false);
  })
})
