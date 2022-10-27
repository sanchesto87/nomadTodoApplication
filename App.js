import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useState} from "react";
import {Platform, Alert, StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import {theme} from "./color";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Fontisto} from '@expo/vector-icons';
// icons.expo.fyi
const STORAGE_KEY = "@toDos";

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const [toDos, setToDos] = useState({});
    useEffect(() => {
        loadTodo();
    }, []);

    const travel = () => setWorking(false);
    const work = () => setWorking(true);
    const onChangeText = (payload) => setText(payload);
    const saveTodo = async (toSave) => {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    };
    const loadTodo = async () => {
        const s = await AsyncStorage.getItem(STORAGE_KEY);
        setToDos(JSON.parse(s));
    }
    const addTodo = async () => {
        if (text === "") {
            return;
        }
        const newToDos = {...toDos, [Date.now()]: {text, working}};
        setToDos(newToDos);
        await saveTodo(newToDos);
        setText("");
    };
    const delTodo = async (key) => {
        if (Platform.OS === "web") {
            const ok = confirm("Do you want delete this To Do ?");
            if (ok) {
                const newToDos = {...toDos};
                delete newToDos[key];
                setToDos(newToDos);
                saveTodo(newToDos);
            }
        } else {
            Alert.alert("Delete To Do", "Are you sere?", [
                {text: "Cancel", style: "cancel"},
                {
                    text: "Ok",
                    style: "destructive",
                    onPress: () => {
                        const newToDos = {...toDos};
                        delete newToDos[key];
                        setToDos(newToDos);
                        saveTodo(newToDos);
                    }
                }
            ]);
        }
    }
    console.log(toDos);

    return (
        <View style={styles.container}>
            <StatusBar style="auto"/>
            <View style={styles.header}>
                <TouchableOpacity onPress={work}>
                    <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={travel}>
                    <Text style={{...styles.btnText, color: !working ? "white" : theme.grey}}>Travel</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TextInput style={styles.input}
                           placeholder={working ? "Add a To Do" : "where do you want go?"}
                           returnKeyType="done"
                           onChangeText={onChangeText}
                           onSubmitEditing={addTodo}
                           value={text}
                />
                <ScrollView>
                    {Object.keys(toDos).map((key) => (
                        toDos[key].working === working ?
                            <View style={styles.toDo} key={key}>
                                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                                <View style={styles.btnView}>
                                    <TouchableOpacity style={styles.btn} onPress={() => delTodo(key)}>
                                        <Fontisto name="trash" size={20} color="white"/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.btn} onPress={() => delTodo(key)}>
                                        <Fontisto name="trash" size={20} color="white"/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.btn} onPress={() => delTodo(key)}>
                                        <Fontisto name="trash" size={20} color="white"/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            : null
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.bg,
        paddingHorizontal: 20,
    },
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 100,
    },
    btnText: {
        fontSize: 44,
        fontWeight: "600",
        color: "white",
    },
    input: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginVertical: 20,
        fontSize: 20,
    },
    toDo: {
        backgroundColor: theme.grey,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

    },
    toDoText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500"
    },
    btnView: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginRight: -30,
    },
    btn: {
      paddingHorizontal: 10,
    },
});
