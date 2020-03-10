import React from 'react';
import { StyleSheet, ImageBackground, Text, View, Image, SafeAreaView } from 'react-native';
import { createAppContainer, withNavigation } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';


import MainButton from './components/MainButton'
import LadderButton from './components/LadderButton'
import Ladder from './components/Ladder'
import ModeSelector from './components/ModeSelector'
import GyroscopeMode from './components/GyroscopeMode'
import TouchMode from './components/TouchMode'
import ResultScreen from './components/ResultScreen'
import { TouchableOpacity } from 'react-native-gesture-handler';

class HomeScreen extends React.Component {

  state = {
    isSoundOn: "true"
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('./assets/background.jpg')} style={styles.background}>
          <View style={styles.main}>
            <TouchableOpacity onPress={() => this.setState({...this.state, isSoundOn: this.state.isSoundOn === "true" ? "false" : "true"})}>
              <Text>TOOGLE SOUND : {this.state.isSoundOn}</Text>
            </TouchableOpacity>
            <Text style={styles.appTitle}>{'Tricky Road'.toUpperCase()}</Text>
            <Image style={styles.img} resizeMode={'contain'}
              source={require('./assets/tmp.png')}
            />
          </View>
          <View style={styles.nav}>
            <View style={styles.containerPlayButton}>
              <MainButton style={styles.playButton} title='Play' isSoundOn={this.state.isSoundOn} navigation={this.props.navigation} destination='ModeSelector'></MainButton>
            </View>
            <View style={styles.containerLadderButton}>
              <LadderButton style={styles.ladderButton} navigation={this.props.navigation} destination='Ladder'></LadderButton>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
  

  componentDidMount() {
    var Sound = require('react-native-sound');
    this.musicLobby = new Sound(require('./assets/Thinking_About_The_Universe.mp3'),
    (error, sound) => {
    if (error) {
      alert('error' + error.message);
      return;
    }
    this.musicLobby.play()
    // Loop indefinitely until stop() is called
    this.musicLobby.setNumberOfLoops(-1);
  });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.musicLobby.stop()
  }

  componentDidUpdate() {
    if(this.state.isSoundOn === "false") {
      this.musicLobby.setVolume(0)
    }
    if(this.state.isSoundOn === "true") {
      this.musicLobby.setVolume(1)
    }
  }
  
}
 
const AppNavigator = createStackNavigator({
    Home: { screen: HomeScreen },
    ModeSelector: { screen: ModeSelector },
    GyroscopeMode: { screen: GyroscopeMode },
    TouchMode: { screen: TouchMode },
    Ladder: { screen: Ladder },
    ResultScreen: { screen: ResultScreen }
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  }
)
export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: '100%', 
    height: '100%'
  },
  main: {
    width: '100%',
    flex: 7,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  nav: {
    width: '100%',
    flex: 3,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  img: {
    width: '90%',
    height: 300,
  },
  containerLadderButton: {
    width: '100%',
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  }
});

