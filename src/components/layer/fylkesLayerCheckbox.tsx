import VectorLayer from "ol/layer/Vector.js";
import { Fill, Stroke, Style, Text } from "ol/style.js";
import { Layer } from "ol/layer.js";
import React, { useEffect, useState } from "react";
import VectorSource from "ol/source/Vector.js";
import { GeoJSON } from "ol/format.js";
import { Feature, Map, type MapBrowserEvent } from "ol";

const fylkeSource = new VectorSource({
  url: "/forelesning3_1/geojson/fylker.geojson",
  format: new GeoJSON(),
});
const fylkelayer = new VectorLayer({
  source: fylkeSource,
  style: new Style({
    stroke: new Stroke({ color: "blue", width: 2 }),
    fill: new Fill({
      color: "#ff000020",
    }),
  }),
});

export function FylkesLayerCheckbox({
  setFylkesLayers,
  map,
}: {
  setFylkesLayers: (value: Layer[]) => void;
  map: Map;
}) {
  function handlePointerMove(e: MapBrowserEvent) {
    const fylkeUnderPointer = fylkeSource.getFeaturesAtCoordinate(e.coordinate);
    setActiveFylke(
      fylkeUnderPointer.length > 0 ? fylkeUnderPointer[0] : undefined,
    );
  }

  const [activeFylke, setActiveFylke] = useState<Feature>();
  const [showFylkeLayer, setShowFylkeLayer] = useState(false);
  useEffect(() => {
    setFylkesLayers(showFylkeLayer ? [fylkelayer] : []);
    if (showFylkeLayer) map.on("pointermove", handlePointerMove);
    return () => {
      map.un("pointermove", handlePointerMove);
    };
  }, [showFylkeLayer]);
  useEffect(() => {
    activeFylke?.setStyle(
      (feature) =>
        new Style({
          stroke: new Stroke({ color: "blue", width: 4 }),
          text: new Text({
            text: feature.getProperties()["fylkesnavn"],
          }),
        }),
    );
    return () => activeFylke?.setStyle(undefined);
  }, [activeFylke]);

  return (
    <button onClick={() => setShowFylkeLayer((b) => !b)} tabIndex={-1}>
      <input type={"checkbox"} checked={showFylkeLayer} /> Vis fylker (ny)
    </button>
  );
}
