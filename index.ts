import { registerRootComponent } from 'expo';

import App from './App';

import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { Buffer } from 'buffer';

// @ts-ignore
global.Buffer = global.Buffer || Buffer;
// @ts-ignore
global.process = global.process || { env: {} };

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
