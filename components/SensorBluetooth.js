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

	
	// async getServicesAndCharacteristicsForDevice(device) {
    //     var servicesMap = {}
    //     var services = await device.services()
    //     for (let service of services) {
    //         var characteristicsMap = {}
    //         var characteristics = await service.characteristics()

    //         for (let characteristic of characteristics) {
    //             characteristicsMap[characteristic.uuid] = {
    //                 uuid: characteristic.uuid,
    //                 isReadable: characteristic.isReadable,
    //                 isWritableWithResponse: characteristic.isWritableWithResponse,
    //                 isWritableWithoutResponse: characteristic.isWritableWithoutResponse,
    //                 isNotifiable: characteristic.isNotifiable,
    //                 isNotifying: characteristic.isNotifying,
    //                 value: characteristic.value
    //             }
    //         }

    //         servicesMap[service.uuid] = {
    //             uuid: service.uuid,
    //             isPrimary: service.isPrimary,
    //             characteristicsCount: characteristics.length,
    //             characteristics: characteristicsMap
    //         }
    //     }
    //     return servicesMap
    // }


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
				console.log("Connecting to "+device.name+" with id: "+device.id)
				device.connect()
    			.then((device) => {
					console.log("Recherche des services de du device qui a l'id: "+device.id)
        			return device.discoverAllServicesAndCharacteristics()
    			})
    			.then((device, services) => {
					// console.log(device)
					console.log("Stockage des infos dans le state device avec l'id: "+device.id)
					console.log(services)

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
				.then(() => {
					setInterval(this.getMessage.bind(this), 3000)
					console.log("Device id : "+this.state.deviceId)
				})
				.then(() => {
					return device.services()
				})
				.then((services) => {
					console.log("Les services")
					console.log(services)
				})
    			.catch((error) => {
					console.log(error)
    			});
			}
		});
	}

	sendMessage(text) {
		if(this.state.deviceConnected !== null) {
			console.log("SendMessage "+this.state.deviceId)

			return this.state.deviceConnected.discoverAllServicesAndCharacteristics()
			.then(() => {
				this.state.deviceConnected.writeCharacteristicWithoutResponseForService(
					"1812",
					"2A3D",
					base64.encode(text)
				)
				.then((characteristic) => {
					console.log('message send')
				})
				.catch((error) => {
					console.log("SEND Message 1")
					console.log(error)
				})
			})
			.catch((error) => {
				console.log("SEND Message 2")
				console.log(error)
			})
		}
	}

	getMessage() {
		console.log('YO CA MRCHE')
		if(this.state.deviceConnected !== null) {
			console.log("Get message ")
			return this.state.deviceConnected.monitorCharacteristicForService(
				"1812",
				"2A3D",
				(error, characteristic) => {
					console.log(error, characteristic)
				}
			)
		}
	}

	async setupNotifications(device) {
		let snifferService = null

		device.services().then(services => {
			let voltageCharacteristic = null

			snifferService = services.filter(service => service.uuid === SERVICE_SNIFFER_UUID)[0]
			snifferService.characteristics()
			.then(characteristics => {
				// voltageCharacteristic is retrieved correctly and data is also seems correct
				voltageCharacteristic = characteristics.filter(c => c.uuid === SNIFFER_VOLTAGE_UUID)[0]
				voltageCharacteristic.monitor((error, c) => {
				// RECEIVED THE ERROR HERE (voltageCharacteristic.notifiable === true)
				})
			})
			.catch(error => console.log(error))
		})
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

	componentDidMount() {
	}

	render() {
		console.log("ETAT CONNEXION : ", this.state.connected)
		this.sendMessage(Math.round(this.props.value.left)+','+Math.round(this.props.value.top))
		// if(this.state.connected === false) {
		// 	return (
				
		// 		<SafeAreaView style={styles.container}>
	
		// 			<View>
		// 				<Button 
		// 				onPress = {() => {
		// 					console.log('clicked')
		// 					this.scanAndConnect()
		// 				}}
		// 				title="Connect">
		// 				</Button>
	
		// 				<Button 
		// 				onPress = {() => {
		// 					this.disconnect()
		// 				}}
		// 				title="Disconnect !
		// 				">
		// 				</Button>
		// 			</View>
		// 		  </SafeAreaView>
		// 	);
		// }

		// else {
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
		// }
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

