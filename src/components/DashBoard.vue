<template>
    <div v-if="isLoaded" class="dashboard">
        <Table />
        <table-view />
    </div>
    <div v-else class="loader">
        <bounce-loader class="bounce_custom" :margin="margin" :color="color" :size="size"></bounce-loader>
    </div>
</template>

<script>
import Table from './dashboard-components/Table'
import TableView from './dashboard-components/TableView'
import BounceLoader from 'vue-spinner/src/BounceLoader.vue'
import { mapState } from 'vuex'

export default {
    name: 'DashBoard',
    data () {
        return {
            color: '#313745',
            size: '45px',
            margin: 'auto',
            radius: '2px'
        }
    },
    components: {
        Table,
        TableView,
        BounceLoader
    },
    computed: {
        ...mapState([
            'isLoaded'
        ])
    }
}
</script>

<style lang="scss">
    .dashboard {
        min-height: 800px;
        flex-grow: 1;
        display: flex;
    }
    .loader {
        margin: auto;
        .bounce_custom {
            padding-bottom: 10px;
        }
    }
</style>
