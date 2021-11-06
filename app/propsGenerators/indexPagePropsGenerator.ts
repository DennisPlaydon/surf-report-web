import { IndexPageProps } from "../types/IndexPageProps";
import { beaches } from "../beaches";

export async function getIndexPageProps(): Promise<IndexPageProps> {
    const surfDateTimeIndex = 0;
    const windLevelIndex = 2;
    const periodIndex = 4;
    const faceHeightIndex = 5;

    var surfData: { [time: string]: Array<Object> } = {};
    var windData: { [time: string]: Array<Object> } = {};
    var periodData: { [time: string]: Array<Object> } = {};
    for (let beachIndex = 0; beachIndex < beaches.length; beachIndex++) {
        const beach = beaches[beachIndex];

        const result = await fetch(
            `https://www.metservice.com/publicData/webdata/marine/regions/${beach.region}/surf/locations/${beach.location}`
        );
        const json = await result.json();
        const daysForecast: Array<String> =
            json["layout"]["primary"]["slots"]["main"]["modules"][0]["days"];

        daysForecast.forEach((individualDay: any) => {
            const individualDayForecastTimes =
                individualDay["rows"][surfDateTimeIndex]["data"];
            const waveFaceHeights =
                individualDay["rows"][faceHeightIndex]["data"];
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
                setFaceEntry[beach.name] = waveFaceHeights[index]["setFace"];

                var surfEntriesForDate = surfData[time];
                surfEntriesForDate
                    ? surfEntriesForDate.push(setFaceEntry)
                    : (surfEntriesForDate = [setFaceEntry]);
                surfData[time] = surfEntriesForDate;

                let windEntry: any = {};
                windEntry[beach.name] = windLevels[index]["gust"];

                var windEntriesForDate = windData[time];
                windEntriesForDate
                    ? windEntriesForDate.push(windEntry)
                    : (windEntriesForDate = [windEntry]);
                windData[time] = windEntriesForDate;

                let periodEntry: any = {};
                periodEntry[beach.name] = periodLevels[index]["period"];

                var periodEntriesForDate = periodData[time];
                periodEntriesForDate
                    ? periodEntriesForDate.push(periodEntry)
                    : (periodEntriesForDate = [periodEntry]);
                periodData[time] = periodEntriesForDate;
            }
        });
    }

    const formattedSurfData = Object.entries(surfData).map(
        ([key, values]: [string, any]) => ({
            time: key,
            ...Object.assign({}, ...values),
        })
    );

    const formattedWindData = Object.entries(windData).map(
        ([key, values]: [string, any]) => ({
            time: key,
            ...Object.assign({}, ...values),
        })
    );

    const formattedPeriodData = Object.entries(periodData).map(
        ([key, values]: [string, any]) => ({
            time: key,
            ...Object.assign({}, ...values),
        })
    );

    const props = { surfData: formattedSurfData, windData: formattedWindData, periodData: formattedPeriodData };
    return props;
}