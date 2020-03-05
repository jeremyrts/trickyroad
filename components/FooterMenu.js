import React, { Component } from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import { withNavigation } from 'react-navigation';
// import home from '../assets/icons/home.png'

class FooterMenu extends Component {
	render() {
		return (
			<View style={footerMenu.container}>
				<TouchableOpacity style={footerMenu.button} onPress={() => this.props.navigation.navigate('Home')}>
					<Image 
						source = {require('../assets/icons/home.png')}
						style={footerMenu.image}
					/>
				</TouchableOpacity>
				<TouchableOpacity style={footerMenu.button} onPress={() => this.props.navigation.navigate('ModeSelector')}>
					<Image 
						source = {require('../assets/icons/redo.png')}
						style={footerMenu.image}
					/>
				</TouchableOpacity>
			</View>
		);
	}
}

const footerMenu = StyleSheet.create({
	container: {
		flexDirection: "row",
	},
	image: {
		width: 30, 
		height: 30, 
	},
	button: {
		padding: 15,
		backgroundColor: '#C9C9C9',
		borderRadius: 30,
		marginHorizontal: 10,
	}
})

export default withNavigation(FooterMenu);