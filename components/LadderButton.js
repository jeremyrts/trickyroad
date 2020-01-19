import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Image, Text } from 'react-native';

export default class LadderButton extends Component {
  render() {
    return (
      <TouchableOpacity style={score.container} onPress ={() => this.props.navigation.navigate('Ladder')}>
        <Image resizeMode={'contain'}
          style={score.img}
          source={require('../assets/icons/ladder.png')}
        />
      </TouchableOpacity>
    );
  }
}

const score = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    margin: 30,
  },
  img: {
    width: 40,
    height: 40
  }
});
