import React, {Component} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Button,
	Alert,
	Platform,
	TextInput
} from 'react-native';



import { BleManager } from 'react-native-ble-plx';

import base64 from 'react-native-base64';



class SensorBluetooth extends Component {
	
	constructor(){
		super();
		this.manager = new BleManager()

		this.state = { 
			deviceConnected : null,
			connected : false,
			deviceId : 0,
			value: ''
		}
	}

	


	// componentDidMount() {
	// 	const subscription = this.manager.onStateChange((state) => {
	// 		if (state === 'PoweredOn') {
	// 			this.scanAndConnect();
	// 			subscription.remove();
	// 			// alert("Patate")
	// 		}
	// 	}, true);
	// }
	
	/*componentDidMount() {
		if (Platform.OS === 'ios') {
			this.manager.onStateChange((state) => {
			if (state === 'PoweredOn') this.scanAndConnect()
			})
		} else {
			this.scanAndConnect()
		}
	}*/

	scanAndConnect() {
		this.manager.startDeviceScan(null, null, (error, device) => {
			if (error) {
				// Handle error (scanning will be stopped automatically)
				console.log(error)
				return
			}
			// Check if it is a device you are looking for based on advertisement data
			// or other criteria.
			// if (device.id === 'A4:CF:12:32:19:9E') {
			// if (device.name === 'TrickyRoad') {
			if (device.name === 'TrickyRoad') {
				console.log("Found TrickyRoad bluetooth hotspot")
				// Stop scanning as it's not necessary if you are scanning for one device.
				this.manager.stopDeviceScan();

				// Proceed with connection.
				console.log("Connecting to "+device.name)
				device.connect()
				
    			.then((device) => {
        			return device.discoverAllServicesAndCharacteristics()
    			})
    			.then((device) => {
					console.log(device)
					/*device.writeCharacteristicWithoutResponseForService(
						0x1812,
						0x2A3D,
						"aGVsbG8gbWlzcyB0YXBweQ==",
					)
					.then((characteristic) => {
						return 
					})*/
				   // Do work on device with services and characteristics
					this.setState({deviceConnected : device})
					this.setState({deviceId: device.id})
					this.setState({connected: true})
				})
    			.catch((error) => {
					console.log(error)
    			});
			}
		});
	}

	sendMessage(text) {
		if(this.state.connected) {

			this.state.deviceConnected.writeCharacteristicWithoutResponseForService(
				"1812",
				"2A3D",
				base64.encode(text)
			)
				.then((characteristic) => {
					console.log('message send')
				})
		}
	}

	disconnect() {
		// this.state.deviceConnected.cancelConnection()
		this.manager.cancelDeviceConnection(this.state.deviceId)
			.then(this.setState({connected : false}))
			.then(this.setState({deviceConnected: null}))
			.then(this.setState({}))

	}

	onChangeText(text) {
		this.setState({value: text})
	}

	render() {
		console.log("ETAT CONNEXION : ", this.state.connected)
		console.log(this.props.value.left+','+this.props.value.top)
		this.sendMessage(Math.round(this.props.value.left)+','+Math.round(this.props.value.top))
		if(this.state.connected === false) {
			return (
				
				<SafeAreaView style={styles.container}>
	
					<View>
						<Button 
						onPress = {() => {
							this.scanAndConnect()
						}}
						title="Connect">
						</Button>
	
						<Button 
						onPress = {() => {
							this.disconnect()
						}}
						title="Disconnect !
						">
						</Button>
					</View>
				  </SafeAreaView>
			);
		}

		else {
			return (
				
				<SafeAreaView style={styles.container}>
	
					<View>
						<Button 
						onPress = {() => {
							this.scanAndConnect()
						}}
						title="Connect">
						</Button>
	
						<Button 
						onPress = {() => {
							this.disconnect()
						}}
						title="Disconnect !">
						</Button>
					</View>
				  </SafeAreaView>
			);
		}
	}
}


/*
<TextInput
style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
onChangeText={text => this.onChangeText(text)}
value={this.state.value}
/>
<Button 
onPress = {() => {
	this.sendMessage()
}}
title="SendMessage">
</Button>
*/
const styles = StyleSheet.create({
	container: {
	//   backgroundColor: '#a92a35',
	  padding: 5,
	},
	
	statusTrue: {
		backgroundColor: 'green',
		height: 100
	},
	statusFalse: {
		backgroundColor: 'red',
		height: 100
	}
})

export default SensorBluetooth;

