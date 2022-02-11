import 'dotenv/config'
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { Habit, HabitFrequency } from "./models/Habit";
import ClassFactoryService from "./services/ClassFactoryService";

const USER_ID = "8e595889-2fe8-44fd-8885-b95bd8ca76fa";

const app = express();
const port = 5005;

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("Home", { title: "Kozukai - Home" });
});

const dummyHabits = [
  {
    id: 1,
    name: "📗 Read",
    value: 3,
  },
  {
    id: 2,
    name: "😴  Sleep before 1am",
    value: 5,
  },
  {
    id: 3,
    name: "🍅 Pomodoro session",
    value: 2,
  },
  {
    id: 4,
    name: "🚶 Take a walk",
    value: 2,
  },
  {
    id: 5,
    name: "🏃 Exercise",
    value: 7,
  },
  {
    id: 6,
    name: "📱 Call family",
    value: 7,
  },
];

app.get("/log", async (req, res) => {
  const habitService = ClassFactoryService.habitService;
  const habits = await habitService.getHabitsForUser(USER_ID);

  res.render("LogAHabit", {
    title: "Kozukai - Log A Habit",
    habits,
  });
});

app.get("/accomplishments", (req, res) => {
  res.render("Accomplishments", {
    title: "Kozukai - Accomplishments",
    totalCash: 23,
    accomplishments: [
      {
        name: "📗 Read",
        value: 3,
        when: "3 hours ago",
      },
      {
        name: "🏃 Exercise",
        value: 7,
        when: "5 hours ago",
      },
      {
        name: "🍅 Pomodoro session",
        value: 2,
        when: "1 day ago",
      },
      {
        name: "🍅 Pomodoro session",
        value: 3,
        when: "2 hours ago",
      },
    ],
  });
});

app.get("/start", (req, res) => {
  res.render("Start", { title: "Kozukai - Start" });
});

app.get("/create-habit", (req, res) => {
  return res.render("CreateHabit", { title: "Kozukai - Create Habit" });
});

app.post("/new-habit", async (req, res) => {
  const name: string = req.body.name;
  const frequency: HabitFrequency = req.body.frequency;

  const habit = new Habit(name);
  habit.setValueFromFrequency(frequency);

  const habitService = ClassFactoryService.habitService;
  await habitService.createHabitForUser(USER_ID, habit);

  return res.render("NewHabit", {
    title: "Kozukai - New Habit Created",
    name: habit.name,
    value: habit.value,
  });
});

app.get("/habits", async (req, res) => {
  const habitService = ClassFactoryService.habitService;
  const habits = await habitService.getHabitsForUser(USER_ID);

  return res.render("ManageHabits", {
    title: "Kozukai - Manage Habits",
    habits,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
