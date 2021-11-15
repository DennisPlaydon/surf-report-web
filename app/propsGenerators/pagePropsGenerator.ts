import { PageProps } from "../types/IndexPageProps";
import { beaches } from "../beaches";
import getForecastData from "../helpers/getForecastData";

export async function getPageProps(): Promise<PageProps> {
    const surfDateTimeIndex = 0;
    const windLevelIndex = 2;
    const periodIndex = 4;
    const faceHeightIndex = 5;

    var surfData: { [time: string]: Array<Object> } = {};
    var windData: { [time: string]: Array<Object> } = {};
    var periodData: { [time: string]: Array<Object> } = {};

    let result;
    let promises: Promise<{ beach: string; daysForecast: String[] }>[] = [];

    beaches.forEach((beach) => promises.push(getForecastData(beach)));
    result = await Promise.all(promises);

    result.forEach((beachForecast) => {
        beachForecast.daysForecast.forEach((individualDay: any) => {
            const individualDayForecastTimes = individualDay["rows"][surfDateTimeIndex]["data"];
            const waveFaceHeights = individualDay["rows"][faceHeightIndex]["data"];
            const windLevels = individualDay["rows"][windLevelIndex]["data"];
            const periodLevels = individualDay["rows"][periodIndex]["data"];

            const startingIndexExcluding4AmTime = 1;
            for (
                let index = startingIndexExcluding4AmTime;
                index < individualDayForecastTimes.length;
                index++
            ) {
                let time = individualDayForecastTimes[index]["at"];

                let setFaceEntry: any = {};
                setFaceEntry[beachForecast.beach] = waveFaceHeights[index]["setFace"];

                let surfEntriesForDate = surfData[time];
                surfEntriesForDate
                    ? surfEntriesForDate.push(setFaceEntry)
                    : (surfEntriesForDate = [setFaceEntry]);
                surfData[time] = surfEntriesForDate;

                let windEntry: any = {};
                windEntry[beachForecast.beach] = windLevels[index]["gust"];

                let windEntriesForDate = windData[time];
                windEntriesForDate ? windEntriesForDate.push(windEntry) : (windEntriesForDate = [windEntry]);
                windData[time] = windEntriesForDate;

                let periodEntry: any = {};
                periodEntry[beachForecast.beach] = periodLevels[index]["period"];

                let periodEntriesForDate = periodData[time];
                periodEntriesForDate
                    ? periodEntriesForDate.push(periodEntry)
                    : (periodEntriesForDate = [periodEntry]);
                periodData[time] = periodEntriesForDate;
            }
        });
    });

    const formattedSurfData = Object.entries(surfData).map(([key, values]: [string, any]) => ({
        time: key,
        ...Object.assign({}, ...values),
    }));

    const formattedWindData = Object.entries(windData).map(([key, values]: [string, any]) => ({
        time: key,
        ...Object.assign({}, ...values),
    }));

    const formattedPeriodData = Object.entries(periodData).map(([key, values]: [string, any]) => ({
        time: key,
        ...Object.assign({}, ...values),
    }));

    const props = {
        surfData: formattedSurfData,
        windData: formattedWindData,
        periodData: formattedPeriodData,
    };
    return props;
}
