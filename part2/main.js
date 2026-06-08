(function () {
  const D = window.PART2_DATA;
  if (!D) return;

  const PROVINCE_SUFFIX = {
    北京: "北京市",
    天津: "天津市",
    上海: "上海市",
    重庆: "重庆市",
    河北: "河北省",
    山西: "山西省",
    辽宁: "辽宁省",
    吉林: "吉林省",
    黑龙江: "黑龙江省",
    江苏: "江苏省",
    浙江: "浙江省",
    安徽: "安徽省",
    福建: "福建省",
    江西: "江西省",
    山东: "山东省",
    河南: "河南省",
    湖北: "湖北省",
    湖南: "湖南省",
    广东: "广东省",
    海南: "海南省",
    四川: "四川省",
    贵州: "贵州省",
    云南: "云南省",
    陕西: "陕西省",
    甘肃: "甘肃省",
    青海: "青海省",
    台湾: "台湾省",
    内蒙古: "内蒙古自治区",
    广西: "广西壮族自治区",
    西藏: "西藏自治区",
    宁夏: "宁夏回族自治区",
    新疆: "新疆维吾尔自治区",
    香港: "香港特别行政区",
    澳门: "澳门特别行政区",
  };

  function toGeoName(short) {
    return PROVINCE_SUFFIX[short] || short + "省";
  }

  const hoursByProvince = Object.fromEntries(
    D.correlation.map((r) => [r.province, r.hours])
  );

  let mapMode = "undergrad";
  let chinaGeo = null;

  const mapChart = echarts.init(document.getElementById("chart-map"));
  const barChart = echarts.init(document.getElementById("chart-bar"));
  const radialChart = echarts.init(document.getElementById("chart-radial"));
  const scatterChart = echarts.init(document.getElementById("chart-scatter"));
  const lineChart = echarts.init(document.getElementById("chart-line"));

  function mapSeriesData(mode) {
    if (mode === "hours") {
      return D.correlation.map((r) => ({
        name: toGeoName(r.province),
        value: r.hours,
      }));
    }
    return D.mapData.map((r) => ({
      name: toGeoName(r.province),
      value: +(r.undergrad * 100).toFixed(1),
    }));
  }

  function renderMap() {
    if (!chinaGeo) return;
    const isHours = mapMode === "hours";
    const data = mapSeriesData(mapMode);
    const vals = data.map((d) => d.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);

    mapChart.setOption({
      tooltip: {
        trigger: "item",
        formatter: (p) => {
          if (!p.data) return p.name;
          const unit = isHours ? "小时/天" : "%";
          return `${p.name}<br/>${isHours ? "日均在校时长" : "本科录取率"}：${p.data.value}${unit}`;
        },
      },
      visualMap: {
        left: 20,
        bottom: 30,
        min,
        max,
        text: [isHours ? "高" : "高", isHours ? "低" : "低"],
        inRange: { color: ["#e3f2fd", "#1565c0"] },
        textStyle: { color: "#333", fontSize: 12 },
        calculable: true,
      },
      series: [
        {
          type: "map",
          map: "china",
          roam: false,
          zoom: 1.15,
          label: { show: false },
          itemStyle: {
            areaColor: "#eee",
            borderColor: "#fff",
            borderWidth: 0.6,
          },
          emphasis: {
            label: { show: true, color: "#111", fontSize: 12 },
            itemStyle: { areaColor: "#ff6b6b" },
          },
          data,
        },
      ],
    });
  }

  function initBar() {
    const list = [...D.provinceCompare].sort((a, b) => b.hours - a.hours);
    const provinces = list.map((r) => r.province);
    const hours = list.map((r) => r.hours);
    const rates = list.map((r) => +(r.undergrad * 100).toFixed(1));
    const hoursMin = Math.floor(Math.min(...hours));
    const hoursMax = Math.ceil(Math.max(...hours));
    const rateMax = Math.ceil(Math.max(...rates) / 10) * 10;

    barChart.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params) => {
          let text = `${params[0].axisValue}<br/>`;
          params.forEach((p) => {
            const unit = p.seriesName.includes("时长") ? "h" : "%";
            text += `${p.marker}${p.seriesName}：${p.value}${unit}<br/>`;
          });
          return text;
        },
      },
      legend: {
        data: ["日均在校时长(h)", "本科录取率(%)"],
        bottom: 0,
        textStyle: { color: "#444", fontSize: 12 },
      },
      grid: { left: 72, right: 48, top: 52, bottom: 56 },
      xAxis: [
        {
          type: "value",
          name: "日均在校时长(h)",
          nameLocation: "middle",
          nameGap: 28,
          position: "bottom",
          min: hoursMin - 1,
          max: hoursMax + 1,
          axisLine: { show: true, lineStyle: { color: "#4dabf7" } },
          axisLabel: { color: "#4dabf7" },
          splitLine: { lineStyle: { color: "#eee" } },
        },
        {
          type: "value",
          name: "本科录取率(%)",
          nameLocation: "middle",
          nameGap: 28,
          position: "top",
          min: 0,
          max: rateMax,
          axisLine: { show: true, lineStyle: { color: "#f4a261" } },
          axisLabel: { color: "#f4a261", formatter: "{value}%" },
          splitLine: { show: false },
        },
      ],
      yAxis: {
        type: "category",
        data: provinces,
        axisLabel: { color: "#333", fontSize: 12 },
      },
      series: [
        {
          name: "日均在校时长(h)",
          type: "bar",
          xAxisIndex: 0,
          data: hours,
          itemStyle: { color: "#4dabf7" },
          barGap: "20%",
        },
        {
          name: "本科录取率(%)",
          type: "bar",
          xAxisIndex: 1,
          data: rates,
          itemStyle: { color: "#f4a261" },
        },
      ],
    });
  }

  function initRadial() {
    const sorted = [...D.mapData].sort((a, b) => b.elite92 - a.elite92);
    radialChart.setOption({
      tooltip: {
        trigger: "item",
        formatter: (p) => `${p.name}<br/>985/211 录取率：${(p.value * 100).toFixed(1)}%`,
      },
      polar: { radius: ["12%", "78%"] },
      angleAxis: {
        type: "category",
        data: sorted.map((r) => r.province),
        axisLabel: { fontSize: 12, color: "#444" },
        startAngle: 90,
      },
      radiusAxis: {
        min: 0,
        max: 0.22,
        axisLabel: {
          color: "#888",
          fontSize: 12,
          formatter: (v) => (v * 100).toFixed(0) + "%",
        },
        splitLine: { lineStyle: { color: "#eee" } },
      },
      series: [
        {
          type: "bar",
          data: sorted.map((r) => r.elite92),
          coordinateSystem: "polar",
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#f4a261" },
              { offset: 1, color: "#e76f51" },
            ]),
          },
        },
      ],
    });
  }

  function initScatter() {
    const pts = D.correlation.map((r) => [
      r.hours,
      +(r.undergrad * 100).toFixed(1),
      r.applicants,
      r.province,
    ]);
    scatterChart.setOption({
      tooltip: {
        formatter: (p) => {
          const [, , , name] = p.data;
          return `${name}<br/>在校时长：${p.data[0]}h<br/>本科录取率：${p.data[1]}%<br/>报名人数：${p.data[2]}万`;
        },
      },
      grid: { left: 56, right: 32, top: 40, bottom: 48 },
      xAxis: {
        name: "日均在校时长(h)",
        nameLocation: "middle",
        nameGap: 28,
        min: 12,
        max: 16.5,
        splitLine: { lineStyle: { color: "#eee" } },
        axisLabel: { color: "#666" },
      },
      yAxis: {
        name: "本科录取率(%)",
        nameGap: 36,
        splitLine: { lineStyle: { color: "#eee" } },
        axisLabel: { color: "#666" },
      },
      series: [
        {
          type: "scatter",
          symbolSize: (val) => Math.sqrt(val[2]) * 5 + 12,
          data: pts,
          itemStyle: {
            color: "rgba(230, 57, 70, 0.65)",
            borderColor: "#c1121f",
            borderWidth: 1,
          },
          label: {
            show: true,
            formatter: (p) => p.data[3],
            position: "top",
            fontSize: 12,
            color: "#555",
          },
        },
      ],
    });
  }

  function initLine() {
    const intervals = D.marginal.map((r) => r.interval);
    const rates = D.marginal.map((r) => r.rate);
    lineChart.setOption({
      tooltip: { trigger: "axis" },
      grid: { left: 56, right: 24, top: 36, bottom: 40 },
      xAxis: {
        type: "category",
        data: intervals,
        boundaryGap: false,
        axisLabel: { color: "#666" },
      },
      yAxis: {
        type: "value",
        name: "本科录取率(%)",
        axisLabel: { color: "#666" },
        splitLine: { lineStyle: { color: "#eee" } },
      },
      series: [
        {
          type: "line",
          smooth: true,
          data: rates,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: { color: "#4dabf7", width: 3 },
          itemStyle: { color: "#228be6" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(77, 171, 247, 0.45)" },
              { offset: 1, color: "rgba(77, 171, 247, 0.05)" },
            ]),
          },
          markPoint: {
            data: [{ type: "max", name: "峰值" }],
            label: { color: "#fff" },
          },
        },
      ],
    });
  }

  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      mapMode = btn.dataset.map;
      const title = document.getElementById("map-title");
      title.textContent =
        mapMode === "hours"
          ? "各省份日均在校时长分布地图"
          : "各省份本科录取率分布地图";
      renderMap();
    });
  });

  window.addEventListener("resize", () => {
    mapChart.resize();
    barChart.resize();
    radialChart.resize();
    scatterChart.resize();
    lineChart.resize();
  });

  fetch("https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json")
    .then((r) => r.json())
    .then((geo) => {
      chinaGeo = geo;
      echarts.registerMap("china", geo);
      renderMap();
    })
    .catch(() => {
      document.getElementById("chart-map").innerHTML =
        '<p style="color:#666;text-align:center;padding:3rem;">地图数据加载失败，请检查网络后刷新</p>';
    });

  initBar();
  initRadial();
  initScatter();
  initLine();
})();
