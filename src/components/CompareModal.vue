<template>
    <transition name="modal-fade">
        <div class="modal-backdrop" @click.self="handleShowModal(false)">
            <div class="modal">
                <div class="modal_wrapper"
                    role="dialog"
                    aria-labelledby="modalTitle"
                    aria-describedby="modalDescription">
                    <div v-if="itemLabels.length" class="modal_wrapper-buttons">
                        <button
                            v-for="(item, index) in itemLabels"
                            :key="index"
                            :style="{ '--bgColor': item.backgroundColorNoOp }"
                            :class="{
                                active: item.active
                            }"
                            @click="handleItemsClick(index)">
                                <label>{{item.label}}</label>
                        </button>
                    </div>
                    <div v-if="datacollection.datasets !== undefined" class="modal_wrapper-pagination">
                        <label>{{getCurrentDatasetLabel}}</label>
                        <div class="pagination-buttons">
                            <button @click="handleItemsOrder(-1)"></button>
                                <label>{{currentDatasetIndex + 1}} из {{itemLabels.length}}</label>
                            <button @click="handleItemsOrder(1)"></button>
                        </div>
                    </div>
                    <radar-chart
                        class="modal_wrapper-chart"
                        v-if="datacollection.datasets !== undefined"
                        :styles="styles"
                        :chart-data="datacollection" />
                    <div v-if="!itemLabels.length" class="modal_wrapper-attention">
                        <label>No items to compare! Please choose items to compare and then try again.</label>
                    </div>
                </div>
                <div class="modal_close">
                    <button @click.stop="handleShowModal(false)" aria-label="Close modal">
                        <img alt="Character" src="@/assets/close-cross.png" />
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import RadarChart from './RadarChart'
export default {
    name: 'CompareModal',
    components: {
        RadarChart
    },
    data () {
        return {
            styles: {
                height: '300px',
                width: '300px'
            },
            labels: [
                'Cargo Capacity',
                'Length',
                'Passengers',
                'Max atm. speed',
                'MGLT'
            ],
            datacollection: {},
            currentDatasetIndex: 0,
            itemLabels: []
        }
    },
    mounted () {
        this.currentDatasetIndex = 0
        this.normalizeDatasets()
    },
    beforeDestroy () {
        this.datacollection = {}
    },
    methods: {
        ...mapMutations({
            handleShowModal: 'HANDLE_SHOW_MODAL'
        }),
        assignLabels () {
            this.datacollection.labels = this.currentDatasets[this.currentDatasetIndex]
                .initialData.map((data, index) => {
                    return [this.labels[index], data]
                })
        },
        assignDatasets () {
            this.datacollection.datasets = [...this.currentDatasets.map(dataset => {
                return { ...dataset }
            })]
        },
        normalizeDatasets () {
            if (this.currentDatasets.length) {
                this.itemLabels = this.currentDatasets.map((dataset, index) => {
                    return {
                        label: dataset.label,
                        backgroundColorNoOp: dataset.backgroundColorNoOp,
                        active: index === 0
                    }
                })
                const length = this.labels.length
                const tmp = [...this.currentDatasets.map(dataset => {
                    return [...dataset.initialData]
                })]
                // конвертация данных в формат от 0 до 1 для нормального отображения графика
                for (let i = 0; i < length; i++) {
                    const values = tmp.map(item => {
                        return item[i]
                    })
                    const max = Math.max(...values)
                    tmp.forEach(item => {
                        item[i] = (item[i] / max).toFixed(2)
                        return item
                    })
                }
                this.currentDatasets.forEach((dataset, index) => {
                    dataset.data = tmp[index]
                    return dataset
                })
                this.assignLabels()
                this.assignDatasets()
            }
        },
        handleItemsOrder (direction) {
            if (this.currentDatasetIndex + direction < 0) {
                this.currentDatasetIndex = this.datacollection.datasets.length - 1
            } else if (this.currentDatasetIndex + direction === this.datacollection.datasets.length) {
                this.currentDatasetIndex = 0
            } else {
                this.currentDatasetIndex += direction
            }
            const tempDatasets = [...this.datacollection.datasets.map(dataset => {
                return { ...dataset }
            })]

            direction > 0 ? this.datasetsMoveForward(tempDatasets) : this.datasetsMoveBackward(tempDatasets)
            this.assignLabels()
            this.datacollection.datasets = [...tempDatasets]
            this.datacollection = { ...this.datacollection }
            this.itemLabels.forEach((item, index) => {
                item.active = index === this.currentDatasetIndex
                return item
            })
        },
        datasetsMoveForward (arr) {
            const element = arr[0]
            arr.splice(0, 1)
            arr.splice(arr.length + 1, 0, element)
        },
        datasetsMoveBackward (arr) {
            const element = arr[arr.length - 1]
            arr.splice(arr.length - 1, 1)
            arr.splice(0, 0, element)
        },
        handleItemsClick (index) {
            if (index !== this.currentDatasetIndex) {
                const tempDatasets = [...this.datacollection.datasets.map(dataset => {
                    return { ...dataset }
                })]
                this.assignLabels()
                index > this.currentDatasetIndex
                    ? this.changeOrderIndexBigger(tempDatasets, index - this.currentDatasetIndex)
                    : this.changeOrderIndexSmaller(tempDatasets, this.currentDatasetIndex - index)
                this.datacollection.datasets = [...tempDatasets]
                this.datacollection = { ...this.datacollection }
                this.currentDatasetIndex = index
                this.itemLabels.forEach((item, index) => {
                    item.active = index === this.currentDatasetIndex
                    return item
                })
            }
        },
        changeOrderIndexBigger (arr, index) {
            const elements = arr.slice(0, index)
            arr.splice(0, index)
            arr.splice(arr.length + 1, 0, ...elements)
        },
        changeOrderIndexSmaller (arr, index) {
            const elements = arr.slice(-index)
            arr.splice(-index)
            arr.splice(0, 0, ...elements)
        }
    },
    computed: {
        ...mapState([
            'currentDatasets'
        ]),
        getCurrentDatasetLabel () {
            return this.itemLabels.filter(item => item.active)[0].label
        }
    },
    watch: {
        currentDatasets: function () {
            this.datacollection = {}
            this.normalizeDatasets()
        }
    }
}
</script>

