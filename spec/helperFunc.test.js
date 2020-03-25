const { score, totalReviews, border, attrScore } = require('../client/helperFunc');

let testData = [{"_id":"5e743a096e546950b0b058c0","id":10019,"name":"Auxiliary_Feed_Cuttingedge_house","reviews":[{"scores":[{"_id":"5e743a096e546950b0b058c2","cleanliness":2.1,"communication":4.4,"checkin":0.1,"accuracy":1.2,"location":0,"value":4.1}],"_id":"5e743a096e546950b0b058c1","username":"Deshawn Barrows","date":"July 2017","text":"Quasi aperiam qui eos consequatur. Et qui modi officia architecto. Ea numquam quia minima adipisci ratione illo et quidem. Facere provident consequatur. Molestiae velit voluptate et sit. Repellendus suscipit et earum id explicabo animi sapiente.","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/gauchomatt/128.jpg"},{"scores":[{"_id":"5e743a096e546950b0b058c4","cleanliness":1.6,"communication":2.1,"checkin":2.4,"accuracy":3.7,"location":0.8,"value":4.5}],"_id":"5e743a096e546950b0b058c3","username":"Kole Pouros","date":"April 2017","text":"Magnam assumenda ab quia. Deleniti error qui voluptatem quia. Ut dignissimos doloribus aliquam ullam incidunt omnis doloremque quia. Sunt est alias ut non omnis laudantium quisquam. Voluptas voluptate esse rerum. Aut ut tempora placeat aut numquam qui consequatur id adipisci.","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/okcoker/128.jpg"},{"scores":[{"_id":"5e743a096e546950b0b058c6","cleanliness":4.1,"communication":2.6,"checkin":1,"accuracy":0.6,"location":0.3,"value":4}],"_id":"5e743a096e546950b0b058c5","username":"Otto Hauck II","date":"September 2015","text":"Minus ullam in. Doloremque eum voluptas illo a necessitatibus temporibus exercitationem quia eum. Exercitationem cum magnam aspernatur illo pariatur aut cupiditate aperiam sed. Quo aliquam odit. Modi at veritatis officiis nesciunt voluptatem dolore dolor qui et. Rerum et et ipsam sint provident architecto nesciunt laborum.","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/nomidesigns/128.jpg"},{"scores":[{"_id":"5e743a096e546950b0b058c8","cleanliness":3.7,"communication":1.8,"checkin":3.6,"accuracy":2.3,"location":2.5,"value":3.7}],"_id":"5e743a096e546950b0b058c7","username":"Dr. Pansy McLaughlin","date":"July 2019","text":"Porro doloremque minus dolor numquam harum illum. Eos natus voluptatem minus velit quo assumenda distinctio. Qui corrupti tenetur.","avatar":"https://s3.amazonaws.com/uifaces/faces/twitter/timmillwood/128.jpg"}],"__v":0}];

describe('Score module: totalReviews function', () => {

  test('expect totalReviews to return a length', () => {
    expect(totalReviews([{reviews: [1, 2, 3]}])).toBe(3);
  });

  test('expect totalReviews to return a length of 0 if no reviews', () => {
    expect(totalReviews([{reviews: []}])).toBe(0);
  });

})

describe('Score module: score function', () => {

  test('expect score to return a length of 0 if no reviews', () => {
    expect(score([])).toBe(0);
  });

  test('expect score to return a number between 0 and 5', () => {
    expect(score(testData)).toBeGreaterThan(0);
    expect(score(testData)).toBeLessThan(5);
  });

  test('expect score to return a floating point score of 2.38', () => {
    expect(score(testData)).toBeCloseTo(2.38);
    expect(score(testData).toFixed(2)).toBe("2.38");
  });

});


describe('Ratings module: border function', () => {

  test('expect border to return an object with specific values', () => {
    expect(border(testData, 'value')).toStrictEqual(
      expect.objectContaining({
          'borderBottom': 'solid',
          'borderBottomWidth': '50%',
          'position': 'relative',
          'bottom': '10px',
          'left': '45px',
          'right': '105px',
          'paddingLeft': expect.any(String),
          'color': 'black'
      })
    );
  });

  test('expect border to return calculated paddingLeft', () => {
    expect((border(testData, 'value').paddingLeft)).toMatch(/\d+px$/);
  });

});

describe('Ratings module: attrScore function', () => {

  test('expect attrScore to return a length of 0 if no reviews', () => {
    expect(attrScore([])).toBe(0);
  });

  test('expect attrScore to return a number between 0 and 5', () => {
    expect(attrScore(testData, 'cleanliness')).toBeGreaterThan(0);
    expect(attrScore(testData, 'checkin')).toBeLessThan(5);
  });

  test('expect attrScore to return a floating point score of 2.7', () => {
    expect(attrScore(testData, 'communication')).toBeCloseTo(2.72);
    expect(attrScore(testData, 'communication').toFixed(1)).toBe("2.7");
  });

});
