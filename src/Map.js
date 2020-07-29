import React from 'react';
import "./Map.css";
import { Map as LeafletMap,TileLayer} from "react-leaflet";
import { showDataOnMap } from "./util";
function Map({countries,casesType,center,zoom}) {
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                />
                {/* Loop through all Countries and Draw Circle on all Countries */}
                {showDataOnMap(countries,casesType)}
            </LeafletMap>
        </div>
    );
}

export default Map;
