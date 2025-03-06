import React, { useState, FC } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

interface WelcomeScreenProps {
    onCreate: () => void;
    onRestore: (mnemonic: string) => void;
}

const WelcomeScreen: FC<WelcomeScreenProps> = ({ onCreate, onRestore }) => {
    const [mnemonic, setMnemonic] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Добро пожаловать в кошелек!</Text>
            <Button title="Создать новый кошелек" onPress={onCreate} />
            <Text style={styles.or}>ИЛИ</Text>
            <TextInput
                style={styles.input}
                placeholder="Введите мнемоническую фразу"
                value={mnemonic}
                onChangeText={setMnemonic}
                multiline
            />
            <Button
                title="Восстановить кошелек"
                onPress={() => onRestore(mnemonic)}
                disabled={!mnemonic.trim()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 32,
        textAlign: 'center',
    },
    or: {
        marginVertical: 16,
        fontSize: 16,
    },
    input: {
        height: 100,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        textAlignVertical: 'top',
    },
});



export default WelcomeScreen;
