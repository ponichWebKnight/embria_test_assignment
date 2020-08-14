<template>
    <div class="table" ref="tablePage">
        <div class="table__header">
            <span class="table__header-title">{{currentSchema.title}}</span>
            <button
                v-if="currentSchema.title === 'Starships'"
                class="table__header-button"
                @click="showModal">
                <img class="sort_icon" src="@/assets/compare.png" alt="sort" />
                <label>Сравнить</label>
            </button>
        </div>
        <div class="table__content">
            <virtual-scroll :items="currentItems" :item-height="48" class="vscroll" ref="vscroll">
                <template slot-scope="{ items }">
                    <table border="0" cellpadding="0" cellspacing="0">
                        <thead class="header" >
                            <th v-if="currentSchema.title === 'Starships'"></th>
                            <th v-for="(column, index) in currentColumns" :key="index" @click="handleSort(column)">
                                <img class="sort_icon" src="@/assets/chevron-down.png" alt="sort" />
                                <label>{{column.name}}</label>
                            </th>
                        </thead>
                        <tbody class="table-body" ref="table_body">
                            <tr v-for="(item, index) in items"
                                :key="index"
                                :class="{
                                    bordered: item.id % 2
                                }">
                                <td v-if="currentSchema.title === 'Starships'" class="td-checkbox">
                                    <input
                                        :id="item.id"
                                        type="checkbox"
                                        :value="item"
                                        v-model="checkedItems" />
                                    <label :for="item.id"></label>
                                </td>
                                <td v-for="(property, index) in item" :key="index">
                                    <label v-if="index === 'id'">{{property + 1 | handleId}}</label>
                                    <label v-else>{{property}}</label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </template>
            </virtual-scroll>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import VirtualScroll from './VirtualScroll'

export default {
    name: 'Table',
    components: {
        VirtualScroll
    },
    filters: {
        handleId: function (id) {
            if (!id) return ''
            return id < 10 ? '00' + id : '0' + id
        }
    },
    data () {
        return {
            currentSortCol: null,
            currentSortIndexCol: null,
            checkedItems: [],
            datasets: []
        }
    },
    beforeDestroyed () {
        this.$refs.vscroll.$el.removeEventListener('scroll', this._infiniteScroll)
    },
    created () {
        if (this.currentItems.length < 20 && this.currentNextUrl !== null) {
            this.loading()
            const activeTab = this.tabs.filter((tab) => tab.active)[0].name.toLowerCase()
            this.loadNewItems({ cur_next_url: this.currentNextUrl, cur_tab: activeTab })
                .then(() => {
                    this.setCurrentList()
                    this.setCurrentNextUrl()
                })
                .then(() => this.loaded())
        }
    },
    mounted () {
        window.vscroll = this
        this._infiniteScroll = this.infiniteScroll.bind(this)
        this.$refs.vscroll.$el.addEventListener('scroll', this._infiniteScroll)
    },
    methods: {
        ...mapMutations({
            setCurrentList: 'SET_CURRENT_LIST',
            setCurrentSchema: 'SET_CURRENT_SCHEMA',
            setCurrentNextUrl: 'SET_CURRENT_NEXT_URL',
            setCurrentDatasets: 'SET_CURRENT_DATASETS',
            handleShowModal: 'HANDLE_SHOW_MODAL'
        }),
        ...mapActions([
            'loading',
            'loaded',
            'loadNewItems'
        ]),
        // Simple sorting - Простая сортировка
        handleSort (data) {
            this.currentSortCol = data
            if (data.sort === 'asc') {
                if (data.type === 'string') {
                    this.currentItems.sort((a, b) => a[data.column].localeCompare(b[data.column]))
                } else {
                    this.currentItems.sort((a, b) => a[data.column] - b[data.column])
                }
            } else {
                if (data.type === 'string') {
                    this.currentItems.sort((a, b) => b[data.column].localeCompare(a[data.column]))
                } else {
                    this.currentItems.sort((a, b) => b[data.column] - a[data.column])
                }
            }
            const index = this.currentSchema.columns.map(c => c.column).indexOf(data.column)
            this.currentSchema.columns[index].sort = this.currentSchema.columns[index].sort === 'asc' ? 'desc' : 'asc'
            this.currentSortIndexCol = index
        },
        infiniteScroll () {
            const el = this.$refs.vscroll.$el
            const heightCalc = Math.abs(el.scrollTop - (el.scrollHeight - el.clientHeight))
            if (!heightCalc && this.currentNextUrl !== null) {
                const activeTab = this.tabs.filter((tab) => tab.active)[0].name.toLowerCase()
                this.loadNewItems({ cur_next_url: this.currentNextUrl, cur_tab: activeTab })
                    .then(() => {
                        this.setCurrentList()
                        this.setCurrentNextUrl()
                    })
                    .then(() => {
                        // Сохраняем сортировку, если была до получения новых данных
                        if (this.currentSortCol !== null) {
                            this.currentSchema.columns[this.currentSortIndexCol].sort =
                            this.currentSchema.columns[this.currentSortIndexCol].sort === 'asc' ? 'desc' : 'asc'
                            this.handleSort(this.currentSortCol)
                        }
                    })
            }
        },
        showModal () {
            this.datasets = []
            this.checkedItems.forEach(item => {
                const colors = this.dynamicColor()
                this.datasets.push({
                    label: item.name,
                    backgroundColor: colors.opacityColor,
                    backgroundColorNoOp: colors.normalColor,
                    initialData: [
                        item.cargo_capacity,
                        item.length,
                        item.passengers,
                        item.max_atmosphering_speed,
                        item.MGLT
                    ]
                })
            })
            this.setCurrentDatasets(this.datasets)
            this.handleShowModal(true)
        },
        dynamicColor () {
            const r = Math.floor(Math.random() * 255)
            const g = Math.floor(Math.random() * 255)
            const b = Math.floor(Math.random() * 255)
            const a = 0.9
            return {
                normalColor: 'rgba(' + r + ', ' + g + ', ' + b + ')',
                opacityColor: 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')'
            }
        }
    },
    computed: {
        ...mapState([
            'tabs',
            'currentItems',
            'currentSchema',
            'currentNextUrl',
            'isLoaded'
        ]),
        ...mapGetters({
            currentColumns: 'getCurrentColumns'
        })
    }
}
</script>

