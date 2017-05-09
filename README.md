# Car Wars Builder
_A construction tool for calculating space, weight, and cost for Car Wars vehicles_

## Contact Information
* _Eric J. Ehlers_
* Email: _ericjehlers@gmail.com_
* Twitter: _@SaintEhlers_


## Environment Setup
1. Pre-requisites:
    * _NodeJS 6.7.0_
    * _NPM 3.10.3_
    * _Mongo 3.2.9_

2. Installation
    * Install node-gyp -- `npm install node-gyp`
    * On windows, make sure the `msvs_version` is set in `npm config` -- `npm config set msvs_version 2015`
    * Install node modules -- `npm install`
    * Update your secret in `consts/consts.js`. You can use any string, but I recommend creating a truly random string using the sodium module you installed in the previous step.
    * * *If you do not do this* you will have the same secret as the repo, making your install insecure. 

3. Start Server
    `node index`

## to do:
* restrict string values to enum
* validate incoming data



