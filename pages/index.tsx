import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { ButtonGroup, Button, Spinner } from "react-bootstrap";
import SettingsModal from "../app/components/SettingsModal";
import getFutureDate from "../app/helpers/getDate";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { getAppData } from "../app/helpers/getAppData";
import { formatData } from "../app/helpers/formatRawData";

const Home: NextPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [buttonIndex, setButtonIndex] = useState(0);

    const { rawData, isLoading } = getAppData();

    if (isLoading) {
        return (
            <div className={styles.spinner}>
                <Spinner animation="border" />
            </div>
        );
    }
    const { surfData, windData, periodData } = formatData(rawData);

    const filterDataForDate = (date: Date, data: any) =>
        data.filter((x: any) => new Date(x.time).getDate() === date.getDate());

    // TODO: Very crude way of sorting - it is showing the average yet only sorts by the evening forecast
    const sortedBeaches = Object.entries(filterDataForDate(new Date(), surfData)[2])
        .sort(([, a]: any, [, b]: any) => b - a)
        .map((x) => x[0])
        .filter((x) => x !== "time");

    const average = (beachName: string, array: any) => {
        const arrayNoNulls = array.filter((x: any) => x[beachName] !== null);
        return (
            arrayNoNulls.reduce((prev: number, cur: any) => prev + Number(cur[beachName]), 0) /
            arrayNoNulls.length
        );
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Surf Reports</title>
                <meta name="description" content="App showing surf reports" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.grid}>
                    <button className={styles.settings} onClick={() => setShowModal(!showModal)}>
                        <i className="bi bi-gear"></i>
                    </button>
                    <SettingsModal
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        beaches={sortedBeaches}
                    />
                    <h1 className={styles.title}>Surf Reports</h1>
                    {sortedBeaches.map((x) => (
                        <Link href={`/beach/${x.toLowerCase()}`} key={x}>
                            <div className={styles.card}>
                                <p>{x}</p>
                                <h2>
                                    {average(
                                        x,
                                        filterDataForDate(getFutureDate(buttonIndex), surfData)
                                    ).toFixed(1)}
                                    m
                                </h2>
                                <p>
                                    <span className={styles.windIcon}>
                                        <i className="bi bi-wind"></i>
                                    </span>{" "}
                                    Wind -{" "}
                                    {average(
                                        x,
                                        filterDataForDate(getFutureDate(buttonIndex), windData)
                                    ).toFixed(1)}
                                    kts
                                </p>
                                <p>
                                    <span className={styles.tsunamiIcon}>
                                        <i className="bi bi-tsunami"></i>
                                    </span>{" "}
                                    Period -{" "}
                                    {Math.round(
                                        Number(
                                            average(
                                                x,
                                                filterDataForDate(getFutureDate(buttonIndex), periodData)
                                            )
                                        )
                                    )}
                                    s
                                </p>
                            </div>
                        </Link>
                    ))}
                    <ButtonGroup aria-label="Change forecast day" className={styles.buttonGroup}>
                        <Button
                            className={buttonIndex === 0 ? styles.buttonSelected : styles.buttonNonSelected}
                            onClick={() => {
                                setButtonIndex(0);
                            }}
                        >
                            Today
                        </Button>
                        <Button
                            className={buttonIndex === 1 ? styles.buttonSelected : styles.buttonNonSelected}
                            onClick={() => {
                                setButtonIndex(1);
                            }}
                        >
                            Tomorrow
                        </Button>
                        <Button
                            className={buttonIndex === 2 ? styles.buttonSelected : styles.buttonNonSelected}
                            onClick={() => {
                                setButtonIndex(2);
                            }}
                        >
                            {getFutureDate(2).toLocaleDateString("EN-en", { weekday: "short" })}
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

export default Home;
