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
    console.log(beaches);
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
                        {/* {beaches.map((beach) => {
                            <Line
                                type="monotone"
                                dataKey={beach}
                                stroke="#00f590"
                            />;
                        })} */}
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

export async function getStaticProps() {
    const res = await fetch("http://localhost:3000/api/metservice");
    const surfData = await res.json();

    return {
        props: {
            surfData,
        },
    };
}

export default Home;