<style lang="scss">
    .modal-backdrop {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(39, 45, 59, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modal {
        display: flex;
        flex-direction: row;
        &_wrapper {
            padding: 15px 20px;
            background: #272D3B;
            border-radius: 6px;
            position: static;
            &-buttons {
                text-align: center;
                max-width: 420px;
                margin-bottom: 30px;
                button {
                    background-color: #272D3B;
                    border: 2px solid #272D3B;
                    padding: 6px 10px 6px 0px;
                    font-weight: normal;
                    font-size: 14px;
                    line-height: 17px;
                    color: white;
                    opacity: 0.6;
                    margin-left: 8px;
                    margin-bottom: 5px;
                    &:first-child {
                        margin-left: 0px;
                    }
                    &:before {
                        content: '';
                        display: inline-block;
                        width: 6px;
                        height: 6px;
                        background-color: var(--bgColor);
                        margin: 11.5px 7px 11.5px 10px;
                        vertical-align: middle;
                    }
                    &.active, &:hover {
                        background: #20242F;
                        border: 2px solid #38E5A5;
                        box-sizing: border-box;
                        border-radius: 6px;
                    }
                    &:focus {
                        outline: none;
                    }
                    &:hover {
                        cursor: pointer;
                    }
                    label {
                        vertical-align: middle;
                        cursor: pointer;
                    }
                }
            }
            &-attention {
                font-weight: 300;
                font-size: 16px;
                line-height: 20px;
                color: white;
            }
            &-chart {
                margin: 0 auto;
            }
            &-pagination {
                text-align: center;
                margin-bottom: 30px;
                label {
                    font-weight: 500;
                    font-size: 20px;
                    line-height: 24px;
                    color: white;
                }
                .pagination-buttons {
                    margin-top: 5px;
                    button {
                        padding: 0;
                        border: none;
                        display: inline-block;
                        width: 14px;
                        height: 14px;
                        border-radius: 14px;
                        vertical-align: baseline;
                        background-image: url('../assets/arrow.png');
                        background-color: #38E5A5;
                        background-repeat: no-repeat;
                        background-position: 4px 4px;
                        margin: 3px 8px 3px 0px;
                        cursor: pointer;
                    }
                    label {
                        font-weight: 300;
                        font-size: 16px;
                        line-height: 20px;
                    }
                    button:last-child {
                        margin: 3px 0px 3px 8px;
                        transform: scaleX(-1);
                    }
                    button:hover {
                        background-color: #3efab5;
                    }
                }
            }
        }
        &_close {
            position: static;

            /* Inside Auto Layout */

            flex: none;
            order: 1;
            align-self: flex-start;
            margin-left: 10px;
            button {
                color: white;
                width: 40px;
                height: 40px;
                background: rgba(32, 36, 47, 0.5);
                border-radius: 6px;
                border: none;
                padding: 0px;
                img {
                    vertical-align: middle;
                }
                &:hover {
                    cursor: pointer;
                    background: rgba(32, 36, 47, 0.6);
                }
            }
        }
    }
</style>
