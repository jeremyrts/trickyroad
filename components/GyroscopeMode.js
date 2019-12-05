import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, ImageBackground, Text, View, Image, TouchableOpacity, Modal} from 'react-native';
// import { Gyroscope } from 'expo-sensors';

import {
  gyroscope,
} from "react-native-sensors";

import LeaveButton from './LeaveButton'
// import SensorBluetooth from './SensorBluetooth';

export default class GyroscopeMode extends Component {
  state = {
    gyroscopeData: {},
    delta: { x: 0, y: 0, z: 0},
    modalVisible: true,
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  componentDidMount() {
    this._toggle()
  }

  componentWillUnmount() {
    this._unsubscribe();
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
      console.log(this.state.gyroscopeData)
    });
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
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
    
    return (
      <SafeAreaView style={gyro.container}>
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
            { !this.state.modalVisible && <LeaveButton></LeaveButton>}
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.launchGame()
            }}
          >
            
            <View style={gyro.modalContainer}>
              <View style={gyro.modal}>
              <Text style= {{ fontSize: 18, fontWeight: 'bold', color: 'white'}}>
                  Are you ready ?
                </Text>
                <TouchableOpacity onPress={() => {this.setModalVisible(!this.state.modalVisible);  this.launchGame()}}>
                  <View style = {gyro.buttonContainer}>
                    <Text style = {gyro.buttonTitle}>Yes</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* <SensorBluetooth/> */}
          <View style={styles.debug}>
            <Text style= {{ fontSize: 20, color: 'white'}}>
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
            </Text>
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
  }

});
