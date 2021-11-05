import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import styles from "../styles/Home.module.css";

const generateRanHex = () =>
    "#" +
    [...Array(6)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");

const Home: NextPage = ({ surfData, windData }: any) => {
    const beaches = Object.keys(surfData[0]).filter((x) => x !== "time");

    const getSurfDataForDate = (date: Date) =>
        surfData.filter(
            (x: any) => new Date(x.time).getDate() === date.getDate()
        );

    const getWindDataForDate = (date: Date) =>
        windData.filter(
            (x: any) => new Date(x.time).getDate() === date.getDate()
        );

    const [dailySurfData, setDailySurfData] = useState(
        getSurfDataForDate(new Date())
    );
    const [dailyWindData, setDailyWindData] = useState(
        getWindDataForDate(new Date())
    );

    const axisFormatter = (value: string) =>
        new Date(value).toLocaleString("en-En", {
            month: "short",
            day: "numeric",
            hour: "numeric",
        });

    const getAverageSurfValue = (x: string) =>
        dailySurfData.reduce(
            (prev: number, cur: any) => prev + Number(cur[x]),
            0
        ) / dailySurfData.length;

    const getAverageWindValue = (x: string) =>
        dailyWindData.reduce(
            (prev: number, cur: any) => prev + Number(cur[x]),
            0
        ) / dailyWindData.length;

    return (
        <div className={styles.container}>
            <Head>
                <title>Surf Reports</title>
                <meta name="description" content="App showing surf reports" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Surf Reports</h1>
                <div className={styles.grid}>
                    {beaches.map((x) => (
                        <div className={styles.card} key={x}>
                            <p>{x}</p>
                            <h2>{getAverageSurfValue(x).toFixed(1)}m</h2>
                            <p>
                                <i className="bi bi-wind"></i>{" "}
                                {getAverageWindValue(x).toFixed(1)} kts
                            </p>
                        </div>
                    ))}
                    <ButtonGroup
                        aria-label="Change forecast day"
                        className={styles.buttonGroup}
                    >
                        <Button
                            variant="outline-secondary"
                            onClick={() => {
                                const today = new Date();
                                setDailySurfData(getSurfDataForDate(today));
                                setDailyWindData(getWindDataForDate(today));
                            }}
                        >
                            Today
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={() => {
                                var tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                setDailySurfData(getSurfDataForDate(tomorrow));
                                setDailyWindData(getWindDataForDate(tomorrow));
                            }}
                        >
                            Tomorrow
                        </Button>
                    </ButtonGroup>
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://www.linkedin.com/in/dennisplaydon/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Created by Dennis
                </a>
            </footer>
        </div>
    );
};

export async function getServerSideProps() {
    const surfDateTimeIndex = 0;
    const windLevelIndex = 2;
    const faceHeightIndex = 5;

    const beaches = [
        { name: "Piha", region: "piha", location: "piha" },
        { name: "Omaha", region: "great-barrier", location: "omaha" },
        { name: "Muriwai", region: "piha", location: "muriwai-beach" },
        {
            name: "PortWaikato",
            region: "west-auckland",
            location: "port-waikato",
        },
        { name: "Waihi", region: "coromandel", location: "waihi-beach" },
    ];

    var surfData: { [time: string]: Array<Object> } = {};
    var windData: { [time: string]: Array<Object> } = {};
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

    return {
        props: {
            surfData: formattedSurfData,
            windData: formattedWindData,
        },
    };
}

export default Home;
