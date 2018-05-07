# Homebridge LED Controller

An LED light strip accessory for the [Homebridge](https://github.com/nfarina/homebridge) project. This accessory is tailored for running on an [ESP8266 with a LED strip](https://github.com/squarefrog/led-controller-software).

## Installation

1. Install homebridge using: `npm install -g homebridge`
1. Install this plugin using: `npm install -g homebridge-led-controller`
1. Update your configuration file. See the sample below.

## Updating

To update, run `npm update -g homebridge-led-controller`

## Configuration

Bare minimum configuration:

```json
"accessories": [
  {
    "accessory": "led-controller",
    "name": "TV Lights",
    "host": "10.0.0.4"
  }
]
```

Optional configuration:

```json
"accessories": [
  {
    "accessory": "led-controller",
    "name": "TV Lights",
    "host": "10.0.0.4",
    "manufacturer": "Bob Ross",
    "model": "Happy LEDs",
    "serial": "123-456-789"
  }
]
```

## License
Published under the MIT License.

