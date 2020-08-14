<template>
    <div class="tableview">
        <div class="tableview__title">
            <label>Table view</label>
        </div>
        <div class="tableview__content">
            <div class="content__title">
                <label>show columns</label>
            </div>
            <div class="content__columns">
                <div class="content__column" v-for="(checkbox, index) in currentSchema.columns" :key="index">
                    <template v-if="checkbox.column !== 'id'">
                        <input
                            type="checkbox"
                            :id="checkbox.name"
                            :checked="checkbox.active"
                            @click="handleState(checkbox)" />
                        <label :for="checkbox.name">{{checkbox.name}}</label>
                    </template>
                </div>
            </div>
            <div class="images">
                <div class="images__wrapper">
                    <img alt="Comsoms" src="@/assets/cosmos.png" />
                    <img class="cosmos-rings" alt="Cosmos rings" src="@/assets/cosmos-rings.png" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'TableView',
    methods: {
        ...mapMutations({
            setCurrentList: 'SET_CURRENT_LIST'
        }),
        handleState (checkbox) {
            const index = this.currentSchema.columns.map(c => c.column).indexOf(checkbox.column)
            this.currentSchema.columns[index].active = !this.currentSchema.columns[index].active
            this.setCurrentList()
        }
    },
    computed: {
        ...mapState([
            'currentSchema',
            'starships'
        ])
    }
}
</script>

<style lang="scss">
    .tableview {
        display: inline-block;
        min-width: 290px;
        background-color: #313745;
        font-family: Montserrat;
        font-style: normal;
        color: white;

        &__title {
            font-weight: 500;
            font-size: 20px;
            line-height: 24px;
            padding: 17px 20px 19px 20px;
        }

        &__content {
            padding: 10px 20px 30px 20px;
            display: flex;
            flex-direction: column;
            height: calc(100% - 100px);
            .content {
                &__title {
                    text-transform: uppercase;
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 17px;
                }
                &__column {
                    padding-top: 10px;
                    input[type="checkbox"] {
                        display: none;
                    }
                    label {
                        font-weight: normal;
                        font-size: 14px;
                        line-height: 17px;
                        padding-left: 10px;
                    }
                    label:before {
                        content: '';
                        display: inline-block;
                        width: 28px;
                        height: 28px;
                        background-color: #474D59;
                        border-radius: 2px;
                        vertical-align: middle;
                        margin: 0px 10px 0px -10px;
                    }
                    input[type="checkbox"]:checked + label:before {
                        content: '';
                        text-align: center;
                        background-image: url('../../assets/checkbox-checked.png');
                        background-position: center;
                        background-size: 55%;
                        background-repeat: no-repeat;
                    }
                }
            }
            .images {
                height: 100%;
                display: flex;
                flex-direction: column;
                &__wrapper {
                    margin-top: auto;
                    height: 262px;
                    bottom: 0;
                    top: 0;
                    left: 0;
                    position: relative;
                    .cosmos-rings {
                        position: absolute;
                        top: 97px;
                        right: -20px;
                    }
                }
            }
        }
    }
</style>
