import React from "react";
import { Line } from "react-chartjs-2";

export type ForecastLineChartProps = {
    data: any;
    beachName: string;
    title: string;
};

const ForecastLineChart = ({ data, beachName, title }: ForecastLineChartProps) => {
    // const labels = data.map((x: any) => x.time);
    const labels = data.map((x: any) => new Date(x.time).toLocaleDateString("EN-en", { weekday: "short" }));
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
                        return new Date(tooltipHeading).toLocaleTimeString([], {
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
    };

    return <Line data={chartData} options={tooltipOptions} />;
};

export default ForecastLineChart;