<style lang="scss">
    .table {
        min-width: 700px;
        min-height: 670px;
        height: 100%;
        width: 100%;
        &__header {
            height: 70px;
            background-color: #20242F;
            color: white;
            text-align: center;
            &-title {
                float: left;
                font-weight: 500;
                font-size: 20px;
                line-height: 24px;
                padding-top: 20px;
                padding-left: 20px;
                margin: 8px auto;
            }
            &-button {
                float: right;
                background-color: #1DB7C2;
                border-radius: 6px;
                border: none;
                width: 130px;
                height: 40px;
                margin-top: 20px;
                margin-right: 20px;
                label {
                    vertical-align: middle;
                    margin-left: 10px;
                    font-weight: 600;
                    font-size: 14px;
                    line-height: 17px;
                    color: white;
                    cursor: pointer;
                }
                img {
                    vertical-align: middle;
                }
                &:hover {
                    cursor: pointer;
                    background-color: #21cad6;
                }
            }
        }
        &__content {
            display: grid;
            height: calc(100% - 70px);
            .vscroll {
                height: 100%;
                background: #eee;
                overflow-anchor: none;
                overflow: auto;
            }
            .vscroll-holder {
                table {
                    width: 100%;
                    white-space: nowrap;
                    border-collapse: collapse;
                    height: 100%;
                    border-spacing: 0;
                    font-weight: normal;
                    font-size: 14px;
                    line-height: 115%;
                }
                thead {
                    th {
                        height: 48px;
                        text-align: left;
                        padding-left: 10px;
                        background-color: #20242F;
                        color: white;
                        letter-spacing: 0.01em;
                        position: -webkit-sticky;
                        position: sticky;
                        top: 0;
                        label {
                            vertical-align: middle;
                            margin-left: 3px;
                        }
                        img {
                            vertical-align: middle;
                        }
                        &:first-child:before {
                            content: '';
                        }
                    }
                }
                tbody {
                    td {
                        padding: 16px;
                        letter-spacing: 0.01em;
                        &.td-checkbox {
                            padding: 14px 15px 14px 15px;
                            input[type="checkbox"] {
                                display: none;
                            }
                            label {
                                font-weight: normal;
                                font-size: 14px;
                                line-height: 17px;
                                margin-left: 0px;
                            }
                            label:before {
                                content: '';
                                display: inline-block;
                                width: 20px;
                                height: 20px;
                                border-radius: 50%;
                                border: 2px solid #1DB7C2;
                                vertical-align: middle;
                            }
                            input[type="checkbox"]:checked + label:before {
                                content: '';
                                text-align: center;
                                background-image: url('../../assets/white-checkbox-checked.png');
                                background-position: center;
                                background-size: 55%;
                                background-color: #1DB7C2;
                                background-repeat: no-repeat;
                            }
                        }
                        label {
                            margin-left: 3px;
                        }
                    }
                    tr.bordered {
                        background-color: #F9FAFC;
                        box-shadow: inset 0px 1px 0px #E6E7E9, inset 0px -1px 0px #E6E7E9;
                    }
                }
            }
        }
    }
</style>
