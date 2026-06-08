/* 图表数据（来自 xlsx） */
var birthGaokaoTrend = [
  { year: 2018, gaokao: 975, birthYear: 2000, birth: 1778 },
  { year: 2019, gaokao: 1031, birthYear: 2001, birth: 1702 },
  { year: 2020, gaokao: 1071, birthYear: 2002, birth: 1647 },
  { year: 2021, gaokao: 1078, birthYear: 2003, birth: 1599 },
  { year: 2022, gaokao: 1193, birthYear: 2004, birth: 1593 },
  { year: 2023, gaokao: 1291, birthYear: 2005, birth: 1617 },
  { year: 2024, gaokao: 1342, birthYear: 2006, birth: 1584 },
  { year: 2025, gaokao: 1335, birthYear: 2007, birth: 1594 },
  { year: 2026, gaokao: 1340, birthYear: 2008, birth: 1608 },
  { year: 2027, gaokao: 1346, birthYear: 2009, birth: 1615 },
  { year: 2028, gaokao: 1351, birthYear: 2010, birth: 1592 },
  { year: 2029, gaokao: 1354, birthYear: 2011, birth: 1604 },
  { year: 2030, gaokao: 1361, birthYear: 2012, birth: 1635 },
  { year: 2031, gaokao: 1357, birthYear: 2013, birth: 1640 },
  { year: 2032, gaokao: 1370, birthYear: 2014, birth: 1687 },
  { year: 2033, gaokao: 1378, birthYear: 2015, birth: 1655 },
  { year: 2034, gaokao: 1412, birthYear: 2016, birth: 1883 },
  { year: 2035, gaokao: 1404, birthYear: 2017, birth: 1765 },
];

var provinceCompare = [
  { province: "河南", gaokaoShare: 10.738255033557, rate985: 1.4 },
  { province: "山东", gaokaoShare: 7.87998420844848, rate985: 1.7 },
  { province: "河北", gaokaoShare: 6.94828266877221, rate985: 1.2 },
  { province: "四川", gaokaoShare: 6.55349388077379, rate985: 1.3 },
  { province: "广东", gaokaoShare: 6.000789577576, rate985: 1.4 },
  { province: "湖南", gaokaoShare: 5.52704303197789, rate985: 1.0 },
  { province: "安徽", gaokaoShare: 5.29016975917884, rate985: 1.1 },
  { province: "江西", gaokaoShare: 5.13225424397947, rate985: 1.0 },
  { province: "湖北", gaokaoShare: 4.10580339518358, rate985: 1.8 },
  { province: "广西", gaokaoShare: 3.78997236478484, rate985: 1.4 },
  { province: "江苏", gaokaoShare: 3.78997236478484, rate985: 1.6 },
  { province: "贵州", gaokaoShare: 3.99526253454402, rate985: 1.1 },
  { province: "云南", gaokaoShare: 3.20568495854718, rate985: 1.2 },
  { province: "浙江", gaokaoShare: 3.19778918278721, rate985: 1.8 },
  { province: "福建", gaokaoShare: 1.9502566127122, rate985: 1.7 },
  { province: "山西", gaokaoShare: 2.79510461902882, rate985: 1.7 },
  { province: "陕西", gaokaoShare: 2.76352151598895, rate985: 2.0 },
  { province: "重庆", gaokaoShare: 2.76352151598895, rate985: 1.8 },
  { province: "甘肃", gaokaoShare: 2.05290169759179, rate985: 1.3 },
  { province: "新疆", gaokaoShare: 1.81602842479274, rate985: 1.5 },
  { province: "内蒙古", gaokaoShare: 1.81602842479274, rate985: 1.1 },
  { province: "辽宁", gaokaoShare: 1.60284247927359, rate985: 2.0 },
  { province: "黑龙江", gaokaoShare: 1.66600868535334, rate985: 1.6 },
  { province: "吉林", gaokaoShare: 1.04224240031583, rate985: 3.2 },
  { province: "宁夏", gaokaoShare: 0.64745361231741, rate985: 2.1 },
  { province: "海南", gaokaoShare: 0.576391630477694, rate985: 1.5 },
  { province: "天津", gaokaoShare: 0.584287406237663, rate985: 6.0 },
  { province: "青海", gaokaoShare: 0.465850769838137, rate985: 2.7 },
  { province: "上海", gaokaoShare: 0.457954994078168, rate985: 4.4 },
  { province: "北京", gaokaoShare: 0.536912751677852, rate985: 5.3 },
  { province: "西藏", gaokaoShare: 0.307935254638768, rate985: 1.3 },
];

