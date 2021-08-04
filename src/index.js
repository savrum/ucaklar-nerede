import { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from 'react-leaflet';

import aircrafts from './assets/aircrafts.json';

const Map = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [planes, setPlanes] = useState([]);

  const GetPlanes = useCallback(() => {
    Promise.all(Object.keys(aircrafts).map((id) => fetch(`https://ucaknerede.herokuapp.com/${id}`)
      .then((data) => data.json())
      .then((data) => data))).then((data) => {
      setPlanes(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => GetPlanes(), [GetPlanes]);

  return (
    <>
      <nav className="nav">
        <h2>Uçaklar Nerede?</h2>
        {planes.length > 0 && (
        <p>
          Şu an Türkiye&apos;de yangın söndürme
          <br />
          faaliyetlerine yardım eden
          {' '}
          {planes.length}
          {' '}
          hava aracı var.
        </p>
        )}
      </nav>
      {isLoading && <div className="wall"><div className="abs-center"><span className="spinner-border text-light" /></div></div>}
      <MapContainer
        center={[38.1817007, 31.3685707]}
        style={{
          left: 0,
          right: 0,
          top: '3.5rem',
          bottom: 0,
          position: 'fixed',
        }}
        zoom={6.5}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {(planes.map((plane) => !plane.error && (
        <Marker
          key={plane.identification.id}
          eventHandlers={{ click: () => setSelected(plane) }}
          position={[plane.trail[0].lat, plane.trail[0].lng]}
        >
          <Popup>
            <h4>{aircrafts[plane.identification.id].callsign}</h4>
            {aircrafts[plane.identification.id].owner}
            <br />
            {aircrafts[plane.identification.id].type}
          </Popup>
        </Marker>
        )))}
        {selected && (
        <>
          <Polyline
            pathOptions={{ color: 'red' }}
            positions={[selected.trail.map(({ lat, lng }) => [lat, lng])]}
          />
        </>
        )}
      </MapContainer>
    </>
  );
};

ReactDOM.render(<Map />, document.getElementById('app'));
