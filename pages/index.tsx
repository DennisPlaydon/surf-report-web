import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import {
    ResponsiveContainer,
    LineChart,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
} from "recharts";
import styles from "../styles/Home.module.css";

const generateRanHex = () =>
    "#" +
    [...Array(6)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");

const Home: NextPage = ({ surfData }: any) => {
    const beaches = Object.keys(surfData[0]).filter((x) => x !== "time");

    const getSurfDataForDate = (date: Date) =>
        surfData.filter(
            (x: any) => new Date(x.time).getDate() === date.getDate()
        );
    const [data, setData] = useState(getSurfDataForDate(new Date()));

    const axisFormatter = (value: string) =>
        new Date(value).toLocaleString("en-En", {
            month: "short",
            day: "numeric",
            hour: "numeric",
        });

    const getAverageSurfValue = (x: string) =>
        data.reduce((prev: number, cur: any) => prev + Number(cur[x]), 0) /
        data.length;

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
                            <p>Wind: 7km/h</p>
                        </div>
                    ))}
                    <ButtonGroup
                        aria-label="Change forecast day"
                        className={styles.buttonGroup}
                    >
                        <Button
                            variant="outline-secondary"
                            onClick={() =>
                                setData(getSurfDataForDate(new Date()))
                            }
                        >
                            Today
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={() => {
                                var tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                console.log(getSurfDataForDate(tomorrow));
                                setData(getSurfDataForDate(tomorrow));
                            }}
                        >
                            Tomorrow
                        </Button>
                        <Button variant="outline-secondary">5D</Button>
                        <Button variant="outline-secondary">7D</Button>
                    </ButtonGroup>
                </div>
                {/* <ResponsiveContainer
                    height={700}
                    className={styles.responsiveContainer}
                >
                    <LineChart data={graphData}>
                        <XAxis dataKey="time" tickFormatter={axisFormatter} />
                        <YAxis
                            label={{
                                value: "Surf height (m)",
                                angle: -90,
                                position: "insideLeft",
                            }}
                        />
                        <Tooltip />
                        <Legend />
                        {beaches.map((x) => (
                            <Line
                                key={x}
                                type="monotone"
                                dataKey={x}
                                stroke={generateRanHex()}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer> */}
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
    const faceHeightIndex = 5;
    const surfDateTimeIndex = 0;

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
    for (let beachIndex = 0; beachIndex < beaches.length; beachIndex++) {
        const beach = beaches[beachIndex];

        const result = await fetch(
            `https://www.metservice.com/publicData/webdata/marine/regions/${beach.region}/surf/locations/${beach.location}`
        );
        const json = await result.json();
        const daysForecast: Array<String> =
            json["layout"]["primary"]["slots"]["main"]["modules"][0]["days"];

        daysForecast.forEach((individualDay: any) => {
            const surfTimes = individualDay["rows"][surfDateTimeIndex]["data"];
            const waveFaceHeights =
                individualDay["rows"][faceHeightIndex]["data"];

            const startingIndexExcluding4AmTime = 1;
            for (
                let index = startingIndexExcluding4AmTime;
                index < surfTimes.length;
                index++
            ) {
                let setFaceEntry: any = {};
                setFaceEntry[beach.name] = waveFaceHeights[index]["setFace"];

                var newArray = surfData[surfTimes[index]["at"]];
                newArray
                    ? newArray.push(setFaceEntry)
                    : (newArray = [setFaceEntry]);
                surfData[surfTimes[index]["at"]] = newArray;
            }
        });
    }

    const formattedData = Object.entries(surfData).map(
        ([key, values]: [string, any]) => ({
            time: key,
            ...Object.assign({}, ...values),
        })
    );

    return {
        props: {
            surfData: formattedData,
        },
    };
}

export default Home;
