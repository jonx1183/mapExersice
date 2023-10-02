import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapView, {Marker}  from 'react-native-maps';
import { useState, useRef, useEffect } from 'react';
import * as Location from 'expo-location';
export default function App() {

const [markers, setMarkers] = useState([])  
const [region, setRegion] = useState({
  latitude:55,
  longitude:12,
  latitudeDelta:20,
  longitudeDelta:20

})

const mapView = useRef(null)
const locationSubscription = useRef(null)

useEffect(() => {
  async function startListening(){
    let { status} = await Location.requestForegroundPermissionsAsync()
    if(status !=='granted'){
      alert("Can not access lacation")
      return
    }
     locationSubscription.current = await Location.watchPositionAsync({
      distanceInterval: 100,
      accuracy: Location.Accuracy.High
     }, (lokation) =>{
      const newRegion = {
        latitude:lokation.coords.latitude,
        longitude:lokation.coords.longitude,
        latitudeDelta:20,
        longitudeDelta:20
      }
      setRegion(newRegion)
      if(mapView.current){
        mapView.current.animateToRegion(newRegion)
      }
     })
  }
  startListening()
  return () => {
    if(locationSubscription.current){
      locationSubscription.current.remove()
    }
  }
}, [])

function addMarker(data){
  const {latitude, longitude} = data.nativeEvent.coordinate
  const newMarker = {
    coordinate: {latitude, longitude},
    key: data.timeStamp,
    title: "Nepu nepu!"
  }
  setMarkers([...markers, newMarker])
}

function onMarkerPressed(text){
  alert("You pressed: " + text)
}

  return (
    <View style={styles.container}>
      <MapView 
      style={styles.map}
      region={region}
      onLongPress={addMarker}
      >
        {markers.map(marker => (
          <Marker
             coordinate={marker.coordinate}
             key={marker.key}
             title={marker.title}
             onPress={() => onMarkerPressed(marker.title)}
          />
        ))

        }
        

      </MapView>
  
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%'
  },
});
