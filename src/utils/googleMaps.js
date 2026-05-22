const GOOGLE_MAPS_CALLBACK = "__ozoneKitchenGoogleMapsReady";

let googleMapsPromise;

export function getGoogleMapsApiKey() {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
}

export function loadGoogleMaps() {
  const apiKey = getGoogleMapsApiKey();

  if (!apiKey) {
    return Promise.reject(
      new Error("Missing Google Maps API key. Set VITE_GOOGLE_MAPS_API_KEY in your .env file.")
    );
  }

  if (window.google?.maps?.importLibrary) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    window[GOOGLE_MAPS_CALLBACK] = () => {
      resolve(window.google.maps);
      delete window[GOOGLE_MAPS_CALLBACK];
    };

    const script = document.createElement("script");
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${apiKey}` +
      `&libraries=places&v=weekly&callback=${GOOGLE_MAPS_CALLBACK}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      reject(new Error("Failed to load Google Maps."));
      delete window[GOOGLE_MAPS_CALLBACK];
      googleMapsPromise = undefined;
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
