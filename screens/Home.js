import React from 'react';
import { StyleSheet, Dimensions, ScrollView} from 'react-native';
import { Block, theme, Button,Text } from 'galio-framework';

import { Card } from '../components';
import AppJSON from './../app.json'
const { width } = Dimensions.get('screen');
import { AsyncStorage } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';  

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        orderData:[],
        
    };
    
   
  }

  componentWillMount(){
    
    //initialy get order
    this.getOrders();
    
    //Get porders every 10sec
    setInterval(() => {
      this.getOrders()
    }, 10000);

    this.startGettingLocactionData()
    
  }

  async locationReceived(location){
    console.log("Location received "+JSON.stringify(location));
    const order_id = await AsyncStorage.getItem('order_tracking');
    if(order_id !== null &&location&&location.timestamp&&location.coords){
      console.log("Location received "+JSON.stringify(location));
      var url=AppJSON.expo.extra.server+'/api/updateorderlocation/'+order_id+'/'+location.coords.latitude+'/'+location.coords.longitude+'/?api_token='+await AsyncStorage.getItem('token');
      console.log(url);
      fetch(url)
      .then(response => response.json())
      .catch(error => {
        console.error(error);
      });


    }else{
      console.log("Location received. Don't put on server");
    }
  }


  async startGettingLocactionData(){
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }else{
        Location.watchPositionAsync({timeInterval:10000}, this.locationReceived)
      }
  }

  
   async getOrders() {
     //alert("Fethcing orders");
     var _this=this
     fetch(AppJSON.expo.extra.server+'/api/driverorders?api_token='+await AsyncStorage.getItem('token'))
      .then(response => response.json())
      .then(responseJson => {
        if(responseJson.data){
          //console.log(JSON.stringify(responseJson.data))
          _this.setState({
            orderData:responseJson.data
          })
        }else{
          alert("Error")
        }
       
      })
      .catch(error => {
        console.error(error);
      });
  }

  showEmpty=(show)=>{
    if(show){
      return <Block middle><Text muted>No more orders for today!</Text></Block>
    }else{
      return <Block></Block>
    }
  }

  renderArticles = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        <Block flex>
          {
            this.state.orderData.map((item)=>{
              return (<Card key={item.id} item={item} horizontal  />)
            })
          }
          {
            this.showEmpty(this.state.orderData.length==0)
          }
          
        </Block>
      </ScrollView>
    )
  }

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderArticles()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
});

export default Home;
