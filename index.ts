import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import path from 'path'

const app = express();
const port = 5001;

app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true
    })
);

app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.render('Home', { title: "Cashbit - Home"})
});

app.get("/log", (req, res) => {
    res.render("LogAHabit", { title: "Cashbit - Log A Habit", habits: [
            {
                id: 1,
                name: "📗 Read",
                value: 3
            },
            {
                id: 2,
                name: "😴  Sleep before 1am",
                value: 5
            },
            {
                id: 3,
                name: "🍅 Pomodoro session",
                value: 2
            },
            {
                id: 4,
                name: "🚶 Take a walk",
                value: 2
            },
            {
                id: 5,
                name: "🏃 Exercise",
                value: 7
            },
            {
                id: 6,
                name: "📱 Call family",
                value: 7
            },
        ] } )
});

app.get("/feed", (req, res) => {
    res.render("Feed", { feed: [
            {
                name: "📗 Read",
                value: 3,
                when: "3 hours ago"
            },
            {
                name: "🏃 Exercise",
                value: 7,
                when: "5 hours ago"
            },
            {
                name: "🍅 Pomodoro session",
                value: 2,
                when: "1 day ago"
            },
            {
                name: "🍅 Pomodoro session",
                value: 3,
                when: "2 hours ago"
            },
        ] })
})

app.get("/start", (req, res) => {
    res.render('Start', { title: "Cashbit - Start"})
});

app.get("/")


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
