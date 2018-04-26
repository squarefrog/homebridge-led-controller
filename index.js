var Service, Characteristic;
var request = require('request');

/**
 * @module homebridge
 * @param {object} homebridge Export functions required to create a
 *                            new instance of this plugin.
 */
module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-led-controller", "led-controller", LEDAccessory);
};

/**
 * Parse the config and instantiate the object.
 *
 * @summary Constructor
 * @constructor
 * @param {function} log Logging function
 * @param {object} config Your configuration object
 */
function LEDAccessory(log, config) {
  this.log = log;

  // Required values
  this.name = config['name'];
  this.host = config['host'];
  this.verifyConfig();
  this.baseURL = 'http://' + this.host + '/';

  // Optional values
  this.manufacturer = config['manufacturer'] || 'Espressif';
  this.model = config['model'] || 'ESP8266';
  this.serial = config['serial'] || 'Default-SerialNumber';
}

/**
* @augments LEDAccessory
*/
LEDAccessory.prototype = {

  /****************************************************************************
   * Required functions
   ***************************************************************************/

  identify: function (callback) {
    this.log("Identify requested!");
    callback();
  },

  /**
   * Return a list of services supported by the accessory
   */
  getServices: function () {
    let informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
      .setCharacteristic(Characteristic.Model, this.model)
      .setCharacteristic(Characteristic.SerialNumber, this.serial);

    let service = new Service.Lightbulb(this.name);
    service
      .getCharacteristic(Characteristic.On)
      .on('get', (callback) => { this.getValue('on', callback) })
      .on('set', (value, callback) => { this.setValue(value, 'on', callback) });

    service
      .addCharacteristic(new Characteristic.Hue())
      .on('get', (callback) => { this.getValue('hue', callback) })
      .on('set', (value, callback) => { this.setValue(value, 'hue', callback) });

    service
      .addCharacteristic(new Characteristic.Saturation())
      .on('get', (callback) => { this.getValue('saturation', callback) })
      .on('set', (value, callback) => { this.setValue(value, 'saturation', callback) });

    service
      .addCharacteristic(new Characteristic.Brightness())
      .on('get', (callback) => { this.getValue('brightness', callback) })
      .on('set', (value, callback) => { this.setValue(value, 'brightness', callback) });

    return [informationService, service];
  },

  /****************************************************************************
   * Custom functions
   ***************************************************************************/

  /**
   * Ensure required values exist in config
   */
  verifyConfig: function () {
    if (!this.host || !this.name) {
      this.log.error('Host or name missing in config.json!');
    }
  },

  /**
   * Get a value from the ESP host
   * @param {string} path The endpoint path
   * @param {function} callback The callback that handles the response
   */
  getValue: function (path, callback) {
    var that = this;
    var url = this.baseURL + path;
    request.get({ url: url }, function (error, response, body) {
      if (error) {
        that.log('STATUS: ' + response.statusCode);
        that.log(error.message);
        return callback(error);
      }
      var json = JSON.parse(body);
      return callback(null, json['value']);
    });
  },

  /**
   * Set a value on the ESP host
   * @param {number} value The value to set
   * @param {string} path The endpoint path
   * @param {function} callback The callback that handles the response
   */
  setValue: function (value, path, callback) {
    var that = this;
    var url = this.baseURL + path;
    var options = {
      url: url,
      qs: { v: value }
    };
    request.post(options, function (error, response) {
      if (error) {
        that.log('STATUS: ' + response.statusCode);
        that.log(error.message);
        return callback(error);
      }
      return callback();
    });
  }

};

