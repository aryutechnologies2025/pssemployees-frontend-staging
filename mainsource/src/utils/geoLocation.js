export const reverseGeocodeOSM = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          "User-Agent": "attendance-app/1.0",
        },
      }
    );

    const data = await res.json();

    if (!data || !data.address) return null;

    return {
      fullAddress: data.display_name,
      area:
        data.address.suburb ||
        data.address.neighbourhood ||
        "",
      city:
        data.address.city ||
        data.address.town ||
        data.address.village ||
        "",
      state: data.address.state || "",
      country: data.address.country || "",
      pincode: data.address.postcode || "",
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
