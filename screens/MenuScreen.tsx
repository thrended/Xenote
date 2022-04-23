import * as React from 'react';
import 'react-native-gesture-handler';
import {   
    Button,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native';;
import { globalStyles } from '../app/styles/global';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

//const navigation = useNavigation();

const Menu = ({ navigation }: any) => {

    const pressDet = () => {
        //navigation.navigate('NoteDetails');
        //const navigation = useNavigation();
        navigation.navigate('NoteDetails');
    }

    console.log('Navigation', navigation.navigate);

    return (
        <View style={globalStyles.home}>
            <View style={[ { alignItems: 'center', justifyContent: 'center' } ]}>               
                <Text
                style={[globalStyles.titleMain, {fontSize: 32}]}
                > 
                    Welcome to Xenote !
                </Text>
            </View>

            <View style={[{flexDirection: 'row', justifyContent: 'space-around'}]} >
                <Pressable
                    onPress={() => navigation.push('main')}
                >
                    <View style={[globalStyles.button, {flexDirection: 'row', marginTop: 15, marginVertical: 15}]}>
                        <Text style={[globalStyles.buttonprio, {fontSize: 15}]}>
                            Notes
                        </Text>
                    </View>

                </Pressable>
                <Pressable
                    onPress={() => navigation.push('main')}
                >
                    <View style={[globalStyles.button, {flexDirection: 'row', marginTop: 15, marginVertical: 15}]}>
                        <Text style={[globalStyles.buttonprio, {fontSize: 15}]}>
                            Reminders
                        </Text>
                    </View>

                </Pressable>
            </View>
                <Text style={[{alignSelf: 'center', fontSize: 15}]}>
                     Below buttons aren't functional yet
                </Text>
            <View style={[globalStyles.modalIcon, {alignSelf: 'center', width: 80, marginVertical: 0, marginBottom: 15}]}>
                    <Octicons
                    name='checklist'
                    size={50}
                    style={{ ...globalStyles.modalToggle, ...globalStyles.modalClose }}
                    onPress={() => navigation.push('TabOne')}
                    />
            </View>

            <View style={[{flexDirection: 'row', justifyContent: 'space-around'}]} >

                <View style={[globalStyles.modalIcon, {width: 80, flexDirection: 'row'}]}>
                    <Foundation
                    name='clipboard-notes'
                    size={40}
                    style={{ ...globalStyles.modalToggle, ...globalStyles.modalClose }}
                    onPress={() => navigation.push('TabTwo')}
                    />
                </View>

                <View style={[globalStyles.modalIcon, {width: 80, flexDirection: 'row'}]}>
                    <MaterialCommunityIcons
                    name='reminder'
                    size={40}
                    style={{ ...globalStyles.modalToggle, ...globalStyles.modalClose }}
                    onPress={() => navigation.push('TabTwo')}
                    />
                </View>

                <View style={[globalStyles.modalIcon, {width: 80, flexDirection: 'row'}]}>
                    <MaterialIcons
                    name='timer'
                    size={40}
                    style={{ ...globalStyles.modalToggle, ...globalStyles.modalClose }}
                    onPress={() => navigation.push('TabThree')}
                    />
                </View>

            </View>

            <View style={[globalStyles.modalIcon, {alignSelf: 'center', marginBottom: 15, marginTop: 15}]}>
                    <MaterialIcons
                    name='explore'
                    size={40}
                    style={{ ...globalStyles.modalToggle, ...globalStyles.modalClose }}
                    onPress={() => navigation.push('Template')}
                    />
            </View>

            {/* <Pressable
                onPress={() => navigation.push('Template')}
            >
                <View style={[globalStyles.button, {flexDirection: 'row', marginBottom: 35, marginTop: 25}]}>
                    <Text style={[globalStyles.buttonprio, {fontSize: 15}]}>
                        Browse Templates
                    </Text>
                </View>

            </Pressable> */}

            <Pressable
                onPress={() => navigation.push('Root')}
            >
                <View style={[globalStyles.button, {width: 250, flexDirection: 'row', marginBottom: 25, marginVertical: 15}]}>
                    <Text style={[globalStyles.buttonprio, {fontSize: 15}]}>
                        View Bottom Tab Menu
                    </Text>
                </View>

            </Pressable>

            <View style={[{flexDirection: 'row', justifyContent: 'space-around'}]} >
                <View style={globalStyles.modalIcon}>
                    <Feather
                    name='settings'
                    size={24}
                    style={{ ...globalStyles.modalToggle, ...globalStyles.modalClose }}
                    //onPress={() => setModalOpen(!modalOpen)}
                    />
                </View>
                <Pressable
                    onPress={() => navigation.push('Root')}
                >
                    <View style={[globalStyles.button, {marginHorizontal: 15, marginVertical: 15}]}>
                        <Text style={[globalStyles.buttonprio, {fontSize: 15}]}>
                            About Us
                        </Text>
                    </View>

                </Pressable>
            </View>

        </View>
    );
};

export default Menu;