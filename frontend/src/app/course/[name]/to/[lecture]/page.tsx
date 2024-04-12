"use client";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { useState, useEffect } from "react";
import _ from "lodash";
import { createOption } from "../../../race";

echarts.registerTheme("my_theme", {
    backgroundColor: "#fff",
});

export default function Page({
    params,
}: {
    params: { name: string; lecture: number };
}) {
    const [option, setOption] = useState(
        createOption(params.name, params.lecture, false)
    );

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
