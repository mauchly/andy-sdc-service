//================================
// CONVERT MONGO DATA SYNTAX TO POSTGRES DATA SYNTAX
//================================

module.exports = (data) => {
  return [
    {
      id: data[0].listing_id,
      name: 'Default Name',
      reviews: data.map((review) => {
        return {
          scores: [
            {
              cleanliness: review.cleanliness,
              communication: review.communication,
              checkin: review.checkin,
              value: review.value,
              accuracy: review.accuracy,
              location: review.location,
            },
          ],
          username: review.username,
          date: review.date,
          text: review.text,
          avatar: review.avatar,
        };
      }),
    },
  ];
};

// REF**
//================================
// MONOGO DATA SYNTAX
//================================

// let mongoData = [
//   {
//     _id: '5eabb2b1048084519ce037ad',
//     id: 10011,
//     name: 'Neural_Program_Bricksandclicks_house',
//     reviews: [
//       {
//         scores: [
//           {
//             _id: '5eabb2b1048084519ce037af',
//             cleanliness: 3.3,
//             communication: 1,
//             checkin: 2.4,
//             accuracy: 3,
//             location: 2.4,
//             value: 3.4,
//           },
//         ],
//         _id: '5eabb2b1048084519ce037ae',
//         username: "Willie O'Kon",
//         date: 'August 2015',
//         text:
//           'Voluptatem blanditiis id quis magni ab dolorem perspiciatis fugit. Eos aliquam eos placeat sapiente praesentium consequuntur reiciendis. Ex velit alias enim vel reiciendis. Ex fugit aut dicta. Amet asperiores modi et assumenda. Est aperiam sed quia consequatur possimus aliquid.',
//         avatar:
//           'https://s3.amazonaws.com/uifaces/faces/twitter/rehatkathuria/128.jpg',
//       },
//     ],
//   },
// ];

//================================
// POSTGRES DATA SYNTAX
//================================

// let postgres = [
//   {
//     id: 1914753,
//     username: 'Kelsi46',
//     date: 'September 2017',
//     avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/picard102/128.jpg',
//     text: 'Quaerat et quisquam est qui iure iure quis cupiditate.',
//     listing_id: 765746,
//     communication: '2.1',
//     checkin: '3.3',
//     value: '4.1',
//     accuracy: '4.3',
//     location: '4.7',
//     cleanliness: '4.8',
//   },
// ];
