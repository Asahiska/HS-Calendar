import express from 'express';
import cors from 'cors';
import {filterICSV1} from './filterV1.js';
import {filterICSV2} from "./filterV2.js"; // Beachte das `.js`-Suffix bei Imports!

const app = express();

app.use(cors())
app.get('/filtered-calendar.ics', async (req, res) => {
    const {version} = req.query;

    if(version === "2"){
        res = await filterICSV2(req, res)
        //res = await filterICSV2(req, res)
    }else{
        res = await filterICSV1(req, res)
    }
    return res


});


app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
