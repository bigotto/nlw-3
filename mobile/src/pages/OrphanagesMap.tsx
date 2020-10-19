import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import mapMarker from '../images/map-marker.png';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { or } from 'react-native-reanimated';

interface OrphanageItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function OrphanagesMap() {
    const [orphanages, setOrphanages] = useState<OrphanageItem[]>([]);
    const navigation = useNavigation();

    useFocusEffect(() => {
      api.get('orphanages').then(response => {
        setOrphanages(response.data);
      })
    }, []);

    function handleNavigateToOrphanageDetails(id: number) {
        navigation.navigate('OrphanageDetails', { id });
    }

    function handleNavigateToCreateOrphanage() {
      navigation.navigate('SelectMapPosition');
    }
    
    return (
        <View style={styles.container}>
      <MapView 
        style={styles.map} 
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: -20.471379,
          longitude: -54.59853,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008
        }} 
      >
        {orphanages.map(orphanage => {
          return (
            <Marker
              key={orphanage.id}
              icon={mapMarker}
              calloutAnchor={{
                x: 2.7,
                y: 0.8,
              }}
              coordinate={{
                latitude: orphanage.latitude,
                longitude: orphanage.longitude
              }}
          >
            <Callout tooltip onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}>
            <View style={styles.calloutContainer}>
              <Text style={styles.calloutText}>{orphanage.name}</Text>
            </View>
          </Callout>
        </Marker>
        );
        })}
      </MapView>

      <View style={styles.footer}>
          <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados </Text>

          <TouchableOpacity style={styles.createOrphanagesButton} onPress={handleNavigateToCreateOrphanage} >
            <Feather name="plus" size={20} color={'#FFF'} />
          </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    calloutContainer: {
      width: 160,
      height: 46,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 16,
      justifyContent: 'center'
  
    },
    calloutText: {
      color: '#0089a5',
      fontSize: 14,
      fontFamily: 'Nunito_700Bold',
    },
    footer:{
      position: 'absolute',
      left: 24,
      right: 24,
      bottom: 32,
      backgroundColor: '#FFF',
      borderRadius: 20,
      height: 56,
      paddingLeft: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    footerText: {
      fontFamily: 'Nunito_700Bold',
      color: '#8fa7b3'
    },
    createOrphanagesButton: {
      width: 56,
      height: 56,
      backgroundColor: '#15d3c6',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  