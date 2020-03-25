const { score, totalReviews } = require('../client/helperFunc');

test('expect totalReviews to return a length', () => {
  expect(totalReviews([{reviews: [1, 2, 3]}])).toBe(3);
});