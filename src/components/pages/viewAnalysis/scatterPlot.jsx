import React, {useEffect, useRef, useState} from 'react';
import {Scatter} from 'react-chartjs-2';
import {Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Tooltip} from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';
import color_bar from '../../../images/color_bar.png'
import {getAnalysisCoordinatesHandler} from "../../api/apiHandlers";

export function ScatterPlot(props) {
    const chartRef = useRef();
    ChartJS.register(LinearScale, PointElement, LineElement, Tooltip);
    ChartJS.register(zoomPlugin)

    const analysisName = props.analysisName;

    const [dataSets, setDataSets] = useState([]);

    const getAnalysisCoordinates = () => {
        function setCoordinates(coordinates) {
            console.log("Coordinates: ", coordinates);
            const uniqueClusters = [...new Set(coordinates.map(item => item['ClusterID']))];
            console.log("Unique clusters: ", uniqueClusters);

            if (uniqueClusters.length <= 20) {
                // Treat them as a discrete variable
                ChartJS.register(Legend);
                let data = []
                for (let i = 0; i < coordinates.length; i++) {

                    if (data.some(e => e.label === "Cluster: " + coordinates[i]['ClusterID'])) {
                        data.find(e => e.label === "Cluster: " + coordinates[i]['ClusterID']).data.push({
                            cell: coordinates[i]['Cell'],
                            x: coordinates[i]['UMAP1'],
                            y: coordinates[i]['UMAP2']
                        })
                    } else
                        data.push({
                            label: "Cluster: " + coordinates[i]['ClusterID'],
                            data: [{
                                cell: coordinates[i]['Cell'],
                                x: coordinates[i]['UMAP1'],
                                y: coordinates[i]['UMAP2']
                            }],
                            backgroundColor: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
                            // borderColor: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
                        })
                }

                setDataSets(data);

            } else {
                // Treat them as a continuous variable (color)
                // Scale the color intensity from 0 to 1
                ChartJS.unregister(Legend);
                let min = Math.min(...uniqueClusters);
                let max = Math.max(...uniqueClusters);
                let data = []
                for (let i = 0; i < coordinates.length; i++) {
                    let clusterVal = coordinates[i]['ClusterID'];
                    let pointColor = "";

                    if (clusterVal > 0)
                        pointColor = 'rgba(255, 0, 0, ' + (clusterVal - min) / (max - min) + ')'
                    else if (clusterVal === "0.0" || clusterVal === "-0.0")
                        pointColor = "rgba(255, 255, 255, 0)"
                    else
                        pointColor = 'rgba(0, 0, 255, ' + (Math.abs(clusterVal) - min) / (max - min) + ')'

                    data.push({
                        label: "Cluster: " + coordinates[i]['ClusterID'],
                        data: [{
                            cell: coordinates[i]['Cell'],
                            x: coordinates[i]['UMAP1'],
                            y: coordinates[i]['UMAP2']
                        }],
                        backgroundColor: pointColor,
                        // borderColor: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
                    })
                }

                setDataSets(data);

            }

        }

        getAnalysisCoordinatesHandler(analysisName)
            .then(res => {
                // console.log("res.data", res.data);
                setCoordinates(res.data.data);
            })
            .catch(err => {
                console.log(err);
            });
    };


    useEffect(() => {
        getAnalysisCoordinates();
    }, [analysisName, props.isChanged]);

    const options = {
        maintainAspectRatio: true,
        scales: {},
        plugins: {
            responsive: true,
            zoom: {
                pan: {
                    enabled: true,
                    mode: function () {
                        return 'xy';
                    }
                },
                zoom: {
                    enabled: true,
                    wheel: {enabled: true,},
                    pinch: {enabled: true},
                    mode: 'xy',
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return context.dataset.data[context.dataIndex].cell
                            + " (" + context.dataset.data[context.dataIndex].x
                            + ", " + context.dataset.data[context.dataIndex].y + ")";
                    },

                }
            }
        },
        gridLines: {
            display: false
        },

        events: ['click'],
        onClick: (e, activeEls) => {

            if (activeEls.length > 0) {
                let datasetIndex = activeEls[0].datasetIndex;
                let dataIndex = activeEls[0].index;
                let datasetLabel = e.chart.data.datasets[datasetIndex].label;
                let value = e.chart.data.datasets[datasetIndex].data[dataIndex];
                let label = e.chart.data.labels[dataIndex];

                // console.log("In click", datasetLabel, label, value);
                console.log("Clicked", value)

                // Change the point color when clicked
                e.chart.data.datasets[datasetIndex].backgroundColor[dataIndex] = 'red';
                e.chart.update();

            }
        }
    };


    const data = {
        datasets: dataSets
    };

    return (
        <>
            <Scatter
                ref={chartRef}
                width='95%'
                height='90%'
                data={data}
                options={options}
            />
            <div>
                <img className={"ml-8 mt-8 mr-8"} src={color_bar} height={"500"} width={"500"}/>
                <div className={"flex flex-row ml-6"}>
                    <p>min</p>
                    <p className={"ml-20"}>max</p>
                </div>
            </div>
        </>
    );
}