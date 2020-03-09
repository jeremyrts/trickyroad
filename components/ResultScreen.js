import React, { Component } from 'react'
import { StyleSheet, View, Text, SafeAreaView, ImageBackground, TouchableOpacity, TextInput, AsyncStorage } from 'react-native';
import FooterMenu from './FooterMenu'
import { Cache } from "react-native-cache"
import base from '../base'
import { withNavigation } from 'react-navigation';

class ResultScreen extends Component {
	state = { 
		user:null,
		score: this.props.navigation.state.params.score ? this.props.navigation.state.params.score : 1500 ,
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
			this.setState({...this.state, user: value})
		}.bind(this));
	}

	saveScore() {
		const pseudo = this.state.user
		const score = this.state.score
		const self = this
		if(!score) return

		base.fetch('users', {
			context: this,
			asArray: true,
			then(data){
			const users = data
			const present = users.filter((item) => item.key === pseudo)
			
			if(present.length === 0) {
				this.createUser()
			}
			else {
				base.update(`users/${pseudo}`, {
				data: {scores: [
					...present[0].scores,
					{
					date: new Date().toString(),
					value: score,
					user: pseudo
					}
					],
					bestScore: {
						date: new Date().toString(),
						value: present[0].bestScore > score ? present[0].bestScore : score,
						user: pseudo
					},
					lastGame: new Date().toString()
				},
				then(err){
					if(!err){
						self.props.navigation.navigate('Home')
					}
				}
				});
			}
			}
		});
	}

	createUser() {
		const score = this.state.score
		const pseudo = this.state.user
		const self = this

		if(this.state.user){
			if(!this.state.user.includes(' ')) {
				this.state.cache.setItem("pseudo", this.state.user, function(err) {
					if(err) { 
						console.log('error when add')
						return
					}
				
					base.post(`users/${pseudo}`, {
							data: {scores: [{
								date: new Date().toString(),
								value: score,
								user: pseudo
								}
							],
							bestScore: {
								date: new Date().toString(),
								value: score,
								user: pseudo
							},
							lastGame: new Date().toString()
						},
						then(err){
							if(!err){
								console.log('succesfully added')
								self.props.navigation.navigate('Home')
							}
						}
					})
			
				})
			}
			else {
				alert("Do not use space in the name")
			}
		}
		else {
			alert("Please fill in the text input")
		}
		this.textInput.clear()
	}

	parseScore() {
		let date = new Date(0)
		date.setSeconds(parseInt(this.state.score)) // specify value for SECONDS here
		return date.toISOString().substr(14, 5)
	}

	render() {
		const connectionForm = <View>
			<Text style={resultScreen.saveModuleTitle}> Connect you to save your score </Text>
			<TextInput style={resultScreen.textInput} 
				onChangeText={(user) => this.setState({user})} 
				value={this.state.text} 
				clearButtonMode="unless-editing" 
				ref={input => { this.textInput = input }} />
			</View>

		const test = <View></View>
		let {user} = this.state
		let inscriptionForm;
			if(user){
				inscriptionForm = test
			} else {
				inscriptionForm = connectionForm
			}
		if(this.props.navigation.state.params.won) {
			return (
				<SafeAreaView style={resultScreen.container}>
					<ImageBackground source={require('../assets/background.jpg')} style={resultScreen.background}>
						<View style={resultScreen.mainContainer}>
							<View style={resultScreen.infos}>
								<View style={resultScreen.title}>
									<Text style={resultScreen.titleValue}>Congratulations</Text>
									{/* Insérer le score obtenu */}
									<Text style={resultScreen.subtitleValue}>{this.parseScore()}</Text>
								</View>
								<View style={resultScreen.saveModule}>
									{inscriptionForm}
									<TouchableOpacity onPress={() => {
										this.state.user ? this.saveScore() : this.createUser()
										}} style={resultScreen.buttonModule}>
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
									<Text style={resultScreen.subtitleValue}>{this.parseScore()}</Text>
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
							{/* <View style={resultScthis.state.userreen.footer}>
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

export default withNavigation(ResultScreen);