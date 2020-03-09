import React, { Component } from 'react'
import { StyleSheet, View, Text, SafeAreaView, ImageBackground, TouchableOpacity, AsyncStorage, TextInput, Dimensions } from 'react-native';
import { Cache } from "react-native-cache"
import base from '../base'
import { withNavigation } from 'react-navigation'
import { stringLiteral } from '@babel/types';

class Ladder extends Component {
	state = {
		bestScores: [],
		cache: null, 
		user: null,
		allBestScores: [],
		displaySize: 8,
		searchResult: []
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
		this.getScores()
	}

	getScores() {
		base.fetch('users', {
			context: this,
			asArray: true,
			then(data){
				let scores = data.sort((a,b) => a.bestScore.value > b.bestScore.value)
				let scoresCpy = [...scores]

				let myScorePos = null
				for(let i = 0; i < scores.length; i++) {
					if(scores[i].bestScore.user === this.state.user) {
						myScorePos = i
						break
					}
				}
				this.setState({
					...this.state,
					allBestScores: scoresCpy
				})
				this.setState({
					...this.state, 
					bestScores: this.parseScores(scores, myScorePos),
				}) 
			}	
		});
	}

	parseScores(scores, myScorePos) {
		const self = this
		if(scores.length > this.state.displaySize) {
			if(myScorePos < this.state.displaySize) {
				scores = scores.slice(0, this.state.displaySize)
			} else {
				const myScore = scores[myScorePos]
				scores = [...scores.slice(0,this.state.displaySize-1), myScore]
				myScorePos = this.state.displaySize-1
			}
		}
		return scores.reduce((acc, score, index) => {
			let styles = [ladder.item]
			
			if(index === myScorePos){
				styles.push(ladder.myScore)
			}
			let date = new Date(0)
			date.setSeconds(parseInt(score.bestScore.value)) // specify value for SECONDS here
			let timeString = date.toISOString().substr(14, 5)
			return [...acc, <View>
				<TouchableOpacity onPress={() => {
					this.props.navigation.navigate('PlayerInfos', {
						player: score.bestScore.user
					})
				}}>
				<Text style={styles}>{self.state.allBestScores.indexOf(score) + 1 } - {score.bestScore.user}</Text><Text style={[...styles,ladder.time]}>{timeString}</Text>
			</TouchableOpacity>
				
			</View>]
		}, [])
	}

	searchPlayer(text) {
		console.log(this.state.allBestScores)
		console.log('+++++++++++++++++++++')
		const resArr = this.state.allBestScores.filter((score) => {
			return score.bestScore.user.toUpperCase().includes(text.toUpperCase())
		})
		console.log(this.state.allBestScores)

		let myScorePos = null
		for(let i = 0; i < resArr.length; i++) {
			if(resArr[i].bestScore.user === this.state.user) {
				myScorePos = i
				break
			}
		}

		this.setState({
			...this.state,
			bestScores: this.parseScores(resArr, myScorePos)
		})
		
	}

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
							<View>
								<TextInput 
									style={ladder.search} 
									onChangeText={text => this.searchPlayer(text)} 
									placeholder='Search a player...'
									//value='{this.state.search}' 
									// clearButtonMode="unless-editing" 
									// ref={input => { this.textInput = input }} 
								/>
							</View>
							<View style={ladder.infosValue}>
								{this.state.bestScores}
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
		fontWeight: 'bold'

	},
	time: {
		position: "absolute",
		right: 0,
		fontWeight: 'normal'
	},
	myScore: {
		color: '#FFF737'
	},
	search: {
		position: 'relative',
		padding: 10,
		width: '80%',
		borderRadius: 30, 
		backgroundColor: '#623231',
		color: 'white',
		textAlign: 'center',
		marginBottom: 30,
		width: Dimensions.get('window').width * 0.8
	}

})

export default withNavigation(Ladder)