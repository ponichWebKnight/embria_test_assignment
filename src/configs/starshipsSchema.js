export const starshipsSchema = {
    title: 'Starships',
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
            name: 'Model',
            column: 'model',
            type: 'string',
            active: true,
            sort: 'asc'
        },
        {
            name: 'MGLT',
            column: 'MGLT',
            type: 'number',
            active: true,
            sort: 'asc'
        },
        {
            name: 'Length',
            column: 'length',
            type: 'number',
            active: true,
            sort: 'asc'
        },
        {
            name: 'Consumables',
            column: 'consumables',
            type: 'string',
            active: true,
            sort: 'asc'
        },
        {
            name: 'Max atm. speed',
            column: 'max_atmosphering_speed',
            type: 'number',
            active: true,
            sort: 'asc'
        },
        {
            name: 'Crew',
            column: 'crew',
            type: 'number',
            active: true,
            sort: 'asc'
        },
        {
            name: 'Passengers',
            column: 'passengers',
            type: 'number',
            active: true,
            sort: 'asc'
        },
        {
            name: 'Cargo capacity',
            column: 'cargo_capacity',
            type: 'number',
            active: true,
            sort: 'asc'
        },
        {
            name: 'Hyperdrive rating',
            column: 'hyperdrive_rating',
            type: 'number',
            active: true,
            sort: 'asc'
        },
        {
            name: 'Starship class',
            column: 'starship_class',
            type: 'string',
            active: true,
            sort: 'asc'
        }
    ]
}
