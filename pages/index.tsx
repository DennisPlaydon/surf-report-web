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

const Home: NextPage = ({ surfData }: any) => {
    var beaches = Object.keys(surfData[0]).filter((x) => x !== "time");
    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
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
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="Omaha"
                            stroke="#94BCFF"
                        />
                        <Line type="monotone" dataKey="Piha" stroke="#1FAD81" />
                        <Line
                            type="monotone"
                            dataKey="Muriwai"
                            stroke="#BAE307"
                        />
                        <Line
                            type="monotone"
                            dataKey="PortWaikato"
                            stroke="#FBAD5F"
                        />
                        <Line
                            type="monotone"
                            dataKey="Waihi"
                            stroke="#3705AD"
                        />
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
    const baseUrl = process.env.API_BASE_URL;
    const res = await fetch(baseUrl + "/api/metservice");
    const surfData = await res.json();

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
