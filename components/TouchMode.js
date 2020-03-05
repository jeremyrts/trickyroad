import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, ImageBackground, Text, View, Image, PanResponder, TouchableOpacity, AsyncStorage } from 'react-native';
import LeaveButton from './LeaveButton'
import firebase from 'firebase'
import { Cache } from "react-native-cache"

import base from '../base'

import SensorBluetooth from './SensorBluetooth';
import BluetoothManager from './BluetoothManager'

export default class TouchMode extends Component {
  
  state = {
    left: 0,
    top: 0,
    messages: {},
    cache: null
  }
  

  componentDidMount () {
    this.state.cache = new Cache({
      namespace: "myapp",
      policy: {
          maxEntries: 50000
      },
      backend: AsyncStorage
    })

    this.state.cache.getItem("pseudo", function(err, value) {
      console.log("Get from previous cache " + value);
    });

    // base.syncState('/', {
    //   context: this,
    //   state: 'messages'
    // })
    //console.log(this.state.messages)
  }

  addPseudoToCache() {
    const pseudo = "toot"
    const score = 1500

    base.fetch('users', {
      context: this,
      asArray: true,
      then(data){
        console.log(data);
        const users = data
        const present = users.filter((item) => item.key === pseudo)

        if(present) {
          this.state.cache.setItem("pseudo", pseudo, function(err) {
            if(err) { 
              console.log('error when add')
              return
            }
      
            base.post(`users/${pseudo}`, {
              data: {score: [{
                date: new Date().toString(),
                value: score
              }]},
              then(err){
                if(!err){
                  console.log('succesfully added')
                }
              }
            })
      
          })
        }
        else {
          base.update(`users/${pseudo}`, {
            data: {score: [
              ...present[0].score,
              {
              date: new Date().toString(),
              value: score
            }]},
            then(err){
              if(!err){
                console.log('succesfully added')
              }
            }
          });
        }
      }
    });
  }

  removePseudoFromCache() {
    this.state.cache.removeItem("pseudo", function(err) {
    })
  }

  _panResponder = PanResponder.create({
    // Ask to be the responder:
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      // The gesture has started. Show visual feedback so the user knows
      // what is happening!
      // gestureState.d{x,y} will be set to zero now
    },
    onPanResponderMove: (evt, gestureState) => {
      // The most recent move distance is gestureState.move{X,Y}
      // The accumulated gesture distance since becoming responder is
      // gestureState.d{x,y}
      this.setState({
        left: Math.max(0, Math.min(180, (((gestureState.dx/2) / Dimensions.get('window').width) + 0.5 ) * 180)) ,
        top: Math.max(0,Math.min(180, (((gestureState.dy/2) / Dimensions.get('window').height) + 0.5) * 180)),
      });
    },
    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      // The user has released all touches while this view is the
      // responder. This typically means a gesture has succeeded
    },
    onPanResponderTerminate: (evt, gestureState) => {
      // Another component has become the responder, so this gesture
      // should be cancelled
    },
    onShouldBlockNativeResponder: (evt, gestureState) => {
      // Returns whether this component should block native components from becoming the JS
      // responder. Returns true by default. Is currently only supported on android.
      return true;
    },
  });
  
  render() {
    //    <SensorBluetooth style={touch.ble} value={this.state}/>

    /*
<View style={touch.infos}>
            <View style={touch.timer}>
              <Text style={touch.timerValue}>
                00:00
              </Text>
            </View>
            <View style={touch.selectedMode}>
              <Image 
                resizeMode={'contain'}
                style={touch.img}
                source={require('../assets/icons/touchscreen.png')}
              />
            </View>
          </View>
          <View style={touch.visuContainer} {...this._panResponder.panHandlers}>
            <Image style={touch.imgTMP} resizeMode={'contain'}
              source={require('../assets/tmp.png')}
            />
          </View>
          <View style={touch.leaveContainer}>
            <LeaveButton></LeaveButton>
            <TouchableOpacity onPress={()=> this.addPseudoToCache()}><View ><Text>Add pseudal</Text></View></TouchableOpacity>
            <TouchableOpacity onPress={()=> this.removePseudoFromCache()}><View ><Text>delete pseudal</Text></View></TouchableOpacity>
           </View>
          <View style={touch.debug}>
            <Text style= {{ fontSize: 20, color: 'white'}}>
            Position du doigt :
            x : { round(this.state.left) } y : { round(this.state.top) }
            </Text>
          </View>
    */
    return (
      <SafeAreaView style={touch.container}>
        <ImageBackground source={require('../assets/background.jpg')} style={touch.background}>
          <BluetoothManager />
          
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const touch = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: '100%', 
    height: '100%'
  },
  infos: {
    position: 'relative',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#ff0000',
  },
  timer: {
    position: 'absolute',
    top: 50, 
    left: 0,
    right:0,
    alignItems: 'center',
  },
  timerValue: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  selectedMode: {
    position: 'absolute',
    top: 30, 
    right: 30,
  },
  img: {
    width: 30,
    height: 30,
  },
  imgTMP: {
    width: '90%',
    height: 300,
  },
  visuContainer: {
    flex: 7,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leaveContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  debug: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  ble: {
    position: 'absolute',
    left: 0,
    top: 0,
  }

});
