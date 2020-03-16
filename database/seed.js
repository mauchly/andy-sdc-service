const faker = require('faker');
const { Reviews } = require('./index.js');

//TODO: Both rand functions are not optimized and may not be completely random
let randYear = () => {
  let years = [2015, 2016, 2017, 2018, 2019, 2020];
  let rand = Math.floor(Math.random() * Math.floor(6));
  return years[rand];
}

let floatNum = () => {
  let rand1 = Math.floor(Math.random() * Math.floor(5));
  let rand2 = Math.floor(Math.random() * Math.floor(9));
  let result = rand1 + '.' + rand2;
  return +result;
}

let sampleData = [];
let idIndex = 10001;
let names = ["Super_Cute_Retro_Airstream", "Redundant_Driver_Strategic_house", "Multibyte_Program_Opensource_house", "Neural_Transmitter_Magnetic_house", "Haptic_Bandwidth_Leadingedge_house", "Primary_Harddrive_Killer_house", "Solidstate_Harddrive_Crossplatform_house", "Optical_Bandwidth_Robust_house", "Solidstate_Interface_Crossmedia_house", "Bluetooth_Port_Opensource_house", "Neural_Program_Bricksandclicks_house", "Online_Matrix_Usercentric_house", "Virtual_Transmitter_Interactive_house", "Virtual_System_Cuttingedge_house", "Bluetooth_Application_Robust_house", "Primary_Harddrive_B2C_house", "Haptic_Port_Transparent_house", "Haptic_Bus_Sexy_house", "Auxiliary_Feed_Cuttingedge_house", "Optical_Firewall_Clicksandmortar_house", "Auxiliary_Feed_Impactful_house", "Neural_Circuit_Outofthebox_house", "Bluetooth_Port_Compelling_house", "Bluetooth_Transmitter_Granular_house", "Optical_Bandwidth_Efficient_house", "Haptic_Port_Onetoone_house", "Online_Program_Intuitive_house", "Haptic_Protocol_Frontend_house", "Solidstate_Port_Valueadded_house", "Multibyte_Bandwidth_Proactive_house", "Opensource_Driver_Granular_house", "Wireless_Panel_Realtime_house", "Mobile_Port_Innovative_house", "Neural_Alarm_Bricksandclicks_house", "Digital_Feed_Revolutionary_house", "Auxiliary_System_Innovative_house", "1080p_Circuit_Scalable_house", "Auxiliary_Alarm_Onetoone_house", "Haptic_System_Worldclass_house", "1080p_Microchip_Ubiquitous_house", "Multibyte_System_Interactive_house", "Haptic_Firewall_Ebusiness_house", "Virtual_Feed_Proactive_house", "1080p_Bus_Viral_house", "Wireless_Matrix_Frictionless_house", "Bluetooth_Application_Revolutionary_house", "1080p_Application_Bricksandclicks_house", "Backend_Bus_24/365_house", "Mobile_Alarm_Granular_house", "Backend_Alarm_Bestofbreed_house", "Wireless_Panel_Clicksandmortar_house", "Crossplatform_Harddrive_Wireless_house", "Solidstate_Alarm_Robust_house", "Neural_Application_Intuitive_house", "Multibyte_Interface_Interactive_house", "Backend_System_Rich_house", "Backend_Feed_Usercentric_house", "Bluetooth_System_Realtime_house", "Multibyte_Alarm_24/7_house", "Mobile_Alarm_Dotcom_house", "Multibyte_Sensor_Opensource_house", "Auxiliary_Sensor_Endtoend_house", "Solidstate_Card_Cuttingedge_house", "Wireless_Interface_Interactive_house", "Auxiliary_Panel_Vertical_house", "Multibyte_Program_Wireless_house", "Crossplatform_Microchip_Synergistic_house", "Bluetooth_Matrix_Magnetic_house", "Mobile_Sensor_Missioncritical_house", "Virtual_Port_Bleedingedge_house", "Auxiliary_Bus_Bestofbreed_house", "Haptic_Alarm_B2B_house", "1080p_Array_Plugandplay_house", "Optical_Microchip_Revolutionary_house", "Digital_Card_B2C_house", "Bluetooth_Microchip_Webenabled_house", "1080p_Matrix_Impactful_house", "Neural_Feed_Enterprise_house", "Crossplatform_Matrix_Visionary_house", "Optical_Card_Proactive_house", "Redundant_Alarm_Plugandplay_house", "Redundant_Alarm_Seamless_house", "Wireless_Application_Endtoend_house", "Virtual_Panel_Scalable_house", "1080p_System_Visionary_house", "Solidstate_Bandwidth_Nextgeneration_house", "Crossplatform_System_Endtoend_house", "Wireless_Driver_Rich_house", "Backend_Matrix_Robust_house", "Opensource_Bandwidth_B2B_house", "Mobile_Pixel_Proactive_house", "Backend_Harddrive_Frictionless_house", "Auxiliary_Array_Ubiquitous_house", "Mobile_Pixel_Frictionless_house", "Online_Transmitter_Dotcom_house", "Bluetooth_Sensor_Revolutionary_house", "Crossplatform_Protocol_Granular_house", "Primary_Matrix_Realtime_house", "Crossplatform_Port_Wireless_house", "Online_Bus_Integrated_house"];
let nameIndex = 0;

while (nameIndex < 100) {
  //create reviews first
  let allReviews = [];
  let reviewNum = Math.floor(Math.random() * Math.floor(20));
  while (reviewNum > 0) {
    allReviews.push({
        username: faker.name.findName(),
        date: faker.date.month() + ' ' + randYear(),
        text: faker.lorem.paragraph(),
        avatar: faker.image.avatar(),
        scores: [
          {
            cleanliness: floatNum(),
            communication: floatNum(),
            checkin: floatNum(),
            accuracy: floatNum(),
            location: floatNum(),
            value: floatNum()
          }
        ]
      });
    reviewNum--;
  }

  //push to dataset
  sampleData.push(
    {
      id: idIndex,
      name: names[nameIndex],
      reviews: allReviews
    }
  )
  idIndex++;
  nameIndex++;
}

//Clears DB and adds new data to DB
Reviews.deleteMany({id: {$gt: 1}}, (err) => {
  if (err) {
    console.log('Error in DB clear');
  } else {
    console.log('DB cleared');
    Reviews.insertMany(sampleData, (err, result) => {
      if (err) {
        console.log('Error in sample data insert');
      } else {
        console.log('Successful sample data insert');
      }
    })
  }
});

//TODO: Is there a way to conclude a file running to give control back to command line?