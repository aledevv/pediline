<template>
  <v-container :style="{ maxHeight: height }" class="map-wrap" fluid>
    <div class="map" ref="mapContainer" style="height: 100%;"></div>
  </v-container>
</template>

<script setup>
import { Map, MapStyle, Marker, config, Popup } from '@maptiler/sdk';
import { shallowRef, onMounted, onUnmounted, markRaw, watch } from 'vue';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { DeGaspari_, MartignanoZandonai_A, MartignanoZandonai_B, Mattarello_A, Mattarello_B, Mattarello_C, Meano_A, Meano_B, Meano_C, Nicolodi_A, Nicolodi_B, Nicolodi_C, Nicolodi_D, Pigarelli_A, Pigarelli_B, Pigarelli_C, Pigarelli_D, Savio_, Moggioli_A, Moggioli_B, Trento3_A, Trento3_B, Trento3_C, Romagnano, SantAnna_A, SantAnna_B, SantAnna_C } from './data/data_lines.js';
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
  Savio_,
  Moggioli_A,
  Moggioli_B,
  Trento3_A,
  Trento3_B,
  Trento3_C,
  Romagnano,
  SantAnna_A,
  SantAnna_B,
  SantAnna_C
];

const mapContainer = shallowRef(null);
const map = shallowRef(null);
let marker;
let stopMarkers = [];

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
    default: '#000'
  },
  stops: {
    type: Array,
    default: () => []
  },
  height: {
    type: String,
    default: '100%'
  }
});

function setCenterAndZoom() {
  const data = props.center;
  const center = { lat: data[1], lng: data[0] };
  const zoom = props.zoom;
  return { lat: center.lat, lng: center.lng, zoom: zoom };
}

function getRandomColor() {
  const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `#${red}${green}${blue}`;
}

function createStopMarker(stop, stopEl) {
  console.log("stop", stop.position);
  let stopMarker = new Marker({ element: stopEl})
    .setPopup(new Popup().setHTML("<strong>" + stop.name + "</strong> <p>" + stop.schedule + "</p>"))
    .setLngLat([stop.position[1],stop.position[0]])//)
    .addTo(map.value);

  stopMarkers.push(stopMarker);
}

function createMarker() {
  if (props.center[0] == 11.150447 && props.center[1] == 46.046752) {
    return;
  }

  const center = setCenterAndZoom();

  // if (marker) {
  //   marker.remove();
  // }

  // if (stopMarkers.length > 0) {
  //   for (let stopMarker of stopMarkers) {
  //     stopMarker.remove();
  //   }
  //   stopMarkers = [];
  // }

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

  

  // Crea un nuovo marker per la scuola
  marker = new Marker({ element: el })
    .setPopup(new Popup().setText(props.schoolName))
    .setLngLat([center.lng, center.lat])
    .addTo(map.value);

  for (let stop of props.stops) {
    console.log("stop", stop);
    if(stop.name != 'Scuola'){
      const stopEl = document.createElement('div');
      stopEl.innerHTML = `<i class="mdi mdi-map-marker" style="font-size: 16px; color: ${textColor};"></i>`;
      stopEl.style.width = '24px'; // Imposta la larghezza del div
      stopEl.style.height = '24px'; // Imposta l'altezza del div
      stopEl.style.borderRadius = '50%'; // Rendi il div circolare
      stopEl.style.backgroundColor = props.color; // Imposta il colore di sfondo bianco
      stopEl.style.display = 'flex'; // Utilizza il layout flexbox
      stopEl.style.justifyContent = 'center'; // Centra l'icona orizzontalmente
      stopEl.style.alignItems = 'center'; // Centra l'icona verticalmente
      stopEl.style.border = '1px solid #000000'; // Aggiunge un bordo nero al div
      createStopMarker(stop, stopEl);
    }
  }

  return marker;
}

function addLinesToMap() {
  let id = 0;

  for (let line of lines) {
    map.value.addSource('route' + id, {
      'type': 'geojson',
      'data': line
    });

    map.value.addLayer({
      'id': 'route' + id,
      'type': 'line',
      'source': 'route' + id,
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
  height: calc(100vh - 77px); /* calcola l'altezza dello schermo meno l'intestazione */
}

.map {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
