import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  Image,
  KeyboardAvoidingView
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import AppJSON from './../app.json'
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import { AsyncStorage } from 'react-native';
import AppEventEmitter from '../functions/emitter';
const { width, height } = Dimensions.get("screen");

class Register extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        email:"",
        password:""
    };
    this.getTheTocken = this.getTheTocken.bind(this);
    this.setToken = this.setToken.bind(this);
   
  }

  async componentDidMount(){
    var _this=this;
     try {
       const value = await AsyncStorage.getItem('token');
       if (value !== null) {
         // We have data!! 
         AppEventEmitter.emit('goToAppScreensNavi');
       }
     } catch (error) {
       // Error retrieving data
     }
   }
  /**
   * Get the tocken and set it to Async storage
   */
   getTheTocken = async () =>{
     var _this=this;
     fetch(AppJSON.expo.extra.server+'/api/drivergettoken?email='+this.state.email+'&password='+this.state.password, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
       
      }),
    }).then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status){
        _this.setToken(responseJson.token)
      }else{
        alert(responseJson.errMsg);
      }
     
      
    }).catch(error => {
      alert(error.message);
    });
  }
  
  setToken = async (token) =>{
    try {
      await AsyncStorage.setItem('token',token);
      AppEventEmitter.emit('goToAppScreensNavi');
   } catch (error) {
     // Error retrieving data
   }
  }
  
 
  render() {
    return (
      <Block flex middle>
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
          <Block flex middle>
            <Block style={styles.registerContainer}>


              
              <Block flex>

                

                <Block flex={0.17} middle style={{marginTop:20}}>
                  <Image source={Images.foodTigerLogo} style={{width: (487/2),height: (144/2)}}/>
                  <Text muted>Delivery companion app</Text>
                </Block>
                <Block flex center style={{marginTop:40}}>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    
                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                       value ={this.state.email}
                        borderless
                        onChangeText={text => this.setState({
                          email:text
                        })}
                        placeholder={"Email"}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="ic_mail_24px"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    <Block width={width * 0.8}>
                      <Input
                       value ={this.state.password}
                        password
                        borderles
                        placeholder={"Password"}
                        onChangeText={text => this.setState({
                          password:text
                        })}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="padlock-unlocked"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                      
                    </Block>
                    <Block row width={width * 0.75}>
                      
                      
                    </Block>
                    <Block middle>
                      <Button color="primary" style={styles.createButton} onPress={()=> this.getTheTocken()}>
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          LOGIN
                        </Text>
                      </Button>
                    </Block>
                  </KeyboardAvoidingView>
                </Block>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25
  }
});

export default Register;
