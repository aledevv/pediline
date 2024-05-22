<template>
    <div class="map-wrap">
      <div class="map" ref="mapContainer"></div>
    </div>
  </template>
  
  <script setup>
  import { Map, MapStyle, Marker, config} from '@maptiler/sdk';
  import { shallowRef, onMounted, onUnmounted, markRaw } from 'vue';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import '@maptiler/sdk/dist/maptiler-sdk.css';
  
  import { martignano } from './data/linea.js';



  const mapContainer = shallowRef(null);
  const map = shallowRef(null);
  
  onMounted(() => {
    config.apiKey = 'NRQ1JpJfPZoVGBQhQCxP';
    
    const initialState = { lng: 11.1210800, lat: 46.0678700, zoom: 14 };
  
    map.value = markRaw(new Map({
      container: mapContainer.value,
      style: MapStyle.STREETS,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    }));


    new Marker({color: "#FF0000"})
        .setLngLat([11.150447, 46.066752])
        .addTo(map.value);

    

    map.value.on('load', function () {
        // Add a layer showing the state polygons.
        //const geojson = await maptilersdk.data.get('https://api.maptiler.com/data/a200af79-67fa-4a7d-9389-2dd0a929027e/features.json?key=NRQ1JpJfPZoVGBQhQCxP');
        map.value.addSource('route', {
            'type': 'geojson',
            'data': martignano
        });

        //then add the layer to the map. Display the "route" source data
        map.value.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#FF905D',
                'line-width': 6
            }
        });
    });
    //first add the source with the "route" id to the map

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
    position: absolute;
    width: 100%;
    height: 100%;
  }
  </style>