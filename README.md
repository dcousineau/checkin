# Conference Check In

## Quick Start

_See the pre-requisites section for expected system packages_

1. Clone this repo and run `yarn install`
3. Run `yarn start` to initialize the server
4. Navigate to [http://localhost:3000/](http://localhost:3000/) in your browser

## Production Mode

1. Clone this repo and run `yarn install`
2. Run `yarn run prod`
3. Open your browser to the IP address it declares it is listening at
4. Other devices on the same network should be able to access via this IP as well

## Screenshots

![Admin Panel](./docs/admin.png)
![Attendee List](./docs/list.png)
![Check-in Confirmation](./docs/check-in.png)
![Printed Out Badges](./docs/print.jpg)

Above badges were printed with a [Brother QL-700](http://www.brother-usa.com/LabelPrinter/ModelDetail/23/ql700/Overview)

## Pre-requisites

This application requires `node.js`, `yarn`, and `cairo` to install 
(cairo is used by the [canvas](https://www.npmjs.com/package/canvas) package).

To install pre-requisites on OX, simply run `brew bundle` ([see documentation](https://github.com/Homebrew/homebrew-bundle)).

## License

This application is licensed under the [GPL v2 License](http://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
