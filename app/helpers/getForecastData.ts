import { Beach } from "../types/Beach";

const getForecastData = async (beach: Beach) => { 
    const result = await fetch(
        `https://www.metservice.com/publicData/webdata/marine/regions/${beach.region}/surf/locations/${beach.location}`
    );
    const json = await result.json();
    const daysForecast: Array<String> = json["layout"]["primary"]["slots"]["main"]["modules"][0]["days"];


    return { beach: beach.name, daysForecast };
};

export default getForecastData;