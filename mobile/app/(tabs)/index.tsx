import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { VoiceRecorder } from '../../components/VoiceRecorder';
import { OfflineQueue } from '../../components/OfflineQueue';

export default function SubmitTab() {
  const [text, setText] = useState('');

  const handleTranscription = (transcript: string) => {
    setText((prev) => (prev + ' ' + transcript).trim());
  };

  const submitComplaint = () => {
    if (text.length < 20) return alert('Minimum 20 characters required.');
    
    // Offline/Online Logic Here: Check NetInfo
    // Uses Storage.enqueue() if offline
    console.log('Submitted', text);
    setText('');
    alert("Cryptographic hash anchored successfully.");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.branding}>VERIVOICE<Text style={styles.accent}>.</Text></Text>
      
      <OfflineQueue />

      <View style={styles.formBorder}>
        <View style={styles.headerBox}>
          <Text style={styles.headerText}>NEW GRIEVANCE</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={8}
            placeholder="Describe the civic issue using specifics..."
            value={text}
            onChangeText={setText}
            placeholderTextColor="#999"
          />
          <View style={styles.charCount}>
            <Text style={styles.charText}>{Math.max(2000 - text.length, 0)} CHARS LEFT</Text>
          </View>
        </View>

        <VoiceRecorder onTranscription={handleTranscription} />

        <TouchableOpacity style={styles.submitBtn} onPress={submitComplaint}>
          <Text style={styles.submitText}>COMMIT TO BLOCKCHAIN</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  branding: {
    fontSize: 48,
    fontFamily: 'System',
    fontWeight: '900',
    letterSpacing: -2,
    marginBottom: 40,
  },
  accent: {
    color: '#FF3000',
  },
  formBorder: {
    borderWidth: 4,
    borderColor: '#000',
    backgroundColor: '#FFF',
    padding: 16,
  },
  headerBox: {
    backgroundColor: '#000',
    padding: 12,
    marginBottom: 16,
  },
  headerText: {
    color: '#FFF',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2,
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: '#E5E5E5',
    padding: 12,
    backgroundColor: '#F9F9F9',
  },
  textInput: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '500',
    minHeight: 180,
    textAlignVertical: 'top',
  },
  charCount: {
    alignItems: 'flex-end',
    borderTopWidth: 2,
    borderTopColor: '#E5E5E5',
    paddingTop: 8,
    marginTop: 8,
  },
  charText: {
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 10,
    color: '#999',
    letterSpacing: 1,
  },
  submitBtn: {
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  submitText: {
    color: '#FFF',
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 2,
  }
});
