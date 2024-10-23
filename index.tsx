import { AppRegistry } from 'react-native';
import App from './App';
const appJson = require('./app.json'); 


AppRegistry.registerComponent(appJson.name, () => App);


