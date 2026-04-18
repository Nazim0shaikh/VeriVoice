import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>CAMERA PERMISSION REQUIRED</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarcodeScanned = ({ type, data }: any) => {
    setScannedData(data);
    // Real implementation would verify hash locally via Blockchain contract
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>VERIFY RECEIPT</Text>
      
      {!scannedData ? (
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scannedData ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        >
          <View style={styles.overlay}>
              <View style={styles.scanTarget}></View>
          </View>
        </CameraView>
      ) : (
        <View style={styles.resultContainer}>
           <Text style={styles.resultLabel}>SCANNED PAYLOAD</Text>
           <Text style={styles.resultText}>{scannedData}</Text>
           <TouchableOpacity style={styles.resetButton} onPress={() => setScannedData(null)}>
              <Text style={styles.resetText}>SCAN ANOTHER</Text>
           </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 20,
    paddingTop: 60,
  },
  headerText: {
    fontSize: 32,
    fontFamily: 'System',
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 20,
    borderBottomWidth: 4,
    borderBottomColor: '#000',
    paddingBottom: 8,
  },
  camera: {
    flex: 1,
    borderWidth: 4,
    borderColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanTarget: {
    width: 250,
    height: 250,
    borderWidth: 4,
    borderColor: '#FF3000',
    backgroundColor: 'transparent',
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 4,
    borderColor: '#000',
    padding: 24,
    justifyContent: 'center',
  },
  resultLabel: {
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '900',
    letterSpacing: 2,
    color: '#999',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    fontFamily: 'System',
    fontWeight: '700',
    marginBottom: 32,
  },
  resetButton: {
    backgroundColor: '#000',
    padding: 16,
    alignItems: 'center',
  },
  resetText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '900',
    letterSpacing: 2,
  }
});
