# Retro Board

<a href="https://www.buymeacoffee.com/dkoppenhagen" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![Live](https://img.shields.io/badge/Live-firebase-blueviolet.svg)](https://d-koppenhagen.github.io/angular-tag-cloud-module/)

Retro Board is a collaborative drawing / retrospective tool that enables the users to draw collaboratively between their browsers.

![A screenshot from the retro board app](./docs/screenshot.png)

The original code base was inspired and forked from [@jeffersonswartz canvas-app](https://github.com/jeffersonswartz/canvas-app)
### Development

Install Angular CLI globally.

```sh
$ npm install -g @angular/cli
```

Install the dependencies and devDependencies.

```sh
$ npm install
```

Adjust the Firebase configuration and connect it to your instance by copying the template and change the content:

```sh
cp src/environments/environment.example.ts src/environments/environment.ts
# open src/environments/environment.ts and adjust the content
```

Start the app locally

```sh
$ npm start
```

That's it. 🎉
