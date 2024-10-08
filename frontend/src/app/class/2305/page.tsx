"use client";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { useState, useEffect } from "react";
import _ from "lodash";
import flags from "./flags";

echarts.registerTheme("my_theme", {
    backgroundColor: "#fff",
});

const updateFrequency = 2000;
const dimension = 0;
const countryColors: any = {
    Australia: "#00008b",
    Canada: "#f00",
    China: "#ffde00",
    Cuba: "#002a8f",
    Finland: "#003580",
    France: "#ed2939",
    Germany: "#000",
    Iceland: "#003897",
    India: "#f93",
    Japan: "#bc002d",
    "North Korea": "#024fa2",
    "South Korea": "#000",
    "New Zealand": "#00247d",
    Norway: "#ef2b2d",
    Poland: "#dc143c",
    Russia: "#d52b1e",
    Turkey: "#e30a17",
    "United Kingdom": "#00247d",
    "United States": "#b22234",
};

export default function Page() {
    const [data, setData] = useState(null);

    const [option, setOption] = useState(null);

    const [isLoading, setLoading] = useState(true);

    function updateYear(data: any, option: any, year: number) {
        let source = data.slice(1).filter(function (d: any) {
            return d[4] === year;
        });
        const newOption = _.cloneDeep(option); // immutable
        newOption.series[0].data = source;
        newOption.graphic.elements[0].style.text = year;
        setOption(newOption);
    }

    useEffect(() => {
        fetch("/data/life-expectancy-table.json")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                const years: any = [];
                for (let i = 0; i < data.length; ++i) {
                    if (
                        years.length === 0 ||
                        years[years.length - 1] !== data[i][4]
                    ) {
                        years.push(data[i][4]);
                    }
                }

                function getFlag(countryName: string) {
                    if (!countryName) {
                        return "";
                    }
                    return (
                        flags.find(function (item: any) {
                            return item.name === countryName;
                        }) || {}
                    ).emoji;
                }
                let startIndex = 0;
                let startYear = years[startIndex];
                let option = {
                    grid: {
                        top: 10,
                        bottom: 30,
                        left: 150,
                        right: 80,
                    },
                    xAxis: {
                        max: "dataMax",
                        axisLabel: {
                            formatter: function (n: number) {
                                return Math.round(n) + "";
                            },
                        },
                    },
                    dataset: {
                        source: data.slice(1).filter(function (d: any) {
                            return d[4] === startYear;
                        }),
                    },
                    yAxis: {
                        type: "category",
                        inverse: true,
                        max: 20,
                        axisLabel: {
                            show: true,
                            fontSize: 14,
                            formatter: function (value: string) {
                                return value + "{flag|" + getFlag(value) + "}";
                            },
                            rich: {
                                flag: {
                                    fontSize: 25,
                                    padding: 5,
                                },
                            },
                        },
                        animationDuration: 300,
                        animationDurationUpdate: 300,
                    },
                    series: [
                        {
                            realtimeSort: true,
                            seriesLayoutBy: "column",
                            type: "bar",
                            itemStyle: {
                                color: function (param: any) {
                                    return (
                                        countryColors[param.value[3]] ||
                                        "#5470c6"
                                    );
                                },
                            },
                            encode: {
                                x: dimension,
                                y: 3,
                            },
                            label: {
                                show: true,
                                precision: 1,
                                position: "right",
                                valueAnimation: true,
                                fontFamily: "monospace",
                            },
                        },
                    ],
                    // Disable init animation.
                    animationDuration: 0,
                    animationDurationUpdate: updateFrequency,
                    animationEasing: "linear",
                    animationEasingUpdate: "linear",
                    graphic: {
                        elements: [
                            {
                                type: "text",
                                right: 160,
                                bottom: 60,
                                style: {
                                    text: startYear,
                                    font: "bolder 80px monospace",
                                    fill: "rgba(100, 100, 100, 0.25)",
                                },
                                z: 100,
                            },
                        ],
                    },
                };
                // setOption(option);
                setLoading(false);
                for (let i = startIndex; i < years.length - 1; ++i) {
                    setTimeout(function () {
                        updateYear(data, option, years[i + 1]);
                    }, (i - startIndex) * updateFrequency);
                }
            });
    }, []);

    if (isLoading || !flags || !data) return <p>Loading...</p>;

    return (
        <div>
            <ReactECharts
                option={option}
                theme="my_theme"
                style={{ height: 800 }}
            />
        </div>
    );
}
