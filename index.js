/**
 * @format
 */

import 'react-native-get-random-values';
import {AppRegistry} from 'react-native';
// import App from './App';
import AppIntro from './screens/IntroScreen';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppIntro);
