import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import SettingsModal from "../app/components/SettingsModal";
import { getIndexPageProps } from "../app/propsGenerators/indexPagePropsGenerator";
import { IndexPageProps } from "../app/types/IndexPageProps";
import styles from "../styles/Home.module.css";

const Home: NextPage<IndexPageProps> = ({
    surfData,
    windData,
    periodData,
}: IndexPageProps) => {
    const [beaches, setBeaches] = useState(
        Object.keys(surfData[0]).filter((x) => x !== "time")
    );

    const filterDataForDate = (date: Date, data: any) =>
        data.filter((x: any) => new Date(x.time).getDate() === date.getDate());

    const [dailySurfData, setDailySurfData] = useState(
        filterDataForDate(new Date(), surfData)
    );
    const [dailyWindData, setDailyWindData] = useState(
        filterDataForDate(new Date(), windData)
    );
    const [dailyPeriodData, setDailyPeriodData] = useState(
        filterDataForDate(new Date(), periodData)
    );
    const [showModal, setShowModal] = useState(false);

    const average = (beachName: string, array: any) =>
        array.reduce(
            (prev: number, cur: any) => prev + Number(cur[beachName]),
            0
        ) / array.length;

    return (
        <div className={styles.container}>
            <Head>
                <title>Surf Reports</title>
                <meta name="description" content="App showing surf reports" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <div className={styles.grid}>
                    <button
                        className={styles.settings}
                        onClick={() => setShowModal(!showModal)}
                    >
                        <i className="bi bi-gear"></i>
                    </button>
                    <SettingsModal
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        beaches={beaches}
                    />
                    <h1 className={styles.title}>Surf Reports</h1>
                    {beaches.map((x) => (
                        <div className={styles.card} key={x}>
                            <p>{x}</p>
                            <h2>{average(x, dailySurfData).toFixed(1)}m</h2>
                            <p>
                                <i className="bi bi-wind"></i> Wind -{" "}
                                {average(x, dailyWindData).toFixed(1)}
                                kts
                            </p>
                            <p>
                                <i className="bi bi-tsunami"></i> Period -{" "}
                                {Math.round(
                                    Number(average(x, dailyPeriodData))
                                )}
                                s
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
                                setDailySurfData(
                                    filterDataForDate(today, surfData)
                                );
                                setDailyWindData(
                                    filterDataForDate(today, windData)
                                );
                                setDailyPeriodData(
                                    filterDataForDate(today, periodData)
                                );
                            }}
                        >
                            Today
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={() => {
                                var tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                setDailySurfData(
                                    filterDataForDate(tomorrow, surfData)
                                );
                                setDailyWindData(
                                    filterDataForDate(tomorrow, windData)
                                );
                                setDailyPeriodData(
                                    filterDataForDate(tomorrow, periodData)
                                );
                            }}
                        >
                            Tomorrow
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={() => {
                                let twoDaysFromNow = new Date();
                                twoDaysFromNow.setDate(
                                    twoDaysFromNow.getDate() + 2
                                );
                                setDailySurfData(
                                    filterDataForDate(twoDaysFromNow, surfData)
                                );
                                setDailyWindData(
                                    filterDataForDate(twoDaysFromNow, windData)
                                );
                                setDailyPeriodData(
                                    filterDataForDate(
                                        twoDaysFromNow,
                                        periodData
                                    )
                                );
                            }}
                        >
                            2D
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={() => {
                                let threeDaysFromNow = new Date();
                                threeDaysFromNow.setDate(
                                    threeDaysFromNow.getDate() + 3
                                );
                                setDailySurfData(
                                    filterDataForDate(
                                        threeDaysFromNow,
                                        surfData
                                    )
                                );
                                setDailyWindData(
                                    filterDataForDate(
                                        threeDaysFromNow,
                                        windData
                                    )
                                );
                                setDailyPeriodData(
                                    filterDataForDate(
                                        threeDaysFromNow,
                                        periodData
                                    )
                                );
                            }}
                        >
                            3D
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
        props: await getIndexPageProps(),
    };
}

export default Home;
