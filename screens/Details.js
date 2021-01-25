import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  Linking,
  View,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import AppJSON from './../app.json'
import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
const { width, height } = Dimensions.get("screen");
import { FancyAlert } from 'react-native-expo-fancy-alerts';
import { Ionicons } from '@expo/vector-icons';


const thumbMeasure = (width - 48 - 32) / 3;

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDeliverAlert:false,
      showalert:false,
      item: this.props.navigation.state.params ? this.props.navigation.state.params.item : {},

    };

    this.openExternalApp = this.openExternalApp.bind(this);
    this.openPhoneApp = this.openPhoneApp.bind(this);
    this.updateTheOrderStatus = this.updateTheOrderStatus.bind(this);
    this.startTracking=this.startTracking.bind(this);
    this.stopTracking=this.stopTracking.bind(this);
    this.showActionButton=this.showActionButton.bind(this);
    this.makePickedUpAndStartTracking=this.makePickedUpAndStartTracking.bind(this);
    this.makeDelivered=this.makeDelivered.bind(this);
    this.askDelivered=this.askDelivered.bind(this);
  }

  /**
   * Open on the map the location of the restaurant
   * @param {Float} lat 
   * @param {Float} long 
   */
  openExternalApp(lat, long) {
    var scheme = Platform.OS === 'ios' ? 'apple' : 'google'
    Linking.canOpenURL('http://maps.' + scheme + '.com/maps?daddr=' + lat + ',' + long).then(supported => {
      if (supported) {
        Linking.openURL('http://maps.' + scheme + '.com/maps?daddr=' + lat + ',' + long);
      } else {

      }
    });
  }

  /**
   * Call the restaurant function
   * @param {String} phoneNumber 
   */
  openPhoneApp(phoneNumber) {
    console.log(phoneNumber)
    var number = "tel:" + phoneNumber
    Linking.canOpenURL(number).then(supported => {
      if (supported) {
        Linking.openURL(number);
      } else {

      }
    });
  }

  

  async updateTheOrderStatus(statusid) {
    if(statusid==6){
      this.startTracking();
    }
    

    var theLastStatus = (this.state.item.status.slice(-1)[0]);
    var _this = this
    var url = AppJSON.expo.extra.server + '/api/updateorderstatus/' + theLastStatus.pivot.order_id + '/' + statusid + '/?api_token=' + await AsyncStorage.getItem('token') + "&comment=driver_app";
    return fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        console.log(JSON.stringify(responseJson))
        _this.setState({
          item:responseJson.data[0],
          showalert:statusid==6?true:false,
        })

      })
      .catch(error => {
        console.error(error);
      });
  }

  async startTracking(){
    try {
        await AsyncStorage.setItem('order_tracking',this.state.item.id+"");
    } catch (error) {}

  }

  async stopTracking(){
    try {
      await AsyncStorage.removeItem('order_tracking');
  } catch (error) {}
  }

  makePickedUpAndStartTracking(){
    //Picked up
    this.updateTheOrderStatus(6);
  }

  askDelivered(){
    this.setState({
      showDeliverAlert:true
    })
  }

  makeDelivered(){
    //Delivered
    this.updateTheOrderStatus(7);

    //Stop tracking
    this.stopTracking();
  }



  showActionButton(){
    lastStatus=this.state.item.status.slice(-1)[0].alias;

    if(lastStatus=="prepared"){
      return (<View style={{ height: 100, justifyContent: "center", alignItems: "center" }}>
          <Button round size="small" onPress={() => this.makePickedUpAndStartTracking()} color="success">Pick up now</Button>
      </View>)
      
    }
     else if(lastStatus=="picked_up"){
      return ( <View style={{ height: 100, justifyContent: "center", alignItems: "center" }}>
        <Button round size="small" onPress={() => this.askDelivered()} color="success">Delivered</Button>
      </View>)
      
    }else{
      return <View></View>
    }
    
  }

  render() {
    return (
      <Block flex style={styles.profile}>
        <Block flex>
          <ImageBackground
            source={Images.ProfileBackground}
            style={styles.profileContainer}
            imageStyle={styles.profileBackground}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
              <Block flex style={styles.profileCard}>
                <Block middle style={styles.avatarContainer}>
                  <Image
                    source={{ uri: this.state.item.restorant.icon }}
                    style={styles.avatar}
                  />
                </Block>
                <Block style={styles.info}>
                  <Block
                    middle
                    row
                    space="evenly"
                    style={{ marginTop: 20, paddingBottom: 24 }}
                  >
                    <Button
                      small
                      style={{ backgroundColor: argonTheme.COLORS.INFO }}
                      onPress={() => this.openExternalApp(this.state.item.restorant.lat, this.state.item.restorant.lng)}
                    >
                      DIRECTION
                    </Button>
                    <Button
                      small
                      style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}
                      onPress={() => this.openPhoneApp(this.state.item.restorant.phone)}
                    >
                      CALL
                    </Button>
                  </Block>

                </Block>
                <Block flex>
                  <Block middle style={styles.nameInfo}>
                    <Text bold size={28} color="#32325D">
                      {this.state.item.restorant.name}
                    </Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                      {this.state.item.restorant.address}
                    </Text>
                  </Block>
                  <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                    <Block style={styles.divider} />
                  </Block>
                  <Block middle>
                    <Text
                      size={16}
                      color="#525F7F"
                      style={{ textAlign: "center" }}
                    >
                      Created at: {this.state.item.created_at}
                    </Text>

                  </Block>
                  <Block
                    row
                    style={{ paddingVertical: 14, alignItems: "baseline" }}
                  >
                    <Text bold size={16} color="#525F7F">
                      Status
                    </Text>

                  </Block>
                  <Block middle>
                    <Text
                      size={16}
                      color="#525F7F"
                      style={{ textAlign: "center" }}
                    >
                      {(this.state.item.status.slice(-1))[0].name}
                    </Text>

                  </Block>
                  <Block
                    row
                    style={{ paddingVertical: 14, alignItems: "baseline" }}
                  >
                    <Text bold size={16} color="#525F7F">
                      Client
                    </Text>


                  </Block>
                  <Block middle>

                    <Text
                      size={16}
                      color="#525F7F"
                      style={{ textAlign: "center" }}
                    >
                      {this.state.item.client.name}

                    </Text>
                    <Text
                      size={16}
                      color="#525F7F"
                      style={{ textAlign: "center" }}
                    >
                      {this.state.item.address.address}

                    </Text>
                  </Block>
                  <Block style={styles.info}>
                    <Block
                      middle
                      row
                      space="evenly"
                      style={{ marginTop: 20, paddingBottom: 24 }}
                    >
                      <Button
                        small
                        style={{ backgroundColor: argonTheme.COLORS.INFO }}
                        onPress={() => this.openExternalApp(this.state.item.address.lat, this.state.item.address.lng)}
                      >
                        DIRECTION
                    </Button>
                      <Button
                        small
                        style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}
                        onPress={() => this.openPhoneApp(this.state.item.client.phone)}
                      >
                        CALL
                    </Button>
                    </Block>

                  </Block>
                  <Block
                    row
                    style={{ paddingVertical: 14, alignItems: "baseline" }}
                  >
                    <Text bold size={16} color="#525F7F">
                      Order
                    </Text>
                  </Block>
                  <Block >
                      {
                        this.state.item.items.map((element)=>{
                          return (<Text color="#525F7F">{element.pivot.qty+" x "+element.name}</Text>)
                        })
                      }
                    </Block>


                </Block>


                <Block
                    row
                    style={{ paddingVertical: 14, alignItems: "baseline" }}
                  >
                    <Text bold size={16} color="#525F7F">
                      Payment method
                    </Text>
                  </Block>
                  <Block >
                    <Text color="#525F7F">Payment method: {(this.state.item.payment_method+"").toUpperCase()}</Text>
                    <Text color="#525F7F">Payment status: {(this.state.item.payment_status+"").toUpperCase()}</Text>
                  </Block>


                  <Block
                    row
                    style={{ paddingVertical: 14, alignItems: "baseline" }}
                  >
                    <Text bold size={16} color="#525F7F">
                      Note
                    </Text>
                  </Block>
                  <Block >
                    <Text color="#525F7F">{(this.state.item.comment+"")}</Text>
                   
                  </Block>



              </Block>
            </ScrollView>
            <Block>
            {this.showActionButton()}
            </Block>
              

            <FancyAlert
              visible={this.state.showalert}
              icon={
                <View style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'green',
                  borderRadius: '50%',
                  width: '100%',
                }}>
                  <Ionicons
                      name={Platform.select({ ios: 'ios-checkmark', android: 'md-checkmark' })}
                      size={36}
                      color="#FFFFFF"
                  /></View> 
                }
                style={{ backgroundColor: 'white' }}
              >
              
              <View style={styles.content}>
                <Text style={styles.contentText}>Order is picked up now. While delivering we will record the location.</Text>

                <TouchableOpacity style={styles.btn} onPress={()=>{
                  this.setState({
                    showalert:false
                  });}
                }
                >
                  <Text style={styles.btnText}>OK</Text>
                </TouchableOpacity>
              </View>
              
        
          </FancyAlert>


          <FancyAlert
              visible={this.state.showDeliverAlert}
              icon={
                <View style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'green',
                  borderRadius: '50%',
                  width: '100%',
                }}>
                  <Ionicons
                      name={Platform.select({ ios: 'ios-cash', android: 'md-cash' })}
                      size={36}
                      color="#FFFFFF"
                  /></View> 
                }
                style={{ backgroundColor: 'white' }}
              >
              
              <View style={styles.content}>
                <Text style={styles.contentText}>You are about to deliver this order!</Text>
              <Text style={styles.contentText}>{(this.state.item.payment_method+"").toUpperCase()=="COD"||this.state.item.payment_method==null?"This is Cash on deliver order. You should get "+(this.state.item.order_price+this.state.item.delivery_price)+" "+AppJSON.expo.extra.currency:"Order already paid. No additional action neede"}</Text>

                <TouchableOpacity style={styles.btn} onPress={()=>{
                  this.setState({
                    showDeliverAlert:false
                  });

                  this.makeDelivered();
                }
                }
                >
                  <Text style={styles.btnText}>OK! Order delivered.</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnwarning} onPress={()=>{
                  this.setState({
                    showDeliverAlert:false
                  });}
                }
                >
                  <Text style={styles.btnText}>Cancel this action</Text>
                </TouchableOpacity>
              </View>
              
        
          </FancyAlert>

          </ImageBackground>
          

        </Block>
        {/* <ScrollView showsVerticalScrollIndicator={false} 
                    contentContainerStyle={{ flex: 1, width, height, zIndex: 9000, backgroundColor: 'red' }}>
        <Block flex style={styles.profileCard}>
          <Block middle style={styles.avatarContainer}>
            <Image
              source={{ uri: Images.ProfilePicture }}
              style={styles.avatar}
            />
          </Block>
          <Block style={styles.info}>
            <Block
              middle
              row
              space="evenly"
              style={{ marginTop: 20, paddingBottom: 24 }}
            >
              <Button small style={{ backgroundColor: argonTheme.COLORS.INFO }}>
                CONNECT
              </Button>
              <Button
                small
                style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}
              >
                MESSAGE
              </Button>
            </Block>

            <Block row space="between">
              <Block middle>
                <Text
                  bold
                  size={12}
                  color="#525F7F"
                  style={{ marginBottom: 4 }}
                >
                  2K
                </Text>
                <Text size={12}>Orders</Text>
              </Block>
              <Block middle>
                <Text bold size={12} style={{ marginBottom: 4 }}>
                  10
                </Text>
                <Text size={12}>Photos</Text>
              </Block>
              <Block middle>
                <Text bold size={12} style={{ marginBottom: 4 }}>
                  89
                </Text>
                <Text size={12}>Comments</Text>
              </Block>
            </Block>
          </Block>
          <Block flex>
              <Block middle style={styles.nameInfo}>
                <Text bold size={28} color="#32325D">
                  Jessica Jones, 27
                </Text>
                <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                  San Francisco, USA
                </Text>
              </Block>
              <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                <Block style={styles.divider} />
              </Block>
              <Block middle>
                <Text size={16} color="#525F7F" style={{ textAlign: "center" }}>
                  An artist of considerable range, Jessica name taken by
                  Melbourne …
                </Text>
                <Button
                  color="transparent"
                  textStyle={{
                    color: "#233DD2",
                    fontWeight: "500",
                    fontSize: 16
                  }}
                >
                  Show more
                </Button>
              </Block>
              <Block
                row
                style={{ paddingVertical: 14, alignItems: "baseline" }}
              >
                <Text bold size={16} color="#525F7F">
                  Album
                </Text>
              </Block>
              <Block
                row
                style={{ paddingBottom: 20, justifyContent: "flex-end" }}
              >
                <Button
                  small
                  color="transparent"
                  textStyle={{ color: "#5E72E4", fontSize: 12 }}
                >
                  View all
                </Button>
              </Block>
              <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
                <Block row space="between" style={{ flexWrap: "wrap" }}>
                  {Images.Viewed.map((img, imgIndex) => (
                    <Image
                      source={{ uri: img }}
                      key={`viewed-${img}`}
                      resizeMode="cover"
                      style={styles.thumb}
                    />
                  ))}
                </Block>
              </Block>
          </Block>
        </Block>
                  </ScrollView>*/}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  alert: {
    backgroundColor: '#EEEEEE',
  },
  icon: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C3272B',
    width: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -16,
    marginBottom: 16,
  },
  contentText: {
    textAlign: 'center',
  },
  btn: {
    borderRadius: 32,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignSelf: 'stretch',
    backgroundColor: '#4CB748',
    marginTop: 16,
    minWidth: '50%',
    paddingHorizontal: 16,
  },
  btnwarning: {
    borderRadius: 32,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignSelf: 'stretch',
    backgroundColor: 'red',
    marginTop: 16,
    minWidth: '50%',
    paddingHorizontal: 16,
  },
  btnText: {
    color: '#FFFFFF',
  },
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  }
});

export default Details;
