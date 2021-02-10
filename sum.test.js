

const sum = require('./sum');

describe('Adding 1 with 2 should give you 3',()=>{
    expect(sum(1,2).toBe(3));
});