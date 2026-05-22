import { useEffect, useRef, useState } from "react";
import { getGoogleMapsApiKey, loadGoogleMaps } from "../utils/googleMaps";

const JODHPUR_CENTER = { lat: 26.2389, lng: 73.0243 };
const SEARCH_MIN_LENGTH = 3;

function DeliveryAddressModal({ isOpen, initialValue, onClose, onConfirm }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const autocompleteServiceRef = useRef(null);
  const mapClickListenerRef = useRef(null);
  const debounceRef = useRef(null);

  const [query, setQuery] = useState(initialValue?.selectedAddress || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingMap, setIsLoadingMap] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(
    initialValue?.selectedAddress || ""
  );
  const [selectedCoords, setSelectedCoords] = useState(() => ({
    lat: initialValue?.latitude || JODHPUR_CENTER.lat,
    lng: initialValue?.longitude || JODHPUR_CENTER.lng
  }));

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    setQuery(initialValue?.selectedAddress || "");
    setSelectedAddress(initialValue?.selectedAddress || "");
    setSelectedCoords({
      lat: initialValue?.latitude || JODHPUR_CENTER.lat,
      lng: initialValue?.longitude || JODHPUR_CENTER.lng
    });
    setSuggestions([]);
    setErrorMessage("");

    async function initializeMap() {
      setIsLoadingMap(true);

      try {
        await loadGoogleMaps();

        const [{ Map }] = await Promise.all([
          window.google.maps.importLibrary("maps"),
          window.google.maps.importLibrary("places")
        ]);

        geocoderRef.current = new window.google.maps.Geocoder();
        autocompleteServiceRef.current =
          new window.google.maps.places.AutocompleteService();

        const startCoords = {
          lat: initialValue?.latitude || JODHPUR_CENTER.lat,
          lng: initialValue?.longitude || JODHPUR_CENTER.lng
        };

        if (!mapRef.current) {
          mapRef.current = new Map(mapContainerRef.current, {
            center: startCoords,
            zoom: initialValue?.selectedAddress ? 17 : 13,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            clickableIcons: false
          });

          markerRef.current = new window.google.maps.Marker({
            map: mapRef.current,
            position: startCoords,
            draggable: true,
            animation: window.google.maps.Animation.DROP
          });

          markerRef.current.addListener("dragend", () => {
            const position = markerRef.current.getPosition();

            if (position) {
              reverseGeocodePosition({
                lat: position.lat(),
                lng: position.lng()
              });
            }
          });
        } else {
          mapRef.current.setCenter(startCoords);
          mapRef.current.setZoom(initialValue?.selectedAddress ? 17 : 13);
          markerRef.current?.setPosition(startCoords);
        }

        if (mapClickListenerRef.current) {
          window.google.maps.event.removeListener(mapClickListenerRef.current);
        }

        mapClickListenerRef.current = mapRef.current.addListener("click", (event) => {
          const coords = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          markerRef.current.setPosition(coords);
          reverseGeocodePosition(coords);
        });
      } catch (error) {
        setErrorMessage(error.message || "Unable to load Google Maps right now.");
      } finally {
        setIsLoadingMap(false);
      }
    }

    initializeMap();

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [initialValue, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    if (query.trim().length < SEARCH_MIN_LENGTH || !autocompleteServiceRef.current) {
      setSuggestions([]);
      setIsSearching(false);
      return undefined;
    }

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      setIsSearching(true);
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: "in" },
          locationBias: {
            center: JODHPUR_CENTER,
            radius: 40000
          }
        },
        (predictions, status) => {
          setIsSearching(false);

          if (
            status !== window.google.maps.places.PlacesServiceStatus.OK ||
            !predictions
          ) {
            setSuggestions([]);
            return;
          }

          setSuggestions(
            predictions.map((prediction) => ({
              placeId: prediction.place_id,
              primaryText:
                prediction.structured_formatting?.main_text || prediction.description,
              secondaryText:
                prediction.structured_formatting?.secondary_text ||
                prediction.description
            }))
          );
        }
      );
    }, 250);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [isOpen, query]);

  function reverseGeocodePosition(coords) {
    if (!geocoderRef.current) {
      return;
    }

    setIsResolvingAddress(true);
    setErrorMessage("");

    geocoderRef.current.geocode({ location: coords }, (results, status) => {
      setIsResolvingAddress(false);

      if (status !== "OK" || !results?.[0]) {
        setErrorMessage("We could not fetch the selected address. Try another pin location.");
        return;
      }

      setSelectedCoords(coords);
      setSelectedAddress(results[0].formatted_address);
      setQuery(results[0].formatted_address);
    });
  }

  function selectPrediction(prediction) {
    if (!geocoderRef.current) {
      return;
    }

    setIsResolvingAddress(true);
    setSuggestions([]);
    setErrorMessage("");

    geocoderRef.current.geocode({ placeId: prediction.placeId }, (results, status) => {
      setIsResolvingAddress(false);

      if (status !== "OK" || !results?.[0]) {
        setErrorMessage("We could not load that place on the map. Try another result.");
        return;
      }

      const location = results[0].geometry.location;
      const coords = { lat: location.lat(), lng: location.lng() };

      setSelectedCoords(coords);
      setSelectedAddress(results[0].formatted_address);
      setQuery(results[0].formatted_address);
      mapRef.current?.setCenter(coords);
      mapRef.current?.setZoom(17);
      markerRef.current?.setPosition(coords);
    });
  }

  function handleConfirm() {
    if (!selectedAddress) {
      setErrorMessage("Pick a delivery address on the map before confirming.");
      return;
    }

    onConfirm({
      selectedAddress,
      latitude: selectedCoords.lat,
      longitude: selectedCoords.lng
    });
    onClose();
  }

  if (!isOpen) {
    return null;
  }

  const apiKeyMissing = !getGoogleMapsApiKey();

  return (
    <div className="address-modal-backdrop" role="dialog" aria-modal="true">
      <div className="address-modal">
        <div className="address-modal-header">
          <div>
            <p className="eyebrow">Delivery Address</p>
            <h3>Select location on map</h3>
          </div>
          <button type="button" className="text-button" onClick={onClose}>
            Close
          </button>
        </div>

        {apiKeyMissing ? (
          <div className="address-api-warning">
            <p className="selected-address-label">Google Maps API key missing</p>
            <p className="selected-address-value">
              Add <code>VITE_GOOGLE_MAPS_API_KEY=your_key_here</code> to your
              <code> .env</code> file and restart the dev server.
            </p>
          </div>
        ) : null}

        <div className="address-modal-body">
          <div className="address-modal-panel">
            <label className="field-label" htmlFor="mapAddressSearch">
              Search address or building
            </label>
            <input
              id="mapAddressSearch"
              type="text"
              className="text-input"
              placeholder="Start typing after 3 letters..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              disabled={apiKeyMissing}
            />

            <p className="address-helper">
              Suggestions appear automatically. You can also drag the pin or tap on
              the map to adjust the exact delivery point.
            </p>

            {isSearching ? (
              <p className="address-helper">Searching nearby locations...</p>
            ) : null}

            {suggestions.length > 0 ? (
              <div className="address-results" role="listbox" aria-label="Live address suggestions">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.placeId}
                    type="button"
                    className="address-result"
                    onClick={() => selectPrediction(suggestion)}
                  >
                    <strong>{suggestion.primaryText}</strong>
                    <span>{suggestion.secondaryText}</span>
                  </button>
                ))}
              </div>
            ) : null}

            {errorMessage ? (
              <p className="address-helper address-helper-error">{errorMessage}</p>
            ) : null}

            <div className="selected-address-card">
              <p className="selected-address-label">Selected main address</p>
              <p className="selected-address-value">
                {selectedAddress || "Tap a suggestion or place the pin on the map."}
              </p>
            </div>

            <button
              type="button"
              className="button button-primary"
              onClick={handleConfirm}
              disabled={!selectedAddress || isResolvingAddress || apiKeyMissing}
            >
              Use this address
            </button>
          </div>

          <div className="address-map-panel">
            <div className="address-map-frame">
              {isLoadingMap ? (
                <div className="address-map-state">Loading map...</div>
              ) : null}
              <div ref={mapContainerRef} className="address-map" />
              {isResolvingAddress ? (
                <div className="address-map-overlay">Updating selected address...</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryAddressModal;
