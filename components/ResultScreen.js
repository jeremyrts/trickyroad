import React, { Component } from 'react'
import { StyleSheet, View, Text, SafeAreaView, ImageBackground, TouchableOpacity, TextInput } from 'react-native';
import FooterMenu from './FooterMenu'
export default class ResultScreen extends Component {
	state = { 
		user:''
	 }

	render() {
		if(!this.props.won) {
			console.log(this.state.user)
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
									<Text style={resultScreen.saveModuleTitle}> Connect you to save your score </Text>
									<TextInput
        								style={resultScreen.textInput}
										onChangeText={(user) => this.setState({user})}
										value={this.state.text}
										clearButtonMode="unless-editing"
										ref={input => { this.textInput = input }}
      								/>
									<TouchableOpacity onPress={() => {this.validate()}} style={resultScreen.buttonModule}>
										<Text style={resultScreen.buttonModuleTitle}>Save your score</Text>
									</TouchableOpacity>
								</View>
							</View>
							<View style={resultScreen.footer}>
								<FooterMenu></FooterMenu>
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
							{/* <View style={resultScreen.footer}>
								<TouchableOpacity style={resultScreen.button}>
									<Text>Home</Text>
								</TouchableOpacity>
								<TouchableOpacity style={resultScreen.button}>
									<Text>Restart</Text>
								</TouchableOpacity>
							</View> */}
							<View style={resultScreen.footer}>
								<FooterMenu></FooterMenu>
							</View>
							
						</View>
						
					</ImageBackground>
				</SafeAreaView> 
			)
		}
		
	}

	validate() {
		
		if(this.state.user !== ""){
			if(!this.state.user.includes(' '))
				alert("Welcome "+ this.state.user)
			else {
				alert("Do not use space in the name")
			}
		}
		else {
			alert("Please fill in the text input")
		}
		this.textInput.clear()
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
		marginBottom: 30,
	},
	buttonModule: {
		marginHorizontal: 10,
		borderRadius: 50,
		paddingVertical: 15,
		paddingHorizontal: 20,
		backgroundColor: '#C9C9C9',
		width: '80%',
		marginTop: 10
	},
	buttonModuleTitle: {
		color: '#623231',
		fontWeight: 'bold',
		fontSize: 15,
		textAlign: 'center'
	},	
	button: {
		marginHorizontal: 10
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
		flexDirection: 'column',
		marginTop: 20,
		alignItems: 'center'
	},
	saveModuleTitle: {
		fontSize: 20,
    	color: 'white',
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
	},
	textInput: { 
		height: 40,
		minWidth: 200, 
		borderRadius: 30, 
		backgroundColor: '#623231',
		color: 'white',
		paddingHorizontal: 20,
		textAlign: 'center'
	}

})