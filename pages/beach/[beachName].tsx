import { useRouter } from "next/router";
import { beaches } from "../../app/beaches";
import ErrorPage from "next/error";
import getForecastData from "../../app/helpers/getForecastData";
import styles from "../../styles/Beach.module.css";
import { NextPage } from "next";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import ForecastLineChart from "../../app/components/ForecastLineChart";
import { PageProps } from "../../app/types/IndexPageProps";
import { getPageProps } from "../../app/propsGenerators/pagePropsGenerator";

const Beach: NextPage<PageProps> = ({ surfData, windData, periodData }: PageProps) => {
    const router = useRouter();
    const { beachName } = router.query;

    const beach = beaches.find((x) => x.name.toLowerCase() === beachName);
    if (!beach) {
        return <ErrorPage statusCode={404} />;
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Surf Reports</title>
                <meta name="description" content={`Omaha surf`} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Link href="/">
                <button className={styles.goBack}>
                    <i className="bi bi-arrow-left"></i>
                </button>
            </Link>
            <main className={styles.main}>
                <div className={styles.grid}>
                    <h1 className={styles.title}>{beach.name}</h1>
                    <div className={styles.topleft}>
                        <div className={styles.card}>
                            <h2>Description</h2>
                            <p>Located just north of Waikato. Port Waikato is a lovely drive. Strong swell</p>
                        </div>
                        <div className={styles.card}>
                            <p>Weather</p>
                            <div className={styles.weatherIcon}>
                                <i className="bi bi-brightness-high"></i>
                            </div>
                        </div>
                        <div className={styles.card}>
                            <p>Rating</p>
                            <h1>10</h1>
                        </div>
                        <div className={styles.card}>
                            <h2>Another metric</h2>
                            <p>9 degrees west</p>
                        </div>
                    </div>
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

export async function getServerSideProps() {
    return {
        props: await getPageProps(),
    };
}

export default Beach;
