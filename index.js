import express from "express"
import mongoose from "mongoose"

const app=express()

app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/emp_x", {
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB", err))

const employeeSchema = new mongoose.Schema({
  empId: String,
  name: String,
  position: String,
  salary: Number,
})

const Employee = mongoose.model("Employee", employeeSchema)

app.get("/", async (req, res) => {
  const employees = await Employee.find()
  res.render("home.ejs", { employees })
})

app.get("/add", (req, res) => {
  res.render("add.ejs", { employee: null })
})

app.get("/edit/:id", async (req, res) => {
  const employee = await Employee.findById(req.params.id)
  res.render("add.ejs", { employee })
})

app.get("/view/:id", async (req, res) => {
  const employee = await Employee.findById(req.params.id)
  res.render("view.ejs", { employee })
})

app.get("/delete/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id)
  res.redirect("/")
})

app.post("/add", async (req, res) => {
  const { empId, name, position, salary } = req.body
  const employee = new Employee({ empId, name, position, salary })
  await employee.save() // Save employee to MongoDB
  res.redirect("/")
})

app.post("/edit", async (req, res) => {
  const { id, empId, name, position, salary } = req.body
  await Employee.findByIdAndUpdate(id, { empId, name, position, salary }) // Update employee by ID
  res.redirect("/")
})


app.listen(3000,()=>{
  console.log("Server is running on port 3000")
})