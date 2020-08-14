import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'
import { starshipsSchema } from '../configs/starshipsSchema'
import { planetsSchema } from '../configs/planetsSchema'
import { peopleSchema } from '../configs/peopleSchema'

Vue.use(Vuex)

const swapi = 'https://swapi.dev/api/'

const store = new Vuex.Store({
    actions: {
        loading ({ commit }) {
            commit('SET_LOADING')
        },
        loaded ({ commit }) {
            commit('SET_LOADED')
        },
        fetchStarships ({ commit }) {
            return axios.get(swapi + 'starships/')
                .then((response) => {
                    commit('SET_STARSHIPS_LIST', response.data)
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        /*
            Правильно было бы получать данные схемы, однако происходит
            конфликт между схемой api и тем, что должно быть по макету Figma.
            Мною было принято решение собрать собственную схему для каждого типа ресурса,
            так как в противном случае пришлось бы писать много бойлерплэйт кода и костылей
            по преобразованию названий колонок в то, что должно быть в макете.

            А так выглядит пример получения данных по схеме для ресурса Starships:
            return axios.get(swapi + 'starships/schema')
                .then((response) => {
                    commit('SET_STARSHIPS_SCHEMA', response.data)
                })
                .catch(function (error) {
                    console.log(error)
                }) */
        fetchStarshipsSchema ({ commit }) {
            commit('SET_STARSHIPS_SCHEMA', starshipsSchema)
        },
        fetchPlanets ({ commit }) {
            return axios.get(swapi + 'planets/')
                .then((response) => {
                    commit('SET_PLANETS_LIST', response.data)
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        fetchPlanetsSchema ({ commit }) {
            commit('SET_PLANETS_SCHEMA', planetsSchema)
        },
        fetchPeople ({ commit }) {
            return axios.get(swapi + 'people/')
                .then((response) => {
                    commit('SET_PEOPLE_LIST', response.data)
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        fetchPeopleSchema ({ commit }) {
            commit('SET_PEOPLE_SCHEMA', peopleSchema)
        },
        loadNewItems ({ commit }, data) {
            const url = 'https:' + data.cur_next_url.split(':')[1]
            return axios.get(url)
                .then((response) => {
                    commit('UPDATE_LIST', { new_data: response.data, tab: data.cur_tab })
                })
                .catch(function (error) {
                    console.log(error)
                })
        }
    },
    getters: {
        getCurrentColumns: state => {
            return state.currentSchema.columns.filter(column => column.active)
        }
    },
    mutations: {
        SET_LOADING (state) {
            state.isLoaded = false
        },
        SET_LOADED (state) {
            state.isLoaded = true
        },
        SET_STARSHIPS_LIST (state, starships) {
            state.starships = [...starships.results]
            state.starshipsNextUrl = starships.next
            state.tabs.push({
                count: starships.count,
                name: 'Starships',
                active: true
            })
        },
        SET_PLANETS_LIST (state, planets) {
            state.planets = [...planets.results]
            state.planetsNextUrl = planets.next
            state.tabs.push({
                count: planets.count,
                name: 'Planets',
                active: false
            })
        },
        SET_PEOPLE_LIST (state, people) {
            state.people = people.results
            state.peopleNextUrl = people.next
            state.tabs.push({
                count: people.count,
                name: 'People',
                active: false
            })
        },
        SET_CURRENT_LIST (state) {
            const activeTab = state.tabs.filter(tab => tab.active === true)[0].name.toLowerCase()
            const allowedContent = state.currentSchema.columns
                .filter(item => item.active)
                .map(item => item.column)

            state.currentItems = state[activeTab].map((item, index) => {
                const newItem = {}
                newItem.id = index
                for (let i = 0; i < allowedContent.length; i++) {
                    if (allowedContent[i] !== 'id') {
                        newItem[allowedContent[i]] = item[allowedContent[i]]
                    }
                }
                return newItem
            })
        },
        SET_CURRENT_SCHEMA (state) {
            if (state.tabs.filter(tab => tab.active === true)[0] !== undefined) {
                const activeTab = state.tabs.filter(tab => tab.active === true)[0].name.toLowerCase()
                state.currentSchema = {
                    columns: [...state[activeTab + 'Schema'].columns.map(item => {
                        return { ...item }
                    })],
                    title: state[activeTab + 'Schema'].title
                }
            }
        },
        SET_CURRENT_NEXT_URL (state) {
            if (state.tabs.filter(tab => tab.active === true)[0] !== undefined) {
                const activeTab = state.tabs.filter(tab => tab.active === true)[0].name.toLowerCase()
                state.currentNextUrl = state[activeTab + 'NextUrl']
            }
        },
        SET_CURRENT_DATASETS (state, payload) {
            state.currentDatasets = [...payload.map(item => {
                return { ...item }
            })]
        },
        SET_STARSHIPS_SCHEMA (state, starshipsSchema) {
            state.starshipsSchema = starshipsSchema
        },
        SET_PLANETS_SCHEMA (state, planetsSchema) {
            state.planetsSchema = planetsSchema
        },
        SET_PEOPLE_SCHEMA (state, peopleSchema) {
            state.peopleSchema = peopleSchema
        },
        UPDATE_LIST (state, payload) {
            state[payload.tab] = [...state[payload.tab], ...payload.new_data.results]
            state[payload.tab + 'NextUrl'] = payload.new_data.next
        },
        HANDLE_SHOW_MODAL (state, payload) {
            state.isModalVisible = payload
        },
        CLEAR_SPECIFIC_DATA (state) {
            state.isModalVisible = false
            state.currentDatasets = []
            state.currentSchema = []
            state.currentNextUrl = []
            state.currentItems = []
        }
    },
    state: {
        isLoaded: false,
        tabs: [],
        currentItems: [],
        currentSchema: [],
        currentNextUrl: [],
        currentDatasets: [],
        starships: [],
        planets: [],
        people: [],
        starshipsSchema: null,
        planetsSchema: null,
        peopleSchema: null,
        starshipsNextUrl: null,
        planetsNextUrl: null,
        peopleNextUrl: null,
        isModalVisible: false
    },
    plugins: [createPersistedState({ storage: sessionStorage })]
})
export default store
