(() => {
    let chartInstances = [];

    const colorWithOpacity = (color, opacity) => {
        const match = /^#([\da-f]{6})$/i.exec(color);
        if (!match) return color;
        const value = match[1];
        return `rgba(${parseInt(value.slice(0, 2), 16)},${parseInt(value.slice(2, 4), 16)},${parseInt(value.slice(4, 6), 16)},${opacity})`;
    };

    const createChart = canvas => {
        const config = JSON.parse(canvas.dataset.chartConfig),
            mutedColor = getComputedStyle(document.documentElement).getPropertyValue('--mu').trim(),
            gridColor = colorWithOpacity(getComputedStyle(document.documentElement).getPropertyValue('--bd').trim(), .6);
        return new Chart(canvas, {
            type: 'line',
            data: {
                labels: config.buckets.map(bucket => bucket.label),
                datasets: config.series.map(item => ({
                    label: item.name,
                    data: item.values,
                    borderColor: item.color,
                    backgroundColor: colorWithOpacity(item.color, .14),
                    fill: config.area,
                    tension: .35,
                    borderWidth: 2.5,
                    pointRadius: 2,
                    pointHoverRadius: 5
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 180 },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            title(items) {
                                const bucket = config.buckets[items[0]?.dataIndex];
                                return bucket ? `${fd(bucket.start)}${bucket.start !== bucket.end ? ` – ${fd(bucket.end)}` : ''}` : ''
                            },
                            label(context) {
                                return `${config.series[context.datasetIndex].name}: ${peso(context.parsed.y)}`
                            }
                        }
                    }
                },
                onClick(event, elements) {
                    if (!elements.length) return;
                    const element = elements[0],
                        bucket = config.buckets[element.index],
                        series = config.series[element.datasetIndex];
                    if (bucket && series) {
                        window.PocketReports.openTransactions(bucket.start, bucket.end, series.type || '', series.category || U.rc || '', U.ra || '')
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: mutedColor, maxTicksLimit: 7, maxRotation: 0 }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: gridColor },
                        ticks: { color: mutedColor, callback: value => peso(Math.round(value)) }
                    }
                }
            }
        });
    };

    function destroy() {
        chartInstances.forEach(chart => chart.destroy());
        chartInstances = [];
    }

    function render(root) {
        if (typeof Chart !== 'function') throw new Error('Chart.js did not load. Check vendor/chartjs/chart.umd.min.js.');
        chartInstances = Array.from(root.querySelectorAll('canvas[data-chart-config]')).map(createChart);
        return chartInstances;
    }

    window.PocketReportCharts = { destroy, render };
})();
