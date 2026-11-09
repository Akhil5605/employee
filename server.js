const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "prabhat@123",
    database: "employee_db"
});

// Connect MySQL
db.connect((err) => {
    if (err) {
        console.log("MySQL connection error:", err);
    } else {
        console.log("MySQL connected successfully!");
    }
});

// GET - Show all employees
app.get("/employees", (req, res) => {

    const sql = "SELECT * FROM employees ORDER BY id ASC";

    db.query(sql, (err, results) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Error fetching employees"
            });
        }

        res.json(results);
    });
});


// POST - Add employee
app.post("/employees", (req, res) => {

    const {
        name,
        email,
        department,
        phone,
        salary
    } = req.body;

    const sql = `
        INSERT INTO employees
        (name, email, department, phone, salary)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, department, phone, salary],
        (err, result) => {

            if (err) {
                console.log("INSERT ERROR:", err);

                return res.status(500).json({
                    message: "Error saving employee"
                });
            }

            res.json({
                message: "Employee details saved successfully!"
            });
        }
    );
});


// PUT - Update employee
app.put("/employees/:id", (req, res) => {

    const id = req.params.id;

    const {
        name,
        email,
        department,
        phone,
        salary
    } = req.body;

    const sql = `
        UPDATE employees
        SET name = ?,
            email = ?,
            department = ?,
            phone = ?,
            salary = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, email, department, phone, salary, id],
        (err, result) => {

            if (err) {
                console.log("UPDATE ERROR:", err);

                return res.status(500).json({
                    message: "Error updating employee"
                });
            }

            res.json({
                message: "Employee details updated successfully!"
            });
        }
    );
});


// DELETE - Delete employee
app.delete("/employees/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM employees WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log("DELETE ERROR:", err);

            return res.status(500).json({
                message: "Error deleting employee"
            });
        }

        res.json({
            message: "Employee deleted successfully!"
        });
    });
});


// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});