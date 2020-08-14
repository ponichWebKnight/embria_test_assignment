export const planetsSchema = {
    title: 'Planets',
    columns: [
        {
            name: 'ID',
            column: 'id',
            type: 'number',
            active: true,
            sort: 'asc'
        },
        {
            name: 'Name',
            column: 'name',
            type: 'string',
            active: true,
            sort: 'asc'
        },
        {
            name: 'Rotation period',
            column: 'rotation_period',
            type: 'number',
            active: true,
            sort: 'asc'
        },
        {
            name: 'Orbital period',
            column: 'orbital_period',
            type: 'number',
            active: true,
            sort: 'asc'
        },
        {
            name: 'Diameter',
            column: 'diameter',
            type: 'number',
            active: true,
            sort: 'asc'
        },
        {
            name: 'Climate',
            column: 'climate',
            type: 'string',
            active: true,
            sort: 'asc'
        },
        {
            name: 'Gravity',
            column: 'gravity',
            type: 'string',
            active: true,
            sort: 'asc'
        },
        {
            name: 'Terrain',
            column: 'terrain',
            type: 'string',
            active: true,
            sort: 'asc'
        },
        {
            name: 'Surface water',
            column: 'surface_water',
            type: 'number',
            active: true,
            sort: 'asc'
        },
        {
            name: 'Population',
            column: 'population',
            type: 'number',
            active: true,
            sort: 'asc'
        }
    ]
}
