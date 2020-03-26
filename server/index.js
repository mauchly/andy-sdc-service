const express = require('express');
const path = require('path');
const { Reviews } = require('../database/index');

let app = express();

app.use(express.static('public'));
app.use(express.text());
app.use(express.urlencoded());

app.get('/averageScore:id', (req, res) => {
  console.log(req);
  let listId = req.params.id;
  Reviews.find({id: listId}, (err, result) => {
    if (err) {
      console.log('error in averageScore', err);
      res.sendStatus(404);
    } else {
      if (result.length === 0) {
        return 0;
      }
      let finalScore = 0;
      let helperScore = 0;
      let reviews = result[0].reviews;
      let reviewNumber = reviews.length;
      // console.log('value of reviews', reviews.length);
      for (let i = 0; i < reviews.length; i++) {
        let scores = reviews[i].scores[0];
        // console.log(scores);

        helperScore += +scores.cleanliness;
        helperScore += +scores.communication;
        helperScore += +scores.checkin;
        helperScore += +scores.accuracy;
        helperScore += +scores.location;
        helperScore += +scores.value;

        finalScore += (helperScore / 6);
        helperScore = 0;
      }
      res.end(`${(finalScore / reviews.length).toFixed(2).toString()}, (${reviewNumber} reviews)`);
    }
  })
})

app.get('/listing', (req, res) => {
  console.log('listing', req.query.data);
  let listId = req.query.data || 10001;
  let reg = /\d{5}/;
  let result = reg.test(listId);
  if (!result) {

    let data = ["Super_Cute_Retro_Airstream", "Redundant_Driver_Strategic_house", "Multibyte_Program_Opensource_house", "Neural_Transmitter_Magnetic_house", "Haptic_Bandwidth_Leadingedge_house", "Primary_Harddrive_Killer_house", "Solidstate_Harddrive_Crossplatform_house", "Optical_Bandwidth_Robust_house", "Solidstate_Interface_Crossmedia_house", "Bluetooth_Port_Opensource_house", "Neural_Program_Bricksandclicks_house", "Online_Matrix_Usercentric_house", "Virtual_Transmitter_Interactive_house", "Virtual_System_Cuttingedge_house", "Bluetooth_Application_Robust_house", "Primary_Harddrive_B2C_house", "Haptic_Port_Transparent_house", "Haptic_Bus_Sexy_house", "Auxiliary_Feed_Cuttingedge_house", "Optical_Firewall_Clicksandmortar_house", "Auxiliary_Feed_Impactful_house", "Neural_Circuit_Outofthebox_house", "Bluetooth_Port_Compelling_house", "Bluetooth_Transmitter_Granular_house", "Optical_Bandwidth_Efficient_house", "Haptic_Port_Onetoone_house", "Online_Program_Intuitive_house", "Haptic_Protocol_Frontend_house", "Solidstate_Port_Valueadded_house", "Multibyte_Bandwidth_Proactive_house", "Opensource_Driver_Granular_house", "Wireless_Panel_Realtime_house", "Mobile_Port_Innovative_house", "Neural_Alarm_Bricksandclicks_house", "Digital_Feed_Revolutionary_house", "Auxiliary_System_Innovative_house", "1080p_Circuit_Scalable_house", "Auxiliary_Alarm_Onetoone_house", "Haptic_System_Worldclass_house", "1080p_Microchip_Ubiquitous_house", "Multibyte_System_Interactive_house", "Haptic_Firewall_Ebusiness_house", "Virtual_Feed_Proactive_house", "1080p_Bus_Viral_house", "Wireless_Matrix_Frictionless_house", "Bluetooth_Application_Revolutionary_house", "1080p_Application_Bricksandclicks_house", "Backend_Bus_24/365_house", "Mobile_Alarm_Granular_house", "Backend_Alarm_Bestofbreed_house", "Wireless_Panel_Clicksandmortar_house", "Crossplatform_Harddrive_Wireless_house", "Solidstate_Alarm_Robust_house", "Neural_Application_Intuitive_house", "Multibyte_Interface_Interactive_house", "Backend_System_Rich_house", "Backend_Feed_Usercentric_house", "Bluetooth_System_Realtime_house", "Multibyte_Alarm_24/7_house", "Mobile_Alarm_Dotcom_house", "Multibyte_Sensor_Opensource_house", "Auxiliary_Sensor_Endtoend_house", "Solidstate_Card_Cuttingedge_house", "Wireless_Interface_Interactive_house", "Auxiliary_Panel_Vertical_house", "Multibyte_Program_Wireless_house", "Crossplatform_Microchip_Synergistic_house", "Bluetooth_Matrix_Magnetic_house", "Mobile_Sensor_Missioncritical_house", "Virtual_Port_Bleedingedge_house", "Auxiliary_Bus_Bestofbreed_house", "Haptic_Alarm_B2B_house", "1080p_Array_Plugandplay_house", "Optical_Microchip_Revolutionary_house", "Digital_Card_B2C_house", "Bluetooth_Microchip_Webenabled_house", "1080p_Matrix_Impactful_house", "Neural_Feed_Enterprise_house", "Crossplatform_Matrix_Visionary_house", "Optical_Card_Proactive_house", "Redundant_Alarm_Plugandplay_house", "Redundant_Alarm_Seamless_house", "Wireless_Application_Endtoend_house", "Virtual_Panel_Scalable_house", "1080p_System_Visionary_house", "Solidstate_Bandwidth_Nextgeneration_house", "Crossplatform_System_Endtoend_house", "Wireless_Driver_Rich_house", "Backend_Matrix_Robust_house", "Opensource_Bandwidth_B2B_house", "Mobile_Pixel_Proactive_house", "Backend_Harddrive_Frictionless_house", "Auxiliary_Array_Ubiquitous_house", "Mobile_Pixel_Frictionless_house", "Online_Transmitter_Dotcom_house", "Bluetooth_Sensor_Revolutionary_house", "Crossplatform_Protocol_Granular_house", "Primary_Matrix_Realtime_house", "Crossplatform_Port_Wireless_house", "Online_Bus_Integrated_house"];

    if (data.indexOf(listId) !== -1) {
      listId = data.indexOf(listId) + 10001;
    }
  }
    Reviews.find({id: listId}, (err, result) => {
      if (err) {
        console.log('error in Reviews.find', err);
        res.sendStatus(404);
      } else {
        res.send(result);
      }
    })
});

app.get('/:id', (req, res) => {
  console.log('send file');
  res.sendFile(path.join(__dirname, '../public', '/index.html'));
});

app.listen(3004, () => {
  console.log('Express server for REVIEWS listening on port 3004');
});

module.exports = app;
