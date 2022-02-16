import 'dotenv/config'
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { Habit, HabitFrequency } from "./models/Habit";
import ClassFactoryService from "./services/ClassFactoryService";
import Spending from "./models/Spending";

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

app.get("/log", async (req, res) => {
  const habitService = ClassFactoryService.habitService;
  const habits = await habitService.getHabitsForUser(USER_ID);

  res.render("LogAHabit", {
    title: "Kozukai - Log A Habit",
    habits,
  });
});

app.post('/log', async (req, res) => {
  const loggedHabitId = parseInt(Object.keys(req.body)[0]);
  const habitService = ClassFactoryService.habitService
  const accomplishmentService = ClassFactoryService.accomplishmentService;

  const habit = await habitService.getHabitForUser(USER_ID, loggedHabitId);
  await accomplishmentService.createAccomplishmentForUser(USER_ID, habit);

  res.redirect("/accomplishments")
})

app.get("/accomplishments", async (req, res) => {
  const accomplishmentsService = ClassFactoryService.accomplishmentService
  const accomplishments = await accomplishmentsService.getAccomplishmentsForUser(USER_ID)

  res.render("Accomplishments", {
    title: "Kozukai - Accomplishments",
    totalCash: 23,
    accomplishments
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

  const habit = new Habit(name, undefined, undefined);
  habit.setValueFromFrequency(frequency);

  const habitService = ClassFactoryService.habitService;
  await habitService.upsertHabitForUser(USER_ID, habit);

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

app.post("/edit-habits", async (req, res) => {
  const habitService = ClassFactoryService.habitService;
  const editedHabits = habitService.habitStringMapToHabits(req.body);

  for (const currHabit of editedHabits) {
    await habitService.upsertHabitForUser(USER_ID, currHabit);
  }

  const habits = await habitService.getHabitsForUser(USER_ID);

  return res.render("ManageHabits", {
    title: "Kozukai - Manage Habits",
    habits,
  });
})

app.get("/spendings", async (req, res) => {
  const spendingService = ClassFactoryService.spendingService
  const spendings = await spendingService.getSpendingsForUser(USER_ID)

  return res.render("Spendings", {
    title: "Kozukai - Spendings",
    spendings
  })
})

app.post("/spendings", async (req, res) => {
  const { name, price } = req.body;
  const spendingService = ClassFactoryService.spendingService
  await spendingService.createSpendingForUser(USER_ID, new Spending(name, parseFloat(price), Date.now()))

  const spendings = await spendingService.getSpendingsForUser(USER_ID)

  return res.render("Spendings", {
    title: "Kozukai - Spendings",
    spendings
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
