import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, Button } from 'react-native'
import { BleManager } from "react-native-ble-plx"
import { omit, flattenDeep } from 'lodash/fp'
import rnBase64 from "react-native-base64"
import base64 from 'base64-js'
import { withNavigation } from 'react-navigation'

class BluetoothManager extends Component {
    constructor() {
        super()
        this.manager = new BleManager()
		this.state = {
			log: 'Start state',
			isSearching: false,
			canSearch: false,
			devices: [],
			device: null,
			subscriptions: [],
			characteristics: [],
			characteristicsMap: {
				'00002A19-0000-1000-8000-00805F9B34FB':
					{ title: 'TrickyRoad_Score', byteConverter: (arr) => {
                        let result = ""
                        for(let i = 0; i < arr.length; i++) {
                            result += String.fromCharCode(arr[i])
                        }
                        return result 
                    }},
			}
		}

		this.search = this.search.bind(this)
		this.stopSearch = this.stopSearch.bind(this)
		this.addDevice = this.addDevice.bind(this)
		this.log = this.log.bind(this)
		this.connectToDevice = this.connectToDevice.bind(this)
        this.disconnect = this.disconnect.bind(this)
    }

    componentDidMount() {
		const subscription = this.manager.onStateChange(state => {
			this.log(state)
			if (state === 'PoweredOn') {
				this.setState({ canSearch: true })
				this.search()
				subscription.remove()
			}
		}, true)
	}

	scanAndConnect() {
		this.log('start scanning')
		this.manager.startDeviceScan(null, null, (error, device) => {
			if (error) {
				this.log(error)
				return
			}
			if (device.name) {
				this.addDevice(device)
			}
		})
	}

	disconnect() {
		this.log(`disconnect from: ${this.state.device.device.name}`)
		this.manager.cancelDeviceConnection(this.state.device.device.id)
		this.setState({
			devices: [],
			device: null,
			subscriptions: [],
			characteristics: [],
		})
	}

	addDevice(device) {
		if (!this.state.devices.find(d => d.name === device.name)) {
			this.setState({ devices: this.state.devices.concat(device) })
		}
	}

	search() {
		this.setState({ isSearching: true })
		this.scanAndConnect()
	}

	stopSearch() {
		this.setState({ isSearching: false })
		this.manager.stopDeviceScan()
	}

	log(message) {
		this.setState({ log: `${message}\n${this.state.log}` })
	}

	connectToDevice(_device) {
		this.log(`connect to: ${_device.name}`)
		_device.connect()
			.then(device => {
				this.log(`connected to: ${_device.name}`)
				return device.discoverAllServicesAndCharacteristics()
			})
			.then(async device => {
				this.log(`get services for: ${_device.name}`)
				const services = await device.services()
				const characteristicsByService = await Promise.all(services.map(service => device.characteristicsForService(service.uuid)))
                
                const characteristics = flattenDeep(characteristicsByService)
					.filter(characteristic => {
                        console.log(characteristic.uuid.toUpperCase())
						return Object.keys(this.state.characteristicsMap).indexOf(characteristic.uuid.toUpperCase()) !== -1
					})

				const obj = {
					device,
					services,
					characteristics
				}

				characteristics.forEach(characteristic => {
					const subscription = device.monitorCharacteristicForService(
						characteristic.serviceUUID,
						characteristic.uuid,
						(_, char) => {
							if (char) {
								this.setState(state => {
									const characteristics = state.characteristics || {}
									const bytes = base64.toByteArray(char.value)
									const value = state.characteristicsMap[characteristic.uuid.toUpperCase()].byteConverter(bytes)

                                    characteristics[characteristic.uuid] = { bytes, value }
                                    
                                    this.props.navigation.navigate('ResultScreen', {
										score: value
									})
									return { characteristics }
								}, () => console.log(this.state))
							}
						}
					)
					this.setState((state) => ({
						subscriptions: [...state.subscriptions, subscription]
					}), () => console.log(this.state))
				})


				this.setState({ device: obj })
			})
    }
    
    sendMessage(text) {
		if(this.state.device !== null) {
			console.log("SendMessage " + text)

			return this.state.device.device.discoverAllServicesAndCharacteristics()
			.then(() => {
				this.state.device.device.writeCharacteristicWithoutResponseForService(
					"1812",
					"2A3D",
					rnBase64.encode(text)
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

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.log}>
					<Text>{this.state.log}</Text>
				</View>


				<View>
					{
						Object.keys(this.state.characteristics).map(char => <Text key={char}>{this.state.characteristicsMap[char.toUpperCase()].title}: {this.state.characteristics[char].value}</Text>)
					}
				</View>

				<View style={styles.connectButtons}>
					{this.state.devices.map((device, index) =>
						<Button
							title={device.name}
							key={index}
							onPress={() => { this.stopSearch(); this.connectToDevice(device); }}
						/>
					)}
				</View>

				<View style={styles.actions}>
					<Button
						containerViewStyle={{ width: '100%', marginLeft: 0 }}
						title="Search"
						style={styles.action}
						onPress={this.search}
						disabled={!this.state.canSearch || this.state.isSearching}
					/>
					<Button
						title="Stop Search"
						style={styles.action}
						onPress={this.stopSearch}
						disabled={!this.state.isSearching}
					/>
					<Button
						title="Stop Monitoring"
						style={styles.action}
						onPress={() => {
							this.state.subscriptions.forEach(subscription => subscription.remove());
							this.setState({ subscriptions: [] })
						}}
						disabled={!this.state.subscriptions.length}
					/>
					<Button
						title="Disconnect"
						style={styles.action}
						onPress={this.disconnect}
						disabled={!this.state.device}
					/>
                    <Button
						title="Send Data"
						style={styles.action}
						onPress={() => this.sendMessage("120,40")}
						disabled={!this.state.device}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	log: {
		flex: 1,
		padding: 20,
	},
	actions: {
		flex: 0,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		padding: 20,
	},
	action: {
		flex: 1,
		alignSelf: 'stretch',
		padding: 10,
	}
});


export default withNavigation(BluetoothManager)