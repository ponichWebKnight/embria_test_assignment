<template>
    <div id="app">
        <side-bar />
        <router-view :key="$route.path"></router-view>
        <compare-modal v-if="isModalVisible" />
    </div>
</template>

<script>
import SideBar from './components/SideBar'
import CompareModal from './components/CompareModal'
import { mapMutations, mapActions, mapState } from 'vuex'

export default {
    name: 'App',
    components: {
        SideBar,
        CompareModal
    },
    data () {
        return {
            cacheName: 'dashboard'
        }
    },
    created () {
        this.loading()
        const storage = JSON.parse(sessionStorage.getItem('vuex'))
        if (!storage.starships.length) {
            this.fetchStarships()
                .then(() => this.fetchPlanets())
                .then(() => this.fetchPeople())
                .then(() => this.fetchStarshipsSchema())
                .then(() => this.fetchPlanetsSchema())
                .then(() => this.fetchPeopleSchema())
                .then(() => this.setCurrentSchema())
                .then(() => this.setCurrentList())
                .then(() => this.setCurrentNextUrl())
                .then(() => this.loaded())
        } else {
            this.clearSpecificData()
            this.setCurrentSchema()
            this.setCurrentList()
            this.setCurrentNextUrl()
            this.loaded()
        }
    },
    methods: {
        ...mapMutations({
            setCurrentList: 'SET_CURRENT_LIST',
            setCurrentSchema: 'SET_CURRENT_SCHEMA',
            setCurrentNextUrl: 'SET_CURRENT_NEXT_URL',
            clearSpecificData: 'CLEAR_SPECIFIC_DATA'
        }),
        ...mapActions([
            'loading',
            'loaded',
            'fetchStarships',
            'fetchPlanets',
            'fetchPeople',
            'fetchStarshipsSchema',
            'fetchPlanetsSchema',
            'fetchPeopleSchema'
        ])
    },
    computed: {
        ...mapState([
            'isModalVisible'
        ])
    }
}
</script>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600&display=swap&subset=cyrillic');
    body {
        margin: 0;
        padding: 0;
    }

    #app {
        display: flex;
        flex-direction: row;
        height: 100vh;
        min-height: 600px
    }

    * {
        font-family: 'Montserrat';
        font-style: normal;
    }

    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #f1f1f1;
        box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 4px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #474D59;
        box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 4px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
</style>
