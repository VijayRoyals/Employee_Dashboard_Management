import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Modal, Form, Select, Switch, message, Pagination } from 'antd';
import axios from 'axios';

const { Header, Content } = Layout;
const { Option } = Select;

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    department: '',
    role: '',
    salary: '',
    status: 'Active',
  });

  const limit = 10; 

  
  const fetchEmployees = (page = 1) => {
    axios.get('http://localhost:5000/api/employees', {
      params: {
        name: searchQuery,
        department: departmentFilter,
        status: statusFilter,
        page,
        limit,
      },
    })
    .then(response => {
      const { employees, totalEmployees, totalPages, currentPage } = response.data;
      setEmployees(employees);
      setTotalEmployees(totalEmployees);
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
    })
    .catch(error => console.error(error));
  };

  
  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage, searchQuery, departmentFilter, statusFilter]);


  const handleAddEmployee = () => {
    axios.post('http://localhost:5000/api/employees', newEmployee)
      .then(response => {
        message.success('Employee added successfully!');
        fetchEmployees(currentPage); 
        setIsModalVisible(false);
        setNewEmployee({
          name: '',
          department: '',
          role: '',
          salary: '',
          status: 'Active',
        }); 
      })
      .catch(error => message.error('Error adding employee.'));
  };


  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsEditing(true);
    setNewEmployee(employee);
    setIsModalVisible(true);
  };

 
  const handleDeleteClick = (employeeId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this employee?',
      onOk: () => {
        axios.delete(`http://localhost:5000/api/employees/${employeeId}`)
          .then(() => {
            message.success('Employee deleted successfully!');
            fetchEmployees(currentPage); 
          })
          .catch(error => message.error('Error deleting employee.'));
      },
    });
  };

 
  const handleSearch = () => {
    fetchEmployees(currentPage); 
  };

  
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: 'white' }}>Employee Management</Header>
      <Content style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Input
            placeholder="Search by name"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '200px', marginRight: '10px' }}
          />
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
          <Select
            value={departmentFilter}
            onChange={setDepartmentFilter}
            style={{ width: '200px', marginRight: '10px' }}
            placeholder="Filter by department"
          >
            <Option value="">All Departments</Option>
            <Option value="HR">HR</Option>
            <Option value="Engineering">Engineering</Option>
            <Option value="Sales">Sales</Option>
          </Select>
          <Switch
            checked={statusFilter === 'Active'}
            onChange={checked => setStatusFilter(checked ? 'Active' : 'Inactive')}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            style={{ marginRight: '10px' }}
          />
          <Button type="primary" onClick={() => {
            setIsEditing(false); 
            setNewEmployee({
              name: '',
              department: '',
              role: '',
              salary: '',
              status: 'Active',
            });
            setIsModalVisible(true);
          }}>
            Add Employee
          </Button>
        </div>

        <div>
          <h2>Employee List</h2>
          {employees.length > 0 ? (
            <ul>
              {employees.map(emp => (
                <li key={emp.employeeId}>
                  {emp.name} - {emp.role} - {emp.department} - {emp.salary} - {emp.status}
                  <Button onClick={() => handleEditClick(emp)} style={{ marginLeft: '10px' }}>
                    Edit
                  </Button>
                  <Button danger onClick={() => handleDeleteClick(emp.employeeId)} style={{ marginLeft: '10px' }}>
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No employees found</p>
          )}
        </div>

        <Pagination
          current={currentPage}
          total={totalEmployees}
          pageSize={limit}
          onChange={onPaginationChange}
          showSizeChanger={false}  
          showTotal={(total) => `Total ${total} employees`}
        />

        <Modal
          title={isEditing ? 'Edit Employee' : 'Add New Employee'}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            initialValues={isEditing ? selectedEmployee : {}}
            onFinish={handleAddEmployee}
            layout="vertical"
          >
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter employee name!' }]}>
              <Input
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              />
            </Form.Item>
            <Form.Item name="department" label="Department" rules={[{ required: true, message: 'Please select department!' }]}>
              <Select
                value={newEmployee.department}
                onChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
              >
                <Option value="HR">HR</Option>
                <Option value="Engineering">Engineering</Option>
                <Option value="Sales">Sales</Option>
              </Select>
            </Form.Item>
            <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please enter employee role!' }]}>
              <Input
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
              />
            </Form.Item>
            <Form.Item name="salary" label="Salary" rules={[{ required: true, message: 'Please enter employee salary!' }]}>
              <Input
                type="number"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
              />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select status!' }]}>
              <Select
                value={newEmployee.status}
                onChange={(value) => setNewEmployee({ ...newEmployee, status: value })}
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isEditing ? 'Update Employee' : 'Add Employee'}
            </Button>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default App;