function initBirthGaokaoChart(dom) {
  var chart = echarts.init(dom);
  var years = birthGaokaoTrend.map(function (d) {
    return String(d.year);
  });

  chart.setOption({
    backgroundColor: "transparent",
    title: {
      text: "出生人口与高考报名人数预测趋势",
      left: "center",
      top: 0,
      textStyle: { color: "#aaa", fontSize: 15, fontWeight: 400 },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(20,20,20,0.92)",
      borderColor: "#333",
      textStyle: { color: "#eee", fontSize: 13 },
      formatter: function (params) {
        var idx = params[0] ? params[0].dataIndex : 0;
        var row = birthGaokaoTrend[idx];
        var html =
          '<div style="font-weight:600;margin-bottom:6px">' +
          row.year +
          "年高考</div>";
        params.forEach(function (p) {
          html +=
            "<div>" +
            p.marker +
            p.seriesName +
            "：<b>" +
            p.value +
            "</b> 万人</div>";
        });
        html +=
          '<div style="margin-top:4px;color:#888">对应出生年份 ' +
          row.birthYear +
          "</div>";
        return html;
      },
    },
    grid: { left: 52, right: 24, top: 48, bottom: 36 },
    xAxis: {
      type: "category",
      data: years,
      boundaryGap: false,
      axisLine: { lineStyle: { color: "#444" } },
      axisLabel: { color: "#888", fontSize: 12 },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      name: "万人",
      nameTextStyle: { color: "#666", fontSize: 12 },
      min: 900,
      max: 2000,
      splitLine: { lineStyle: { color: "#1f1f1f" } },
      axisLine: { show: false },
      axisLabel: { color: "#888", fontSize: 12 },
    },
    series: [
      {
        name: "出生人口",
        type: "line",
        smooth: true,
        symbol: "none",
        lineStyle: { width: 1, color: "rgba(145,213,255,0.6)" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(145,213,255,0.55)" },
            { offset: 1, color: "rgba(145,213,255,0.05)" },
          ]),
        },
        data: birthGaokaoTrend.map(function (d) {
          return d.birth;
        }),
        z: 1,
      },
      {
        name: "高考报名人数",
        type: "line",
        smooth: true,
        symbol: "none",
        lineStyle: { width: 1, color: "rgba(180,180,180,0.6)" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(140,140,140,0.5)" },
            { offset: 1, color: "rgba(140,140,140,0.05)" },
          ]),
        },
        data: birthGaokaoTrend.map(function (d) {
          return d.gaokao;
        }),
        z: 2,
        markArea: {
          silent: true,
          itemStyle: { color: "rgba(255,77,79,0.06)" },
          data: [[{ xAxis: "2026" }, { xAxis: "2035" }]],
        },
      },
    ],
  });

  window.addEventListener("resize", function () {
    chart.resize();
  });
  return chart;
}

function initProvinceChart(dom) {
  var chart = echarts.init(dom);
  var sorted = provinceCompare.slice().sort(function (a, b) {
    return b.gaokaoShare - a.gaokaoShare;
  });
  var provinces = sorted.map(function (d) {
    return d.province;
  });

  chart.setOption({
    backgroundColor: "transparent",
    title: {
      text: "2024年全国985高校招生计划分布",
      subtext: "左：高考报名人数占比 ｜ 右：985录取率",
      left: "center",
      top: 0,
      textStyle: { color: "#aaa", fontSize: 15, fontWeight: 400 },
      subtextStyle: { color: "#666", fontSize: 12 },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "rgba(20,20,20,0.92)",
      borderColor: "#333",
      textStyle: { color: "#eee", fontSize: 12 },
      formatter: function (params) {
        var name = params[0] ? params[0].axisValue : "";
        var row = null;
        for (var i = 0; i < sorted.length; i++) {
          if (sorted[i].province === name) {
            row = sorted[i];
            break;
          }
        }
        if (!row) return "";
        return (
          '<div style="font-weight:600;margin-bottom:6px">' +
          name +
          "</div>" +
          '<div><span style="color:#ffbb96">●</span> 高考报名占比：<b>' +
          row.gaokaoShare.toFixed(2) +
          "%</b></div>" +
          '<div><span style="color:#69c0ff">●</span> 985录取率：<b>' +
          row.rate985 +
          "%</b></div>"
        );
      },
    },
    grid: { left: 8, right: 16, top: 56, bottom: 12, containLabel: true },
    xAxis: {
      type: "value",
      min: -12,
      max: 7,
      splitLine: { lineStyle: { color: "#1a1a1a" } },
      axisLine: { lineStyle: { color: "#333" } },
      axisLabel: {
        color: "#888",
        fontSize: 12,
        formatter: function (v) {
          return Math.abs(v) + "%";
        },
      },
    },
    yAxis: {
      type: "category",
      data: provinces,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#ccc", fontSize: 12 },
    },
    series: [
      {
        name: "高考报名占比",
        type: "bar",
        data: sorted.map(function (d) {
          return -d.gaokaoShare;
        }),
        barWidth: 12,
        z: 2,
        itemStyle: { color: "#ffbb96", borderRadius: [3, 0, 0, 3] },
      },
      {
        name: "985录取率",
        type: "bar",
        barGap: "-100%",
        data: sorted.map(function (d) {
          return d.rate985;
        }),
        barWidth: 12,
        z: 1,
        itemStyle: { color: "#69c0ff", borderRadius: [0, 3, 3, 0] },
      },
    ],
  });

  window.addEventListener("resize", function () {
    chart.resize();
  });
  return chart;
}

function initAllCharts() {
  if (typeof echarts === "undefined") {
    console.error("ECharts 未加载，请检查网络或使用本地服务器打开页面");
    return;
  }
  var birthEl = document.getElementById("chart-birth");
  var provinceEl = document.getElementById("chart-province");
  if (birthEl) initBirthGaokaoChart(birthEl);
  if (provinceEl) initProvinceChart(provinceEl);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAllCharts);
} else {
  initAllCharts();
}
