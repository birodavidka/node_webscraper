import axios from 'axios';

export const getDistanceRoute = async (a: string, b: string, c: string) => {
  const apiKey = process.env.GOOGLEMAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;

  try {
    const [firstLeg, secondLeg] = await Promise.all([
      axios.get(url, {
        params: {
          origins: a,
          destinations: b,
          key: apiKey,
          mode: 'driving',
          language: 'en',
          units: 'metric',
        },
      }),
      axios.get(url, {
        params: {
          origins: b,
          destinations: c,
          key: apiKey,
          mode: 'driving',
          language: 'en',
          units: 'metric',
        },
      }),
    ]);

    const ab = firstLeg.data.rows?.[0]?.elements?.[0];
    const bc = secondLeg.data.rows?.[0]?.elements?.[0];
    
    if (!ab || !bc || ab.status !== 'OK' || bc.status !== 'OK') {
      console.error('Google Maps API válasz:', {
        ab,
        bc,
        firstLeg: firstLeg.data,
        secondLeg: secondLeg.data
      });
      console.error(JSON.stringify(firstLeg.data, null, 2));
      console.log('📦 GOOGLE_MAPS_API_KEY:', apiKey);
      throw new Error('❌ Hiba az egyik szakasz lekérdezésénél');
    }
    return {
      abDistance: ab.distance.text,
      abDuration: ab.duration.text,
      bcDistance: bc.distance.text,
      bcDuration: bc.duration.text,
      totalDistance: `${(ab.distance.value + bc.distance.value) / 1000} km`,
      totalDuration: `${Math.round((ab.duration.value + bc.duration.value) / 60)} perc`,
      
    };
  } catch (error: any) {
    console.error('Google Maps API error:', error.response?.data || error.message);
    throw new Error('❌ Google Maps API lekérdezés hiba');
  }
};
