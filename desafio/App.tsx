import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import Sound from 'react-native-sound';

interface Audio {
  filename: string;
}

const App: React.FC = () => {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState<Sound | null>(null);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    fetchAudios();
  }, []);

  const fetchAudios = async () => {
    try {
      setLoading(true);
      setTimeout(async () => {
        const response = await axios.get<string[]>(
          'http://10.0.2.2:8000/api/audios',
        );
        const audioData = response.data.map(filename => ({filename}));
        setAudios(audioData);
        setShowLoading(false);
        setLoading(false);
      }, 3000); // Simulate longer loading time with a 3-second delay
    } catch (error) {
      console.error('Error fetching audios:', error);
    }
  };

  const playAudio = (filename: string) => {
    console.log('playing audio');
    setLoading(true);
    if (sound && currentAudio !== filename) {
      sound.stop();
      sound.release();
      setCurrentAudio(null);
    }
    console.log(`Loading audio file: ${filename}`);
    const audio = new Sound(
      `http://10.0.2.2:8000/api/audios/${filename}`,
      null,
      error => {
        setLoading(false);
        if (error) {
          console.log('Error loading audio:', error);
          return;
        }
        setSound(audio);
        setCurrentAudio(filename);
        audio.play(success => {
          if (success) {
            console.log('Audio played successfully');
          } else {
            console.log('Error playing audio');
          }
          audio.release();
          setSound(null);
          setCurrentAudio(null);
        });
      },
    );
    console.log('Sound object created');
  };

  const pauseAudio = () => {
    if (sound) {
      sound.pause();
    }
  };

  return (

    <SafeAreaView>

      {showLoading ? (
        <View
          style={{
          zIndex: 1,
          position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            margin:120,
           paddingVertical: 200,
          }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{marginTop: 16, fontSize: 24}}>Calm Sounds</Text>
        </View>
      ) : (
        <FlatList
          data={audios}
          renderItem={({item}) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}>
              <Text style={{flex: 1}}>{item.filename.toString()}</Text>
              {currentAudio === item.filename ? (
                <Button title="Pause" onPress={pauseAudio} />
              ) : (
                <Button title="Play" onPress={() => playAudio(item.filename)} />
              )}
            </View>
          )}
          keyExtractor={item => item.filename}
        />
      )}
    </SafeAreaView>
  );
};

export default App;
