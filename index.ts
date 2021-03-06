import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import { Habit, HabitFrequency } from "./models/Habit";
import ClassFactoryService from "./services/ClassFactoryService";
import Spending from "./models/Spending";
import authCheck from "./middleware/authCheck";
import Emailer from "./services/Emailer";
import User from "./models/User";
import DittoText from "./ditto/Kozukai.json";

const app = express();
const port = process.env.PORT || 5000;

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
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("Home")
});

app.get("/register", async (req, res) => {
  res.render("EmailPasswordSubmit", {
    title: "Kozukai - Register",
    pageTitle: "Register",
    action: "/register",
    error: "",
    showLoginLink: true,
    text: DittoText
  });
});

app.post("/register", async (req, res) => {
  const supabaseClient = ClassFactoryService.supabaseClient;
  const { email, password } = req.body;

  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res.render("EmailPasswordSubmit", {
      title: "Kozukai - Register",
      pageTitle: "Register",
      action: "/register",
      error: error.message,
      showLoginLink: true,
    });
  }

  return res.redirect("/login");
});

app.get("/login", async (req, res) => {
  res.render("EmailPasswordSubmit", {
    title: "Kozukai - Login",
    pageTitle: "Login",
    action: "/login",
    error: "",
    showPasswordResetLink: true,
    showRegisterLink: true,
    text: DittoText
  });
});

app.post("/login", async (req, res) => {
  const supabaseClient = ClassFactoryService.supabaseClient;
  const { email, password } = req.body;

  try {
    const { session, error } = await supabaseClient.auth.signIn({
      email,
      password,
    });

    if (error) {
      return res.render("EmailPasswordSubmit", {
        title: "Kozukai - Login",
        pageTitle: "Login",
        action: "/login",
        error: error.message,
        showPasswordResetLink: true,
        showRegisterLink: true,
        text: DittoText
      });
    }

    res.cookie("token", session.access_token);
    return res.redirect("/accomplishments");
  }
  catch(e) {
    console.error(e)
    return res.status(500).send("Could not reach database. Please contact ash@kozukaihabit.com for help.")
  }
});

app.get("/reset-password", async (req, res) => {
  res.render("PasswordReset", {
    title: "Kozukai - Reset password",
    text: DittoText
  });
});

app.post("/reset-password", async (req, res) => {
  const passwordResetService = ClassFactoryService.passwordResetService;
  const { email } = req.body;

  const code = await passwordResetService.upsertPasswordResetForUser(email);
  await Emailer.sendPasswordReset(email, code)

  res.render("Message", {
    title: "Kozukai - Password reset",
    message:
      "Password reset code created. Please check your email.",
    text: DittoText
  });
});

app.get("/password-change", async (req, res) => {
  res.render("PasswordChange", { 
    title: "Kozukai - Password change",
    text: DittoText
  });
});

app.post("/password-change", async (req, res) => {
  const supabaseClient = ClassFactoryService.supabaseClient;
  const passwordResetService = ClassFactoryService.passwordResetService;
  const { email, resetcode, password } = req.body;

  const passwordReset = await passwordResetService.findPasswordReset(
    email,
    resetcode
  );

  if (!passwordReset) {
    return resFailure();
  }

  const user = (
    await supabaseClient.from("users").select("*").eq("email", email)
  ).body.find((user) => user.email === email);

  if (!user) return resFailure();

  const { error } = await supabaseClient.auth.api.updateUserById(user.id, {
    password,
  });

  if (error) {
    return resFailure();
  }

  await passwordResetService.invalidateResetCode(email, resetcode)

  res.render("Message", {
    title: "Kozukai - Password changed",
    message: "Password successfully change.",
    text: DittoText
  });

  function resFailure() {
    return res.render("Message", {
      title: "Kozukai - Password change",
      message: "Failed to set new password",
      text: DittoText
    });
  }
});

app.get("/log", authCheck, async (req, res) => {
  const habitService = ClassFactoryService.habitService;
  const habits = await habitService.getHabitsForUser(req.user.id);

  res.render("LogAHabit", {
    title: "Kozukai - Log A Habit",
    habits,
    text: DittoText
  });
});

app.post("/log", authCheck, async (req, res) => {
  const loggedHabitId = parseInt(Object.keys(req.body)[0]);
  const habitService = ClassFactoryService.habitService;
  const accomplishmentService = ClassFactoryService.accomplishmentService;

  const habit = await habitService.getHabitForUser(req.user.id, loggedHabitId);
  await accomplishmentService.createAccomplishmentForUser(req.user.id, habit);

  res.redirect("/accomplishments");
});

