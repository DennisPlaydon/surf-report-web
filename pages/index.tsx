import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import SettingsModal from "../app/components/SettingsModal";
import getFutureDate from "../app/helpers/getDate";
import { getPageProps } from "../app/propsGenerators/pagePropsGenerator";
import { PageProps } from "../app/types/IndexPageProps";
import styles from "../styles/Home.module.css";
import Link from "next/link";

const Home: NextPage<PageProps> = ({ surfData, windData, periodData }: PageProps) => {
    const filterDataForDate = (date: Date, data: any) =>
        data.filter((x: any) => new Date(x.time).getDate() === date.getDate());

    const [dailySurfData, setDailySurfData] = useState(filterDataForDate(new Date(), surfData));
    const [dailyWindData, setDailyWindData] = useState(filterDataForDate(new Date(), windData));
    const [dailyPeriodData, setDailyPeriodData] = useState(filterDataForDate(new Date(), periodData));
    const [showModal, setShowModal] = useState(false);

    // TODO: Very crude way of sorting - it is showing the average yet only sorts by the evening forecast
    const sortedBeaches = Object.entries(dailySurfData[2])
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
                                <h2>{average(x, dailySurfData).toFixed(1)}m</h2>
                                <p>
                                    <i className="bi bi-wind"></i> Wind -{" "}
                                    {average(x, dailyWindData).toFixed(1)}
                                    kts
                                </p>
                                <p>
                                    <i className="bi bi-tsunami"></i> Period -{" "}
                                    {Math.round(Number(average(x, dailyPeriodData)))}s
                                </p>
                            </div>
                        </Link>
                    ))}
                    <ButtonGroup aria-label="Change forecast day" className={styles.buttonGroup}>
                        <Button
                            variant="outline-secondary"
                            onClick={() => {
                                const today = new Date();
                                setDailySurfData(filterDataForDate(today, surfData));
                                setDailyWindData(filterDataForDate(today, windData));
                                setDailyPeriodData(filterDataForDate(today, periodData));
                            }}
                        >
                            Today
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={() => {
                                var tomorrow = getFutureDate(1);
                                setDailySurfData(filterDataForDate(tomorrow, surfData));
                                setDailyWindData(filterDataForDate(tomorrow, windData));
                                setDailyPeriodData(filterDataForDate(tomorrow, periodData));
                            }}
                        >
                            Tomorrow
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={() => {
                                let twoDaysFromNow = getFutureDate(2);
                                setDailySurfData(filterDataForDate(twoDaysFromNow, surfData));
                                setDailyWindData(filterDataForDate(twoDaysFromNow, windData));
                                setDailyPeriodData(filterDataForDate(twoDaysFromNow, periodData));
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

export async function getServerSideProps() {
    return {
        props: await getPageProps(),
    };
}

export default Home;
