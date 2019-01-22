# Tensorflowjs Examples

The [tensorflowjs examples](https://github.com/tensorflow/tfjs-examples) are a really great resource - [thank you](https://github.com/tensorflow/tfjs-examples/graphs/contributors)!

For my own use, I would prefer to make state and it's mutations more explicit. I used Mobx for the store, but Redux, Apollo-link-state or others could be used. React makes view updates nicer (IMO).

So to understand the how tensorflowjs worked before using them in my own apps, I rewrote a couple of the examples.

Feel free to PR bugs or any additional ports of tensorflowjs examples: https://github.com/tensorflow/tfjs-examples

## 1. Fitting a curve to synthetic data
https://github.com/tensorflow/tfjs-examples/tree/master/polynomial-regression-core
![Curve fitting with Tensorflowjs and React](/screenshots/curve_fitting.png?raw=true)

## 2. Boston Housing Price Prediction
https://github.com/tensorflow/tfjs-examples/tree/master/boston-housing
![Multivariate regression with Tensorflowjs and React](/screenshots/multivariate_regression.png?raw=true)


## 3. MNIST
* Refer to https://beta.observablehq.com/@mbostock/lets-try-t-sne

-------------------------------------------
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
