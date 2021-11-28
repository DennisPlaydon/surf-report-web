import React from "react";
import { Line } from "react-chartjs-2";

export type ForecastLineChartProps = {
    data: any;
    beachName: string;
    title: string;
};

const ForecastLineChart = ({ data, beachName, title }: ForecastLineChartProps) => {
    const labels = data.map((x: any) => x.time);
    const values = data.map((x: any) => x[beachName]);

    const randomColour = () => Math.random() * 255;

    const chartData = {
        labels,
        datasets: [
            {
                backgroundColor: `rgba(${randomColour()}, ${randomColour()}, ${randomColour()}, 0.5)`,
                data: values,
                fill: true,
            },
        ],
    };

    const tooltipOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `Value: ${context.parsed.y}`;
                    },
                    title: function (context: any) {
                        let tooltipHeading = context[0].label;
                        return new Date(tooltipHeading).toLocaleString([], {
                            weekday: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                        });
                    },
                },
            },
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: `${title}`,
            },
        },
        scales: {
            x: {
                ticks: {
                    callback: function (value: string | number) {
                        return new Date(labels[value]).toLocaleDateString("EN-en", { weekday: "short" });
                    },
                },
            },
        },
    };

    return <Line data={chartData} options={tooltipOptions} />;
};

export default ForecastLineChart;
