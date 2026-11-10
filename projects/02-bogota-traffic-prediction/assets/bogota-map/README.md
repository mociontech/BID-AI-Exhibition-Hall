# Real Bogotá basemap · local prototype

Original OpenStreetMap geometry, served as OpenMapTiles vector tiles by
[OpenFreeMap](https://openfreemap.org/). No streets, blocks or geographic
coordinates have been generated for this map. The application only recolors
the road layers to illustrate the game's simulated traffic.

The snapshot contains urban Bogotá at zooms 8–14, including the four game
scenarios. Higher zooms reuse the original level-14 vector geometry. Tiles
outside the snapshot continue to use the provider, preserving map navigation.
Fonts, sprites, tiles, attribution and source date are recorded in `manifest.json`.
The local SVG/GeoJSON fallback remains available when WebGL cannot run.

Refresh from the repository root:

```sh
node projects/02-bogota-traffic-prediction/scripts/cache-bogota-map.mjs
```

The script limits downloads to four concurrent requests and 50 MB, following
the [provider's offline-download guidance](https://openfreemap.org/quick_start/).
It reuses existing local files when the provider release matches the manifest,
and refreshes the snapshot when that release changes.

Data © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright).
Rendering/schema © OpenMapTiles and OpenFreeMap. Original style and font notices
are retained in the project's `vendor/` directory.

`geography.geojson` contains Bogotá's 20 official localities and the official
urban land boundary, in EPSG:4326. Sources: Secretaría Distrital de Planeación,
served by Catastro Bogotá / IDECA, [localities](https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/ordenamientoterritorial/localidad/MapServer/0)
and [land classification](https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/ordenamientoterritorial/suelo/MapServer/0).
These open data are attributed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
Only a small geographic simplification is requested from the source service;
no boundary is drawn by hand. The default map fits the urban boundary. Selecting
a case focuses its real street geometry; “View Bogotá” returns to the city.

Refresh official geography:

```sh
node projects/02-bogota-traffic-prediction/scripts/cache-bogota-geography.mjs
```
