import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Mic, Square } from 'lucide-react-native';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscription }) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setRecording(null);
    setIsProcessing(true);

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      
      if (!uri) throw new Error("No audio URI generated");
      
      // MOCK: Sending audio to backend for Whisper Transcription
      // In production: Use FormData to send file to Next.js API /api/transcribe
      console.log('Sending audio to Whisper API', uri);
      
      // Mocking transcription delay & response to keep demo stable
      setTimeout(() => {
        onTranscription("[MOCK TRANSCRIPT] The streetlights on 5th Avenue have been broken for 3 weeks, creating a major safety hazard at night.");
        setIsProcessing(false);
      }, 2000);
      
    } catch (error) {
      console.error('Transcription failed:', error);
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {isProcessing ? (
        <View style={styles.processingBadge}>
           <Text style={styles.processingText}>ANALYZING AUDIO...</Text>
        </View>
      ) : (
        <TouchableOpacity 
          style={[styles.button, recording ? styles.buttonActive : {}]} 
          onPress={recording ? stopRecording : startRecording}
        >
          {recording ? <Square color="#FFF" size={24} /> : <Mic color="#000" size={24} />}
          <Text style={[styles.text, recording ? styles.textActive : {}]}>
            {recording ? 'STOP RECORDING' : 'DICTATE'}
          </Text>
        </TouchableOpacity>
      )}

      {recording && (
        <View style={styles.waveformPlaceholder}>
           <View style={[styles.bar, {height: 20}]}></View>
           <View style={[styles.bar, {height: 40}]}></View>
           <View style={[styles.bar, {height: 15}]}></View>
           <View style={[styles.bar, {height: 45}]}></View>
           <View style={[styles.bar, {height: 30}]}></View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 4,
    borderColor: '#000',
    backgroundColor: '#FFF',
  },
  buttonActive: {
    backgroundColor: '#FF3000',
    borderColor: '#FF3000',
  },
  text: {
    marginLeft: 12,
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 2,
    color: '#000',
  },
  textActive: {
    color: '#FFF',
  },
  waveformPlaceholder: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    marginTop: 16,
    gap: 4,
  },
  bar: {
    width: 6,
    backgroundColor: '#FF3000',
  },
  processingBadge: {
    padding: 16,
    backgroundColor: '#F2F2F2',
    borderWidth: 4,
    borderColor: '#000',
    alignItems: 'center'
  },
  processingText: {
    fontFamily: 'System',
    fontWeight: '900',
    letterSpacing: 2,
  }
});
