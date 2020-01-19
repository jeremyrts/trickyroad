import React, { Component } from 'react'
import { StyleSheet, View, Text, SafeAreaView, ImageBackground, TouchableOpacity } from 'react-native';
export default class ResultScreen extends Component {
	state = {  }
	render() {
		if(this.props.won) {
			return (
				<SafeAreaView style={resultScreen.container}>
					<ImageBackground source={require('../assets/background.jpg')} style={resultScreen.background}>
						<View style={resultScreen.mainContainer}>
							<View style={resultScreen.infos}>
								<View style={resultScreen.title}>
									<Text style={resultScreen.titleValue}>Congratulations</Text>
									{/* Insérer le score obtenu */}
									<Text style={resultScreen.subtitleValue}>00:29</Text>
								</View>
								<View style={resultScreen.saveModule}>
									<TouchableOpacity style={resultScreen.buttonModule}>
										<Text style={resultScreen.buttonModuleTitle}>Save your score</Text>
									</TouchableOpacity>
								</View>
							</View>
							<View style={resultScreen.footer}>
								<TouchableOpacity style={resultScreen.button}>
									<Text>Home</Text>
								</TouchableOpacity>
								<TouchableOpacity style={resultScreen.button}>
									<Text>Restart</Text>
								</TouchableOpacity>
							</View>
						</View>
					</ImageBackground>
				</SafeAreaView> 
			)
		}
		else {
			return (
				<SafeAreaView style={resultScreen.container}>
					<ImageBackground source={require('../assets/background.jpg')} style={resultScreen.background}>
						<View style={resultScreen.mainContainer}>
							<View style={resultScreen.infos}>
								<View style={resultScreen.title}>
									<Text style={resultScreen.titleValue}>So close...</Text>
									{/* Insérer le score obtenu */}
									<Text style={resultScreen.subtitleValue}>00:29</Text>
								</View>
								<View style={resultScreen.leaderboard}>
									<View style={resultScreen.leaderboardTitle}>
										<Text style={resultScreen.leaderboardTitleValue}>Leaderboard</Text>
									</View>
									<View style={resultScreen.leaderboardValue}>
										{/* Module à part pour récupérer les couples pseudo/scores */}
										<Text style={resultScreen.item}>Nickname 1 00:30</Text>
										<Text style={resultScreen.item}>Nickname 1 00:30</Text>
										<Text style={resultScreen.item}>Nickname 1 00:30</Text>
										<Text style={resultScreen.item}>Nickname 1 00:30</Text>
									</View>
								</View>
								
							</View>
							<View style={resultScreen.footer}>
								<TouchableOpacity style={resultScreen.button}>
									<Text>Home</Text>
								</TouchableOpacity>
								<TouchableOpacity style={resultScreen.button}>
									<Text>Restart</Text>
								</TouchableOpacity>
							</View>
						</View>
					</ImageBackground>
				</SafeAreaView> 
			)
		}
		
	}
}

const resultScreen = StyleSheet.create({
	container: {
		flex: 1,
	},
	background: {
		width: '100%',
		height: '100%'
	},
	mainContainer: {
		borderRadius: 4,
		height: '100%',
	},
	footer: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'center',
		margin: 20,
		marginBottom: 30
	},
	buttonModule: {
		marginLeft: 10,
		marginRight: 10,
		borderRadius: 50,
		paddingVertical: 15,
		paddingHorizontal: 20,
		backgroundColor: '#C9C9C9', 
	},
	buttonModuleTitle: {
		color: '#623231',
		fontWeight: 'bold',
		fontSize: 15
	},	
	button: {
		marginLeft: 10,
		marginRight: 10,
	},
	infos: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		marginBottom: 30
	},
	saveModule: {
		marginTop: 20
	},
	titleValue: {
		fontSize: 40,
    	color: 'white',
		fontWeight: 'bold',
		textAlign: "center"	
	},
	subtitleValue: {
		textAlign: "center",	
		fontSize: 30,
		color: 'white',
	},
	infosValue: {
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
		width: '80%',
		padding: 30,
		borderRadius: 30,
	},
	leaderboard: {
		width: '100%',
		alignItems: 'center'
	},
	leaderboardTitle: {
		marginBottom: 20,
	},
	leaderboardTitleValue: {
		color: 'white',
		fontSize: 30,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	leaderboardValue: {
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