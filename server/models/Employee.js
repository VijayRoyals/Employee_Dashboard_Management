const mongoose = require('mongoose');


const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, required: true },
  salary: { type: Number, required: true },
  status: { type: String, required: true, enum: ['Active', 'Inactive'] }
});


const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
