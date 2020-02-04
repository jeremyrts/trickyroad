import React, { Component } from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
// import home from '../assets/icons/home.png'

export default class FooterMenu extends Component {
	render() {
		return (
			<View style={footerMenu.container}>
				<TouchableOpacity style={footerMenu.button}>
					<Image 
						source = {require('../assets/icons/home.png')}
						style={footerMenu.image}
					/>
				</TouchableOpacity>
				<TouchableOpacity style={footerMenu.button}>
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