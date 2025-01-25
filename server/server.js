const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/employeeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const EmployeeSchema = new mongoose.Schema({
  name: String,
  department: String,
  role: String,
  salary: Number,
  status: String,
});

const Employee = mongoose.model('Employee', EmployeeSchema);


app.get('/', (req, res) => {
  res.send('Welcome to the Employee Management API!');
});

app.get('/api/employees', async (req, res) => {
  try {
    const { name, page = 1, limit = 10 } = req.query;

    const query = {};
    if (name) {
      query.name = { $regex: name, $options: 'i' }; 
    }

    const employees = await Employee.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalEmployees = await Employee.countDocuments(query);

    res.json({
      employees,
      totalEmployees,
      totalPages: Math.ceil(totalEmployees / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employees', error: err });
  }
});


app.post('/api/employees', async (req, res) => {
  try {
    const { name, department, role, salary, status } = req.body;
    const newEmployee = new Employee({
      name,
      department,
      role,
      salary,
      status,
    });
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (err) {
    res.status(500).json({ message: 'Error adding employee', error: err });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.delete('/api/employees/:id', async (req, res) => {
  try {
    const employeeId = req.params.id;

  
    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting employee', error: err });
  }
});
