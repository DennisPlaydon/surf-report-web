import { useRouter } from "next/router";
import { beaches } from "../../app/beaches";
import ErrorPage from "next/error";
import styles from "../../styles/Beach.module.css";
import { NextPage } from "next";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import ForecastLineChart from "../../app/components/ForecastLineChart";
import { getAppData } from "../../app/helpers/getAppData";
import { formatData } from "../../app/helpers/formatRawData";
import { Spinner } from "react-bootstrap";

const Beach: NextPage = () => {
    const router = useRouter();
    const { beachName } = router.query;

    const { rawData, isLoading } = getAppData();

    if (isLoading) {
        return (
            <div className={styles.spinner}>
                <Spinner animation="border" />
            </div>
        );
    }
    const { surfData, windData, periodData } = formatData(rawData);

    const beach = beaches.find((x) => x.name.toLowerCase() === beachName);
    if (!beach) {
        return <ErrorPage statusCode={404} />;
    }

    const metserviceUrl = `https://www.metservice.com/marine/regions/${beach.region}/surf/locations/${beach.location}`;

    return (
        <div className={styles.container}>
            <Head>
                <title>Surf Reports</title>
                <meta name="description" content={`Omaha surf`} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.headerButtons}>
                <Link href="/">
                    <button className={styles.goBack}>
                        <i className="bi bi-arrow-left"></i>
                    </button>
                </Link>
                <a className={styles.metserviceLink} href={metserviceUrl}>
                    <i className="bi bi-box-arrow-up-right"></i>
                </a>
            </div>
            <main className={styles.main}>
                <div className={styles.grid}>
                    <h1 className={styles.title}>{beach.name}</h1>
                    <div className={styles.chartcard}>
                        <ForecastLineChart data={surfData} beachName={beach.name} title="Wave height" />
                    </div>
                    <div className={styles.chartcard}>
                        <ForecastLineChart data={windData} beachName={beach.name} title="Wind" />
                    </div>
                    <div className={styles.chartcard}>
                        <ForecastLineChart data={periodData} beachName={beach.name} title="Period" />
                    </div>
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

export default Beach;
