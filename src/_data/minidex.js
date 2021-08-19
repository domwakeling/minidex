const axios = require('axios');
require('dotenv').config();

module.exports = async () => {

    const minidexData = await axios.
        get(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.SHEET_REF}/values/Sheet1?key=${process.env.SHEET_KEY}`)
        .then(res => res.data)
        .then(data => {
            return data
                .values
                .map(item => ({
                    "date" : item[0] + ' ' + item[1],
                    "dex" : item[2]
                }))
                .filter((item, idx) => idx !== 0)
        })
        .catch((err) => {
            console.error(err);
            return [];
        });

    const chartObj = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": 400,
        "height": 150,
        "description": "Minidex over time.",
        "data": {
            "values": minidexData
        },
        "mark": {
            "type": "area",
            "color": "orange"
        },
        "encoding": {
            "x": { "field": "date", "type": "temporal", "title": "Date", "axis": { "format": "%d %b %y" } },
            "y": { "field": "dex", "type": "quantitative", "title": "MINIdex" }
        }
    }

    return "```vegalite\n" + JSON.stringify(chartObj) + "\n```";
}


