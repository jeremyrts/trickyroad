import React, { Component } from 'react'
import { StyleSheet, View, Text, SafeAreaView, ImageBackground, TouchableOpacity, AsyncStorage } from 'react-native';
import { Cache } from "react-native-cache"
import base from '../base'

export default class Ladder extends Component {
	state = {
		bestScores: [],
		cache: null, 
		user: null
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
				const displaySize = 8
				let scores = data.sort((a,b) => a.bestScore.value > b.bestScore.value)

				let myScorePos = null
				for(let i = 0; i < scores.length; i++) {
					if(scores[i].bestScore.user === this.state.user) {
						myScorePos = i
						break
					}
				}

				if(scores.length > displaySize) {
					if(myScorePos < displaySize) {
						scores = scores.slice(0, displaySize)
					} else {
						const myScore = scores[myScorePos]
						scores = [...scores.slice(0,displaySize-1), myScore]
						myScorePos = displaySize-1
					}
				}

				this.setState({...this.state, bestScores: scores.reduce((acc, score, index) => {
					let styles = [ladder.item]
					
					if(index === myScorePos){
						styles.push(ladder.myScore)
					}
					let date = new Date(0)
					date.setSeconds(parseInt(score.bestScore.value)) // specify value for SECONDS here
					let timeString = date.toISOString().substr(14, 5)

					return [...acc, <View><Text style={styles}>{score.bestScore.user}</Text><Text style={[...styles,ladder.time]}>{timeString}</Text></View>]
				}, [])}) 
			}	
		});
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
							<View style={ladder.infosValue}>
								{/* Module à part pour récupérer les couples pseudo/scores */}
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
	}

})