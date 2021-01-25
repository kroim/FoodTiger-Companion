import React from 'react';
import { Image } from 'react-native';
import { Asset } from 'expo-asset';
import { Block, GalioProvider } from 'galio-framework';
import Screens from './navigation/Screens';
import { Images, articles, argonTheme } from './constants';
import Register from "./screens/Register";
import { AsyncStorage } from 'react-native';


import {
  createStackNavigator,
  createAppContainer
} from "react-navigation";
import AppEventEmitter from './functions/emitter';

const Login =  createAppContainer(createStackNavigator(
  {
    Account: {
      screen: Register,
      navigationOptions: navOpt => ({
        title: 'Register',
        header: null,
      })
    },
   
  },
  {
    cardStyle: {
      backgroundColor: "#F8F9FE"
    },
   
  }
))
// cache app images
const assetImages = [
  Images.Onboarding,
  Images.LogoOnboarding,
  Images.Logo,
  Images.Pro,
  Images.ArgonLogo,
  Images.iOSLogo,
  Images.androidLogo
];

// cache product images
articles.map(article => assetImages.push(article.image));

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false,

    };
    this.getTheUserLoginStatus = this.getTheUserLoginStatus.bind(this);
  }

  componentWillMount(){
    AppEventEmitter.addListener('goToAppScreensNavi', this.getTheUserLoginStatus);
    this.getTheUserLoginStatus()
  }
  
  /**
   * 
   */
  async getTheUserLoginStatus() {
    
    var _this = this;
     try {
       const value = await AsyncStorage.getItem('token');
       if (value !== null) {
         // We have data!!
         _this.setState({
           status: true
         })
       }else{
         _this.setState({
           status: false
         })
       }
     } catch (error) {
       // Error retrieving data
     }
   }
  render() {
    if(!this.state.status) {
      return (
        <GalioProvider theme={argonTheme}>
        <Login/>
        </GalioProvider>
      );
    } else {
    
      return (
        <GalioProvider theme={argonTheme}>
          <Block flex>
            <Screens />
          </Block>
        </GalioProvider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      ...cacheImages(assetImages),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

}
