const xapi = require('xapi');
var payload;

const MERAKI_KEY = ""; // Fill in Cisco Meraki Dashboard API key
const MERAKI_URL = "" // Fill in first part of the Meraki Dashboard URL (e.g. https://n60.meraki.com)
const SSID_NUMBER = "" // Fill in SSID number
const NETWORK_ID = "" // Fill in network ID
const SSID_NAME = "EDR-Meraki-Guest" // Fill in SSID name


function updateMerakiSSID(psk){
  payload = JSON.stringify(psk);
  console.log(payload);
  xapi.command('HttpClient Put', {
    Header: ["X-Cisco-Meraki-API-Key: " + MERAKI_KEY, "Content-Type: application/json"],
    Url: MERAKI_URL + "/api/v0/networks/" + NETWORK_ID + "/ssids/" + SSID_NUMBER,
    AllowInsecureHTTPS: 'True'
  }, payload).catch(e => console.log(JSON.stringify(e)))}

function guiEvent(event) {
  if (event.WidgetId === 'wifi') {
    if (event.Type === 'changed' && event.Value === 'on') {
      xapi.command('UserInterface Message TextInput Display', {
       FeedbackId: 'psk',
       Title: SSID_NAME,
       Text: 'Choose a password (min 8 characters)',
       Placeholder: 'Type password'
      });
    } else if (event.Type === 'changed' && event.Value === 'off') {
      var data =
      {
        'name': SSID_NAME,
        'enabled': false
      };
      updateMerakiSSID(data)
    }
  }
}

xapi.event.on('UserInterface Extensions Widget Action', guiEvent);

xapi.event.on('UserInterface Message TextInput Response', (event) => {
  if (event.FeedbackId === 'psk') {
    var data =
    {
      'name': SSID_NAME,
      'enabled': true,
      'psk': event.Text
    };

    updateMerakiSSID(data)
  }
});
