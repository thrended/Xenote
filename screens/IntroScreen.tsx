import React from 'react';
import { StyleSheet, Button, Image, Text, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import App from "../App";
import { globalStyles } from "../app/styles/global";


const slides = [
  {
    key: 'one',
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: require('../images/1.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 'two',
    title: 'Title 2',
    text: 'Other cool stuff',
    image: require('../images/3.png'),
    backgroundColor: '#febe29',
  },
  {
    key: 'three',
    title: 'Rocket guy',
    text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
    image: require('../images/2.png'),
    backgroundColor: '#22bcb5',
  }
];



export default class AppIntro extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showRealApp: false
          }
    }

  _renderItem = ({ item }: any) => {
    return (
      <View style={globalStyles.slide}>
        <Text style={globalStyles.titleText}>{item.title}</Text>
        <Image source={item.image} />
        <Text style={globalStyles.titleText}>{item.text}</Text>
      </View>
    );
  }
  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.setState({ showRealApp: true });
  }

  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Button        />
      </View>
    );
  };

  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="md-checkmark"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };

  render() {
    if (this.state.showRealApp) {
      return <App />;
    } else {
      return <AppIntroSlider 
      renderItem={this._renderItem} 
      data={slides} 
    //   onDone={this._onDone}/>;
      renderDoneButton={this._renderDoneButton}
      renderNextButton={this._renderNextButton}
      />
    }
  }
}