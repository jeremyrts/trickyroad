import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, ImageBackground, Text, View, Image, TouchableOpacity, Modal} from 'react-native';
// import { Gyroscope } from 'expo-sensors';

import {
  gyroscope
} from "react-native-sensors";

import LeaveButton from './LeaveButton'
import SensorBluetooth from './SensorBluetooth'
import BluetoothManager from './BluetoothManager'

export default class GyroscopeMode extends Component {
  state = {
    gyroscopeData: {},
    delta: { x: 0, y: 0, z: 0},
    readyToPlay: false,
    startGame: false
  };

  componentDidMount() {
    this._toggle()
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  setReadyToPlay(bool) {
    this.setState({
      readyToPlay: bool
    })
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  };

  // _slow = () => {
  //   Gyroscope.setUpdateInterval(1000);
  // };

  // _fast = () => {
  //   Gyroscope.setUpdateInterval(16);
  // };

  // _subscribe = () => {
  //   this._subscription = Gyroscope.addListener(result => {
  //     this.setState({ gyroscopeData: result });
  //   });
  // };

  _subscribe = () => {
    this._subscription = gyroscope.subscribe( ({x, y, z}) => {
      this.setState({gyroscopeData: {x,y,z}})
    });
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.unsubscribe();
    this._subscription = null;
  };

  launchGame () {
    this.state.delta = this.state.gyroscopeData
  }

  getCalculatedCoords () {
    return { 
      x2: this.state.gyroscopeData.x - this.state.delta.x,
      y2: this.state.gyroscopeData.y - this.state.delta.y,
      z2: this.state.gyroscopeData.z - this.state.delta.z,
    }
  }

  render() {
    let { x, y, z } = this.state.gyroscopeData;
    let { x2, y2, z2 } = this.getCalculatedCoords()
    /*<SensorBluetooth style={gyro.ble} value={{left: this.state.gyroscopeData.x, top: this.state.gyroscopeData.y}} />*/
    return (
      <SafeAreaView style={gyro.container}>
        <BluetoothManager 
          onRef={ref => (this.parentReference = ref)}
          parentReference = {this.setReadyToPlay.bind(this)}
          position = {x2 + "," + y2}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={!this.state.startGame}
        >
          <View style={gyro.modalContainer}>
            <View style={gyro.modal}>
              <View>
                <Text style= {[{ fontSize: 18, fontWeight: 'bold', color: 'white'}, (this.state.readyToPlay) && { display: 'none'}]}>Connecting...</Text>
              </View>
              <TouchableOpacity onPress={() => {
                this.launchGame()
                this.setState({
                  startGame: true
                })
              }
              } disabled={!this.state.readyToPlay}>
                <View style = {[gyro.buttonContainer, (!this.state.readyToPlay) && {opacity: 0.2}]}>
                  <Text style = {gyro.buttonTitle}>Start game</Text>
                </View>
              </TouchableOpacity>
    
            </View>
          </View>
        </Modal>
        <ImageBackground source={require('../assets/background.jpg')} style={gyro.background}>
          
          <View style={gyro.infos}>
            <View style={gyro.timer}>
              <Text style={gyro.timerValue}>
                00:00
              </Text>
            </View>
            <View style={gyro.selectedMode}>
              <Image 
                resizeMode={'contain'}
                style={gyro.img}
                source={require('../assets/icons/gyroscope.png')}
              />
            </View>
          </View>
          <View style={gyro.visuContainer}>
            <Image style={gyro.imgTMP} resizeMode={'contain'}
              source={require('../assets/tmp.png')}
            />
          </View>
          <View style={gyro.leaveContainer}>
            {/* !this.state.modalVisible && <LeaveButton></LeaveButton>*/}
          </View>
          
          <View style={gyro.debug}>
           {/* <Text style= {{ fontSize: 20, color: 'white'}}>
              Gyro :
              x: {round(x)} y: {round(y)} z: {round(z)}
            </Text>
            <Text style= {{ fontSize: 20, color: 'white'}}>
              Delta :
              x: {round(this.state.delta.x)} y: {round(this.state.delta.y)} z: {round(this.state.delta.z)}
            </Text>
            <Text style= {{ fontSize: 20, color: 'white'}}>
              Reset :
              x: {round(x2)} y: {round(y2)} z: {round(z2)}
          </Text> */}
          </View>
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

const gyro = StyleSheet.create({
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
  modalContainer: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '80%',
    height: 150,
    borderRadius: 30,
    backgroundColor: '#3B2125',
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#C9C9C9', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 15,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  buttonTitle: {
    color: '#623231',
    fontSize: 18,
    fontWeight: 'bold'
  },
  ble: {
    position: 'absolute',
    left: 0,
    top: 0,
  }

});
