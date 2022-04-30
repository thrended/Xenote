import React from 'react';
import colors from './colors';
import {
  Image,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

export const globalStyles = StyleSheet.create({
    authorText: {
        color: colors.strong,
        fontSize: 16
    },
    button:  {
        width: 150,
        height: 50,
        fontSize: 20,
        backgroundColor: '#25f2f5',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    buttonprio: {
        padding: 10,
    },
    containerdefault: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8
    },
    containerTitle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        // flex: 1,
        paddingTop: 0,
        paddingHorizontal: 0,
    },
    header: {
      fontSize: 32,
      backgroundColor: '#fff',
    },
    home: {
        //flex: 1,
        padding: 30,

    },
    image :  {
        width: 200,
        height: 200,
        margin: 10,
        resizeMode:'contain',
      },
    item: {
      backgroundColor: '#a3e7ff',
      padding: 20,
      marginVertical: 8,
    },
    list: {
        // flex: 1,
    },
    modalClose: {
        marginTop: 0,
        marginBottom: 0,
    },
    modalContent: {
        flex: 1,
    },
    modalIcon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalToggle: {
        borderWidth: 1,
        borderColor: '#f2f2f2',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center',
        marginVertical: 4
    },
    multibutton: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 10,
        paddingBottom: 10,
    },
    note: {
        color: '#369aaa',
        flex: 1,
        flexDirection: "row",
        padding: 15,
        marginTop: 4,
        borderColor: '#aad',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 12,
    },
    noteFields: {
        flex: 1,
        flexDirection: "column"
    },
    screen: {
        flex: 1,
        backgroundColor: colors.white,
    },
    separatorH: {
        marginHorizontal: 25,
        height: 1,
        width: '80%',
    },
    separatorV: {
        marginVertical: 25,
        height: 1,
        width: '80%',
    },
    swipesGestureContainer:{
        height:'100%',
        width:'100%'
    },
    switchContainer: {
        flexDirection: "row", 
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center"
    },
    title: {
      fontSize: 24,
    },
    titleMain: {
        color: colors.dark,
        fontSize: 24,
        fontWeight: 'bold',
    },
    titleSmall: {
        fontSize: 15,
        alignSelf: 'center',
    },
    titleText: {
        color: colors.dark,
        fontSize: 24
    }
});