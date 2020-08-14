<template>
    <div class="sidebar">
        <div class="sidebar__image">
            <img alt="Character" src="@/assets/character.png" />
        </div>
        <div class="sidebar__tabs">
            <div class="sidebar__tab"
                v-for="(tab, index) in realTabs"
                :key="index"
                :class="{
                    active: tab.active
                }"
                @click="loadContent(tab)">
                <span class="sidebar__tab-counter">{{tab.count}}</span>
                <span class="sidebar__tab-name">{{tab.name}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
    name: 'SideBar',
    methods: {
        ...mapMutations({
            setCurrentList: 'SET_CURRENT_LIST',
            setCurrentSchema: 'SET_CURRENT_SCHEMA',
            setCurrentNextUrl: 'SET_CURRENT_NEXT_URL'
        }),
        loadContent (newTab) {
            if (newTab.name !== this.$route.name) {
                this.tabs.map((tab) => {
                    tab.active = (tab.name === newTab.name)
                })
                this.setCurrentSchema()
                this.setCurrentList()
                this.setCurrentNextUrl()
                this.$router.push({ name: newTab.name })
            }
        }
    },
    computed: {
        ...mapState([
            'tabs'
        ]),
        realTabs () {
            this.tabs.map((tab) => {
                tab.active = (tab.name === this.$route.name)
            })
            return this.tabs
        }
    }
}
</script>

<style lang="scss">
    .sidebar {
        min-height: 800px;
        width: 130px;
        background-color: #313745;
        flex-grow: 0;
        display: inline-block;
        &__image {
            padding: 19px 13px 16px 16.75px ;
        }
        &__tab {
            height: 42px;
            color: white;
            padding: 9px 14px 9px 13.61px;
            border-top: 1px solid #1F242F;
            &:last-child {
                border-bottom: 1px solid #1F242F;
            }
            &:hover {
                cursor: pointer;
                background-color: #1F242F;
            }
            span {
                float: left;
                clear: left;
            }
            &-counter {
                font-weight: 300;
                font-size: 12px;
                line-height: 15px;
            }
            &-name {
                font-weight: 500;
                font-size: 20px;
                line-height: 24px;
            }
        }
        .active {
            cursor: default;
            background-color: #1F242F;
        }
    }
</style>
