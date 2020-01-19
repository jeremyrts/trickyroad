import React, { Component } from 'react'
import { StyleSheet, View, Text, SafeAreaView, ImageBackground, TouchableOpacity } from 'react-native';
export default class Ladder extends Component {
	state = {  }
	render() {
		return (
			<SafeAreaView style={ladder.container}>
				<ImageBackground source={require('../assets/background.jpg')} style={ladder.background}>
					<View style={ladder.mainContainer}>
						<TouchableOpacity 
							style={ladder.returnButton}
							onPress={() => { this.props.navigation.goBack() }}
						>
							<Text style={{color:'white', fontWeight:'bold'}}>Retour</Text>
						</TouchableOpacity>
						<View style={ladder.infos}>
							<View style={ladder.title}>
								<Text style={ladder.titleValue}>Leaderboard</Text>
							</View>
							<View style={ladder.infosValue}>
								{/* Module à part pour récupérer les couples pseudo/scores */}
								<Text style={ladder.item}>Nickname 1 00:30</Text>
								<Text style={ladder.item}>Nickname 1 00:30</Text>
								<Text style={ladder.item}>Nickname 1 00:30</Text>
								<Text style={ladder.item}>Nickname 1 00:30</Text>
							</View>
						</View>
					</View>
				</ImageBackground>
			</SafeAreaView> 
		)
	}
}

const ladder = StyleSheet.create({
	container: {
		flex: 1,
	},
	background: {
		width: '100%',
		height: '100%'
	},
	mainContainer: {
		borderRadius: 4,
		borderWidth: 0.5,
		height: '100%'
	},
	returnButton: {
		borderRadius: 4,
		// borderWidth: 0.5,
		// borderColor: '#ff0000',
		// flex:0,
		marginBottom: 50,
		padding: 20
	},
	infos: {
		flex: 1,
		alignItems: 'center',
		borderRadius: 4,
		// borderWidth: 0.5,
		// borderColor: '#ff0000',
		height: '50%'
	},
	title: {
		marginBottom: 30
	},
	titleValue: {
		fontSize: 50,
    	color: 'white',
		fontWeight: 'bold',
		textAlign: "center"	
	},
	infosValue: {
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
		width: '80%',
		padding: 30,
		borderRadius: 30,
	},
	item: {
		marginTop: 10,
		marginBottom: 10,
		fontSize: 20,
    	color: 'white',
		fontWeight: 'bold',
	}

})