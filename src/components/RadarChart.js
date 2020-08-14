import { Radar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
    extends: Radar,
    mixins: [reactiveProp],
    data () {
        return {
            options: {
                scale: {
                    ticks: {
                        display: false
                    },
                    gridLines: {
                        display: false
                    },
                    pointLabels: {
                        fontSize: 14,
                        fontColor: 'rgb(255, 255, 255)',
                        fontStyle: 'Montserrat'
                    }
                },
                legend: {
                    display: false
                },
                elements: {
                    point: {
                        radius: 0,
                        borderWidth: 0
                    }
                }
            }
        }
    },
    plugins: [{
        beforeInit: function (chart) {
            chart.data.labels.forEach(function (e, i, a) {
                if (/\n/.test(e)) {
                    a[i] = e.split(/\n/)
                }
            })
        }
    }],
    mounted () {
        this.renderChart(this.chartData, this.options)
    }
}
