import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ImageBackground, Image } from 'react-native';
import base from '../base'

export default class BadgeContainer extends Component {


    render() {
        return (
            <View style={badgeContainer.mainContainer}>
                <Text style={badgeContainer.titleBadges}>Badges</Text>
                <View style={badgeContainer.badgesContainer}>
                    <View style={badgeContainer.badgeCategory}>
                        <Text style={badgeContainer.categoryTitle}>Played games</Text>
                        <View style={badgeContainer.badgeList}>
                            <Image 
                                source = {require('../assets/badges/5parties.png')}
                                style={badgeContainer.badge}
                            />
                            <Image 
                                source = {require('../assets/badges/10parties.png')}
                                style={badgeContainer.badge}
                            />
                            <Image 
                                source = {require('../assets/badges/30parties.png')}
                                style={badgeContainer.badge}
                            />
                            <Image 
                                source = {require('../assets/badges/50parties.png')}
                                style={badgeContainer.badge}
                            />
                        </View>
                    </View>
                    <View style={badgeContainer.badgeCategory}>
                        <Text style={badgeContainer.categoryTitle}>Timer</Text>
                        <View style={badgeContainer.badgeList}>
                            <Image 
                                source = {require('../assets/badges/30s.png')}
                                style={badgeContainer.badge}
                            />
                            <Image 
                                source = {require('../assets/badges/1min.png')}
                                style={badgeContainer.badge}
                            />
                            <Image 
                                source = {require('../assets/badges/2min.png')}
                                style={badgeContainer.badge}
                            />
                            <Image 
                                source = {require('../assets/badges/3min.png')}
                                style={badgeContainer.badge}
                            />
                        </View>
                    </View>
                    <View style={badgeContainer.badgeCategory}>
                        <Text style={badgeContainer.categoryTitle}>Others</Text>
                        <View style={badgeContainer.badgeList}>
                            <Image 
                                source = {require('../assets/badges/1st_victory.png')}
                                style={badgeContainer.badge}
                            />
                            <Image 
                                source = {require('../assets/badges/Curieux.png')}
                                style={badgeContainer.badge}
                            />
                            <Image 
                                source = {require('../assets/badges/mode_gyro.png')}
                                style={badgeContainer.badge}
                            />
                            <Image 
                                source = {require('../assets/badges/mode_touch.png')}
                                style={badgeContainer.badge}
                            />
                        </View>
                    </View>
                </View>
            </View>   
        );
    }
}

const badgeContainer = StyleSheet.create({
    mainContainer: {
        marginTop: 30
    },
    badgesContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 30,
        width: '80%',
        marginTop: 15,
        marginLeft: '10%',
        padding: 20
    },
    titleBadges: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },
    badgeCategory: {
        height: 100
    },  
    badge: {
        width: 50,
        height: 50
    },
    badgeList: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    categoryTitle: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 18
    }
});
