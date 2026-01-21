export const reverseGeocodeOSM = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          "User-Agent": "attendance-app/1.0",
        },
      }
    );

    const data = await res.json();
    if (!data?.address) return null;

    const a = data.address;
    console.log("OSM reverse geocode data:", data);

    return {
      fullAddress: data.display_name || "",

      // ⭐ IMPORTANT FIX
      address:a.neighbourhood || a.suburb ||
        a.quarter ,
      landmark:
        a.amenity ||
        a.shop ||
        a.office ||
        a.tourism ||
        a.building ||
        a.residential ||   // ✅ REQUIRED
        a.suburb ||
        "",

      building: a.building || "",
      road: a.road || a.pedestrian || a.footway || "",
      locality:
        a.suburb ||
        a.neighbourhood ||
        a.quarter ||
        a.residential ||   // ✅ REQUIRED
        "",

      placeType: a.residential ? "residential" : a.amenity ? "amenity" : "",
      city: a.city || a.town || a.village || "",
      state: a.state || "",
      country: a.country || "",
      pincode: a.postcode || "",
    };
  } catch (error) {
    console.error("OSM reverse geocode failed", error);
    return null;
  }
};




// const locationCache = new Map();

// export const  reverseGeocodeOSM = async (lat, lng) => {
//   const key = `${lat},${lng}`;
//   if (locationCache.has(key)) return locationCache.get(key);

//   try {
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
//     );
//     const data = await res.json();

//     const location = data?.address
//       ? `${data.address.suburb || data.address.neighbourhood || ""}${
//           data.address.city ? ", " + data.address.city : ""
//         }`
//       : "-";

//     locationCache.set(key, location);
//     return location;
//   } catch {
//     return "-";
//   }
// };
