import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Image, TextInput, TouchableOpacity, Text } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

import logo from '../assets/logo.png';

export default function Login({ navigation }) {
    const [user, setUser] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('id').then(id => {
            if (id) {
                navigation.navigate('Main', { id });
            }
        })
    }, []);

    async function handleLogin() {
        const response = await api.post('/users', { username: user });

        const { _id: id } = response.data;

        await AsyncStorage.setItem('id', id);

        navigation.navigate('Main', { id });
    }

    return (
        <KeyboardAvoidingView
            behavior="padding"
            enabled={Platform.OS === 'ios'}
            style={styles.container}>
            <Image source={logo} />

            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Github @username"
                placeholderTextColor="#999"
                style={styles.input}
                value={user}
                onChangeText={setUser}
            />

            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Logar</Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30
    },
    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15
    },
    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16
    }
});