// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as Papa from 'papaparse';
import imageMap from '../assets/imageMap';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const [terms, setTerms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = async () => {
    try {
      const csvAsset = Asset.fromModule(require('../assets/terms.csv'));
      await csvAsset.downloadAsync();
      const csv = await FileSystem.readAsStringAsync(csvAsset.localUri);
      const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
      setTerms(parsed.data || []);
    } catch (err) {
      console.error('Error loading CSV:', err);
    }
  };

  const currentLetter = alphabet[currentIndex];
  const currentTerm = terms.find(t => t.Letter === currentLetter);

  const goPrev = () => {
    setCurrentIndex(prev => (prev === 0 ? alphabet.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex(prev => (prev === alphabet.length - 1 ? 0 : prev + 1));
  };

  const getImageSource = (imgPath) => {
    if (!imgPath) return imageMap['placeholder.png'];
    const filename = String(imgPath).split(/[\\/]/).pop();
    return imageMap[filename] || imageMap['placeholder.png'];
  };

  const handleScreenPress = (event) => {
    const touchX = event.nativeEvent.locationX;
    if (touchX < screenWidth / 2) {
      goPrev();
    } else {
      goNext();
    }
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={handleScreenPress}>
      {currentTerm ? (
        <>
          <Text style={styles.letter}>{currentTerm.Letter}</Text>
          <Image source={getImageSource(currentTerm.ImgPath)} style={styles.image} />
          <Text style={styles.name}>{currentTerm.Name}</Text>
          <Text style={styles.category}>{currentTerm.Category}</Text>
        </>
      ) : (
        <Text style={styles.noTerm}>No term available</Text>
      )}
    </TouchableOpacity>
  );
}

// --- styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  letter: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  name: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 20,
    color: '#555',
    marginBottom: 20,
  },
  noTerm: {
    fontSize: 18,
    color: 'gray',
  },
});
