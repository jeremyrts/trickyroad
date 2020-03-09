import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ImageBackground, ScrollView, Image, TouchableOpacity } from 'react-native';
import BadgeContainer from './BadgeContainer'
import base from '../base'

export default class PlayerInfos extends Component {

    state = { 
        player: this.props.navigation.state.params.player,
        infos: null,
        bestTime: null,
        lastPlay: null,
        lastScores: []
    }

    componentDidMount () { 
		this.getPlayerInfos()
	}

    getPlayerInfos() {
        base.fetch('users/'+this.state.player, {
			context: this,
			asArray: false,
			then(data){

                let sortedByDate = data.scores.sort((a, b) => {
                    const dateA = new Date(a.date)
                    const dateB = new Date(b.date)
                    return dateB - dateA
                })

                let scoresRender = sortedByDate.map((score) => {
                    return <View style={playerinfos.scoreContainer}>
                        <Text style={playerinfos.scoreDate}>{this.parseTime(score.date)}</Text>
                        <Text style={playerinfos.scoreValue}>{this.parseScore(score.value)}</Text>
                    </View>
                })

			    this.setState({
                    ...this.state, 
                    infos: data,
                    bestTime: this.parseScore(data.bestScore.value),
                    lastPlay: this.parseTime(data.lastGame),
                    lastScores: scoresRender
                })
			}	
		});
    }

    parseScore(value) {
        if(!value) return '--:--'
        let date = new Date(0)
        date.setSeconds(parseInt(value)) // specify value for SECONDS here
        return date.toISOString().substr(14, 5)
    }

    parseTime(date) {
        let playDate = new Date(date)
        return (playDate.getDate() < 10 ? '0'+ playDate.getDate() : playDate.getDate()) +'/'+ (playDate.getMonth()+1 < 10 ? '0'+(playDate.getMonth()+1) : playDate.getMonth()+1)
    }

    render() {
        return (
        <SafeAreaView style={playerinfos.container}>
            <ImageBackground source={require('../assets/background.jpg')} style={playerinfos.background}>
                <ScrollView>
                    <TouchableOpacity onPress={() => {
                        this.props.navigation.navigate('Ladder')
                    }} style={playerinfos.return}>
                        <Image 
                            source = {require('../assets/icons/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={playerinfos.infos}>
                        <View style={playerinfos.title}>
                            <Text style={playerinfos.titleValue}>{this.state.player}</Text>
                        </View>
                        <View style={playerinfos.globalInfosContainer}>
                            <View style={playerinfos.globalInfos}>
                                <Text style={playerinfos.mediumTitle}>Best Score</Text>
                                <Text style={playerinfos.yellowValue}>{this.state.bestTime}</Text>
                            </View>
                            <View style={playerinfos.globalInfos}>
                                <Text style={playerinfos.mediumTitle}>Last Game</Text>
                                <Text style={playerinfos.yellowValue}>{this.state.lastPlay}</Text>
                            </View>
                        </View>
                        <BadgeContainer></BadgeContainer>

						<View style={playerinfos.infos}>
							<View style={playerinfos.title}>
								<Text style={playerinfos.mediumTitle}>Last Scores</Text>
							</View>
							<View style={playerinfos.infosValue}>
                                {this.state.lastScores}
							</View>
						</View>
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
        );
    }
}

const playerinfos = StyleSheet.create({
    return: {
        position: 'absolute',
        top: 50,
        left: 50
    },
    background: {
        width: '100%', 
        height: '100%'
    },
    title: {
        margin: 30,
        position: 'relative'
    },
    titleValue: {
        fontSize: 50,
        color: 'white',
        fontWeight: 'bold',
        textAlign: "center"	
    },
    globalInfosContainer: {
        marginBottom: 30,
        flex:1,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        textAlign: 'center',
        position: 'relative'
    },
    globalInfos: {
        flex:1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    mediumTitle: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },
    yellowValue: {
        fontWeight: 'bold',
        color: '#FFF737',
        fontSize: 20
    },
    badgesContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 30,
        width: '80%',
        position: 'relative'
    },
    badgeCategory: {
    },  
    badge: {
        width: 50,
        height: 50
    },
	infosValue: {
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
        width: '80%',
        marginLeft: '10%',
        marginBottom: 30,
		padding: 30,
		borderRadius: 30,
    },
    scoreContainer: {
        marginBottom: 20
    },
    scoreDate: {
		fontSize: 18,
    	color: 'white'
    },
    scoreValue: {
        position: 'absolute',
		fontSize: 18,
    	color: 'white',
        right: 0,
		fontWeight: 'bold'
    }
});
