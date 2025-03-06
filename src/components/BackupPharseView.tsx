import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

interface BackupPhraseViewProps {
  phrase: string;
  onConfirm: () => void;
}

const BackupPhraseView: React.FC<BackupPhraseViewProps> = ({ phrase, onConfirm }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Ваша резервная фраза:</Text>
    <View style={styles.phraseContainer}>
      {phrase.split(' ').map((word, index) => (
        <View key={index} style={styles.wordContainer}>
          <Text style={styles.word}>{word}</Text>
        </View>
      ))}
    </View>
    <Text style={styles.warning}>
      Пожалуйста, запишите эту фразу и храните ее в надежном месте. Без нее вы не сможете восстановить свой кошелек.
    </Text>
    <Button title="Я записал фразу" onPress={onConfirm} />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  phraseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  wordContainer: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    margin: 4,
    borderRadius: 4,
  },
  word: {
    fontSize: 16,
  },
  warning: {
    fontSize: 14,
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default BackupPhraseView;
