
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const { json } = require('express')
const app = express()
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const port = process.env.PORT || 8080

//sqlite database created,connected
let db = new sqlite3.Database("./sortdbtest.sqlite3", (err) => {
    if (err) {
        console.log('Error creating database', err)
    }
    else {
        console.log('database created');
    }
})

db.run("CREATE TABLE IF NOT EXISTS sortingtable(id INTEGER PRIMARY KEY AUTOINCREMENT, sortingtype TEXT NOT NULL, data TEXT NOT NULL)", (res, err) => {
    console.log(err);
    console.log('table created', res);
});

db.run("CREATE TABLE IF NOT EXISTS sortedtable(sortedid INTEGER PRIMARY KEY AUTOINCREMENT, sorted TEXT, inputid INTEGER, FOREIGN KEY (inputid) REFERENCES sortingtable(id))", (res, err) => {
    console.log(err);
    console.log('table created', res);
});

//querying select data from table to test INSERT
db.all("SELECT * FROM sortingtable", (a, b, c) => {
    console.log(a, b, c)
})

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//checking for the server
app.get('/', (req, res) => res.send('Server is up and running!'))

//inserting data requested from the user for sorting into sortintable table
app.post("/sort", (req, res) => {
    db.run("INSERT INTO sortingtable (sortingtype, data) VALUES (?, ?)", [req.body.sortingType, req.body.sortingInput], (err) => {
            console.error(err);        
    })

    //empty array for storing the sorted array steps
    const sortingSteps = [];

    //Quick Sort implementation
    const pivot = (arr, start = 0, end = arr.length + 1) => {
        const swap = (list, a, b) => [list[a], list[b]] = [list[b], list[a]];

        let pivot = arr[start],
            pointer = start;

        
        for (let i = start; i < arr.length; i++) {
            sortingSteps.push(`Compare indexe '${i}' with '${pointer}', ${arr[i]} < ${arr[pointer]} (i.e. ${arr[i] < pivot})\n`)

            if (arr[i] < pivot) {
                pointer++;
                sortingSteps.push(`Swaping ${arr[pointer]} with ${arr[i]}\n`)
                swap(arr, pointer, i);
                sortingSteps.push(`Now, increment our pointer to '${pointer}'\n`)
            }
                       
        };
        swap(arr, start, pointer);

        return pointer;
    }

    const quickSort = (arr, start = 0, end = arr.length) => {
        let pivotIndex = pivot(arr, start, end);

        if (start >= end) return arr;
        quickSort(arr, start, pivotIndex);
        quickSort(arr, pivotIndex + 1, end);

        return arr;
    };

    quickSort(req.body.sortingInput)
    sortingSteps.push(req.body.sortingInput);
    
    //inserting sorted result into sortedtable
    db.run("INSERT INTO sortedtable (sorted) VALUES (?)",[req.body.sortingSteps], (err) => {
            console.error(err);
    })

    res.json({
        sortedResult: req.body.sortingInput,
        result: sortingSteps.toString()
    });
})

//error code
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('500 Error')
})

app.use((req, res, next) => {
    res.status(404).send('404 Error')
})

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))