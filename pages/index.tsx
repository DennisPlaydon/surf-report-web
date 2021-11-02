import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React from "react";
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
    var beaches = Object.keys(surfData[0]).filter((x) => x !== "time");

    const axisFormatter = (value: string) =>
        new Date(value).toLocaleString("en-En", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        });

    return (
        <div className={styles.container}>
            <Head>
                <title>Surf Reports</title>
                <meta name="description" content="App showing surf reports" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Surf Reports</h1>
                <ResponsiveContainer
                    height={700}
                    className={styles.responsiveContainer}
                >
                    <LineChart data={surfData}>
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
                </ResponsiveContainer>
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

    var combinedForecast: { [time: string]: Array<Object> } = {};
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

            for (let index = 0; index < surfTimes.length; index++) {
                const beachName: string = beach.name;
                let setFaceEntry: any = {};
                setFaceEntry[beachName] = waveFaceHeights[index]["setFace"];

                var newArray = combinedForecast[surfTimes[index]["at"]];
                newArray
                    ? newArray.push(setFaceEntry)
                    : (newArray = [setFaceEntry]);
                combinedForecast[surfTimes[index]["at"]] = newArray;
            }
        });
    }

    const formattedData = Object.entries(combinedForecast).map(
        ([key, values]) => ({ time: key, ...Object.assign({}, ...values) })
    );

    return {
        props: {
            surfData: formattedData,
        },
    };
}

export default Home;