app.get("/accomplishments", authCheck, async (req, res) => {
  const accomplishmentsService = ClassFactoryService.accomplishmentService;
  const cashService = ClassFactoryService.cashService;
  const accomplishments =
    await accomplishmentsService.getAccomplishmentsForUser(req.user.id);

  const userService = ClassFactoryService.userService;
  try {
    const user = await userService.getUser(req.user.id)

    res.render("Accomplishments", {
      title: "Kozukai - Accomplishments",
      totalCash: await cashService.calculateCashTotalForUser(req.user.id),
      currencySymbol: user.currencySymbol,
      accomplishments,
      text: DittoText
    });
  }
  catch(e) {
    console.error(e);
    return res.status(500).send("Internal error. Please message ash@kozukaihabit.com for support.")
  }
});

app.post("/remove-accomplishment", authCheck, async (req, res) => {
  const accomplishmentsService = ClassFactoryService.accomplishmentService;
  await accomplishmentsService.removeAccomplishment(
    parseInt(Object.keys(req.body)[0]),
    req.user.id
  );

  res.redirect("/accomplishments");
});

app.get("/start", authCheck, (req, res) => {
  res.render("Start", { 
    title: "Kozukai - Start",
    text: DittoText
  });
});

app.get("/create-habit", authCheck, (req, res) => {
  return res.render("CreateHabit", { 
    title: "Kozukai - Create Habit",
    text: DittoText
  });
});

app.post("/new-habit", authCheck, async (req, res) => {
  const userService = ClassFactoryService.userService;
  const name: string = req.body.name;
  const frequency: HabitFrequency = req.body.frequency;

  const habit = new Habit(name, undefined, undefined);
  try {
    const user = await userService.getUser(req.user.id)
    habit.setValueFromFrequency(frequency, user);

    const habitService = ClassFactoryService.habitService;
    await habitService.upsertHabitForUser(req.user.id, habit);

    return res.render("NewHabit", {
      title: "Kozukai - New Habit Created",
      currencySymbol: user.currencySymbol,
      name: habit.name,
      value: habit.value,
      text: DittoText
    });
  }
  catch(e) {
    console.error(e);
    return res.status(500).send("Internal error. Please message ash@kozukaihabit.com for support.")
  }
});

app.get("/habits", authCheck, async (req, res) => {
  const habitService = ClassFactoryService.habitService;
  const habits = await habitService.getHabitsForUser(req.user.id);

  return res.render("ManageHabits", {
    title: "Kozukai - Manage Habits",
    habits,
    text: DittoText
  });
});

app.post("/edit-habit", authCheck, async (req, res) => {
  const habitService = ClassFactoryService.habitService;
  
  const id: number = parseInt(req.query.habitId)
  const name: string = req.body.habitname;
  const value: number = parseInt(req.body.habitvalue);
  
  if (!name || !value || !id) {
    return res.redirect("/habits");
  }
  
  const editedHabit = new Habit(name, value, id);

  await habitService.upsertHabitForUser(req.user.id, editedHabit);
  

  res.redirect("/habits");
});

app.post("/remove-habit", authCheck, async (req, res) => {
  const habitService = ClassFactoryService.habitService;
  try {
    await habitService.removeHabit(
      parseInt(Object.keys(req.body)[0]),
      req.user.id
    )
  }
  finally {
    res.redirect("/habits")
  }
});

app.get("/spendings", authCheck, async (req, res) => {
  const spendingService = ClassFactoryService.spendingService;
  const spendings = await spendingService.getSpendingsForUser(req.user.id);

  return res.render("Spendings", {
    title: "Kozukai - Spendings",
    spendings,
    text: DittoText
  });
});

app.post("/spendings", authCheck, async (req, res) => {
  const { name, price } = req.body;
  const spendingService = ClassFactoryService.spendingService;
  await spendingService.createSpendingForUser(
    req.user.id,
    new Spending(name, parseFloat(price), Date.now())
  );

  res.redirect("/spendings");
});

app.post("/remove-spending", authCheck, async (req, res) => {
  const spendingService = ClassFactoryService.spendingService;
  await spendingService.removeSpending(
    parseInt(Object.keys(req.body)[0]),
    req.user.id
  );

  res.redirect("/spendings");
});

app.get("/profile", authCheck, async (req, res) => {
  const userService = ClassFactoryService.userService;
  const user = await userService.getUser(req.user.id);

  return res.render("Profile", {
    title: "Kozukai - Profile",
    headerText: "Profile",
    currencySymbol: user.currencySymbol,
    multi: user.defaultValues.multi,
    once: user.defaultValues.once,
    sometimes: user.defaultValues.sometimes,
    text: DittoText
  });
});

app.post("/profile", authCheck, async (req, res) => {
  const { currencySymbol, multi, once, sometimes } = req.body;
  const updatedUser = new User("", currencySymbol, { multi, once, sometimes }, req.user.id)
  const userService = ClassFactoryService.userService;

  await userService.updateUser(updatedUser)

  res.redirect("/profile")
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
