<template>
    <div class="map-wrap">
      <div class="map" ref="mapContainer"></div>
    </div>
  </template>
  
  <script setup>
  import { Map, MapStyle, Marker, config, Popup, Point} from '@maptiler/sdk';
  import { shallowRef, onMounted, onUnmounted, markRaw, watch } from 'vue';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import '@maptiler/sdk/dist/maptiler-sdk.css';
  import { DeGaspari_, MartignanoZandonai_A, MartignanoZandonai_B, Mattarello_A, Mattarello_B, Mattarello_C, Meano_A, Meano_B, Meano_C, Nicolodi_A, Nicolodi_B, Nicolodi_C, Nicolodi_D, Pigarelli_A, Pigarelli_B, Pigarelli_C, Pigarelli_D, Savio_ } from './data/data_lines.js';
  import { getTextColor } from './utils/colorFunctions.js';

  const lines = [
    DeGaspari_,
    MartignanoZandonai_A,
    MartignanoZandonai_B,
    Mattarello_A,
    Mattarello_B,
    Mattarello_C,
    Meano_A,
    Meano_B,
    Meano_C,
    Nicolodi_A,
    Nicolodi_B,
    Nicolodi_C,
    Nicolodi_D,
    Pigarelli_A,
    Pigarelli_B,
    Pigarelli_C,
    Pigarelli_D,
    Savio_
  ];

  const mapContainer = shallowRef(null);
  const map = shallowRef(null);
  let marker;
  
 
  const props = defineProps({
    center: {
      type: Array,
      default: () => [11.150447, 46.046752]
    },
    zoom: {
      type: Number,
      default: 12
    },
    schoolName: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    }
  });

  function setCenterAndZoom() {
    const data = props.center;
    const center = { lat: data[1], lng: data[0]};
    const zoom = props.zoom;
    return { lat: center.lat, lng: center.lng, zoom: zoom };
  }

  function getRandomColor() {
  const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `#${red}${green}${blue}`;
}

function createMarker(){
  const center = setCenterAndZoom();

  if(marker){
    marker.remove();
  }

  const el = document.createElement('div');
  // Applica stili CSS per creare un div circolare
  el.style.width = '32px'; // Imposta la larghezza del div
  el.style.height = '32px'; // Imposta l'altezza del div
  el.style.borderRadius = '50%'; // Rendi il div circolare
  el.style.backgroundColor = props.color; // Imposta il colore di sfondo bianco
  el.style.display = 'flex'; // Utilizza il layout flexbox
  el.style.justifyContent = 'center'; // Centra l'icona orizzontalmente
  el.style.alignItems = 'center'; // Centra l'icona verticalmente
  el.style.border = '2px solid #000000'; // Aggiunge un bordo nero al div

  let textColor = getTextColor(props.color);
 
  // Imposta l'icona Material Design come contenuto dell'elemento
  el.innerHTML = `<i class="mdi mdi-school" style="font-size: 20px; color: ${textColor};"></i>`;

  marker = new Marker({element: el})
    .setPopup(new Popup().setText(props.schoolName))
    .setLngLat([center.lng, center.lat])
    .addTo(map.value);
  

  return marker;
}


  function addLinesToMap() {
    let id = 0;

    for (let line of lines) {


      map.value.addSource('route'+id, {
        'type': 'geojson',
        'data': line
      });

      map.value.addLayer({
        'id': 'route'+id,
        'type': 'line',
        'source': 'route'+id,
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': line.features[0].color,
          'line-width': 4
        }
      });

      id++;
    }
  }

  watch(() => props.center, () => {
    const center = setCenterAndZoom();
    // Aggiunta di un'animazione durante il cambio del centro della mappa
    map.value.flyTo({
      center: [center.lng, center.lat],
      zoom: center.zoom,
      duration: 2500, // Durata dell'animazione in millisecondi
      easing: (t) => t, // Funzione di easing per l'animazione
    });

    createMarker();
  });

  onMounted(() => {
    config.apiKey = 'NRQ1JpJfPZoVGBQhQCxP';   // --------------------------- API KEY --------------------------- 
    
    const initialState = setCenterAndZoom();
  
    map.value = markRaw(new Map({
      container: mapContainer.value,
      style: MapStyle.STREETS,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
      fullscreenControl: true,
      attributionControl: true,
    }));


    // new Marker({color: "#FF0000"})
    //     .setLngLat([11.150447, 46.066752])
    //     .addTo(map.value);


    map.value.on('load', function () {
        // Add a layer showing the state polygons.
        //const geojson = await maptilersdk.data.get('https://api.maptiler.com/data/a200af79-67fa-4a7d-9389-2dd0a929027e/features.json?key=NRQ1JpJfPZoVGBQhQCxP');
        addLinesToMap();
        createMarker();
    });
    

  });


  onUnmounted(() => {
    map.value?.remove();
  });

  </script>
  
  <style scoped>
  .map-wrap {
    position: relative;
    width: 100%;
    height: calc(100vh - 77px); /* calculate height of the screen minus the heading */
  }
  
  .map {
    position: relative;
    width: 100%;
    height: 100%;
  }
  </style>