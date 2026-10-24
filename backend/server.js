const express = require("express");
const app = express();
const db = require("./db");

app.use(express.json());


const PORT = process.env.PORT || 3004;


//app.get ("/", (req, res)=> {
//   res.send("student api is running")
//})

//app.get("/api",(req,res)=> {
  //  res.json ([
    //    {
      //      id:1,
        //    name:"popot asim",
         //   course: "OfCourse"
        //}
    //])
//});


app.get("/", (req, res) => {
    res.json({
        message: "Students API is running",
    });
});

app.get("/api/students", (req, res) => {
    const sql = "SELECT * FROM students";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to retrieve students",
            });
        }

        res.json(results);
    });
});

app.put("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, course, age } = req.body || {};
    const studentName = typeof name === "string" ? name.trim() : "";
    const studentCourse = typeof course === "string" ? course.trim() : "";
    const studentAge = Number(age);

    if (!Number.isInteger(id) || id < 1 || !studentName || !studentCourse || !Number.isInteger(studentAge) || studentAge < 1) {
        return res.status(400).json({
            message: "A valid student ID, name, course, and age are required",
        });
    }

    db.query("SELECT id FROM students WHERE id = ?", [id], (findErr, rows) => {
        if (findErr) {
            console.error(findErr);
            return res.status(500).json({ message: "Failed to update student" });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        const sql = "UPDATE students SET name = ?, course = ?, age = ? WHERE id = ?";
        db.query(sql, [studentName, studentCourse, studentAge, id], (updateErr) => {
            if (updateErr) {
                console.error(updateErr);
                return res.status(500).json({ message: "Failed to update student" });
            }

            res.json({ id, name: studentName, course: studentCourse, age: studentAge });
        });
    });
});

app.delete("/api/students/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ message: "A valid student ID is required" });
    }

    db.query("DELETE FROM students WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to delete student" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student deleted successfully" });
    });
});

app.post("/api/students", (req, res) => {
    const { name, course, age } = req.body || {};
    const studentName = typeof name === "string" ? name.trim() : "";
    const studentCourse = typeof course === "string" ? course.trim() : "";
    const studentAge = Number(age);

    if (!studentName || !studentCourse || !Number.isInteger(studentAge) || studentAge < 1) {
        return res.status(400).json({
            message: "Name, course, and a valid age are required",
        });
    }

    const sql = "INSERT INTO students (name, course, age) VALUES (?, ?, ?)";

    db.query(sql, [studentName, studentCourse, studentAge], (err, result) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to add student",
            });
        }

        res.status(201).json({
            id: result.insertId,
            name: studentName,
            course: studentCourse,
            age: studentAge,
        });
    });
});

app.listen(PORT, () => {
console.log(`Server is running on ${PORT}`);
});
