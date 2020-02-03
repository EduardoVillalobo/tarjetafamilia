import React, { Fragment, useState, useEffect } from 'react';
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import './App.css';

function App() {

  const [locales, guardarLocales] = useState([]);
  const [infoLocal, guardarInfoLocal] = useState(null);

  const icon = new Icon({
    iconUrl: "/commerce.svg",
    iconSize: [25,25]
  });

  const consultarLocales = async () =>{
    const response = await fetch('https://tarjetafamilia.catamarca.gob.ar/api/v1/commerce/');
    const resultado = await response.json();
    guardarLocales(resultado.data);
  }

  useEffect(()=>{
    consultarLocales()
  },[])

  const coordenadas = punto =>{
    const p = (punto !== null) ? [punto.coordinates[1],punto.coordinates[0]] : [0,0];
    return p;
  }

  return (
    <Fragment>
      <h1>Mapa</h1>
      <Map center={[-28.4686195,-65.795289]} zoom={14}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {locales.map( local => (
        <Marker 
          key={local.id}
          position={coordenadas(local.attributes.point)}
          icon={icon}
          onClick={() => {
            guardarInfoLocal(local.attributes);
          }}
        />
      ))}

      {
        infoLocal ? (
          <Popup
            position={coordenadas(infoLocal.point)}
            onClose={() =>{
              guardarInfoLocal(null);
            }}
          >
          <strong>{infoLocal.name}</strong>
          <p><strong>Dirección:</strong>{infoLocal.address}</p>
          <p><strong>Descripcion:</strong>{infoLocal.description}</p>
          </Popup>
        ):null
      }
      </Map>
    </Fragment>
  );
}

export default App;
