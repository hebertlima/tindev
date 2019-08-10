import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';

import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';
import Swiper from 'react-native-deck-swiper';

import logo from '../assets/logo.png';
import itsmatch from '../assets/itsamatch.png';

export default function Main({ navigation }) {
    const loggedUserId = navigation.getParam('id');
    const [users, setUsers] = useState([]);
    const [matchUser, setMatchUser] = useState();

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/users', {
                headers: {
                    user: loggedUserId
                }
            })

            setUsers(response.data);
        }

        loadUsers();
    }, [loggedUserId]);

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: loggedUserId }
        });

        socket.on('match', user => {
            setMatchUser(user);
        });

    }, [loggedUserId]);

    async function handleLike() {
        const [user, ...rest] = users;

        await api.post(`/users/${user._id}/likes`, null, {
            headers: { user: loggedUserId }
        });

        setUsers(rest);
    }

    async function handleDislike() {
        const [user, ...rest] = users;

        await api.post(`/users/${user._id}/dislikes`, null, {
            headers: { user: loggedUserId }
        });

        setUsers(rest);
    }

    async function handleLoggout() {
        console.log('logout');
        await AsyncStorage.clear();
        navigation.navigate('Login');
    }

    renderCard = (user, index) => {
        if (!user) return (
            <View style={styles.cardsContainer}>
                <Text style={styles.empty}> Acabou :( </Text>
            </View>
        );
        return (
            <View style={[styles.myCard, { zIndex: users.length - index }]}>
                <Image style={styles.avatar} source={{ uri: user.avatar }} />
                <View style={styles.footer}>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.bio} numberOfLines={3}> {user.bio}</Text>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLoggout}>
                <Image style={styles.logo} source={logo} />
            </TouchableOpacity>
            <View style={styles.cardsContainer}>
                {users.length === 0
                    ? <Text style={styles.empty}> Acabou :( </Text>
                    : (
                        <Swiper cards={users}
                            useViewOverflow={false}
                            verticalSwipe={false}
                            showSecondCard={true}
                            renderCard={this.renderCard}
                            onSwipedLeft={() => handleDislike()}
                            onSwipedRight={() => handleLike()}
                            backgroundColor={'transparent'}
                            cardStyle={styles.card}
                            cardIndex={0}
                            stackSize={3}
                            stackSeparation={15}
                        />
                    )}
            </View>
            {matchUser && (
                <View style={styles.matchContainer}>
                    <Image style={styles.matchImage} source={itsmatch}></Image>

                    <Image style={styles.matchAvatar} source={{ uri: matchUser.avatar }}></Image>

                    <Text style={styles.matchName}>{matchUser.name}</Text>
                    <Text style={styles.matchBio}>{matchUser.bio}</Text>

                    <TouchableOpacity style={styles.matchButton} onPress={() => setMatchUser(null)}>
                        <Text style={styles.matchTextButton}>fechar</Text>
                    </TouchableOpacity>

                </View>
            )}
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    logo: {
        marginTop: 30
    },
    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500
    },
    myCard: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        margin: 38,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    avatar: {
        flex: 1,
        height: 300
    },
    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    name: {
        fontWeight: '700',
        fontSize: 16,
        color: '#333'
    },
    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18
    },
    empty: {
        fontSize: 32,
        color: '#999',
        fontWeight: '700',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    card: {
        marginTop: -60,
        backgroundColor: 'transparent'
    },
    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#fff',
        marginVertical: 30,
    },
    matchName: {
        fontSize: 26,
        fontWeight: '700',
        color: '#fff'
    },
    matchImage: {
        height: 60,
        resizeMode: 'contain'
    },
    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30
    },
    matchButton: {        
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginTop: 30,        
    },
    matchTextButton: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '700'
    }
});