import React, { useState } from 'react';
import { ConfigProvider, Layout, Typography } from 'antd';
import { EmployeeGrid } from './components/EmployeeGrid';
import { Employee } from './types/employee';
import { mockEmployees } from './data/mockEmployees';
import 'antd/dist/reset.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  const handleAddEmployee = (employee: Partial<Employee>) => {
    const newEmployee: Employee = {
      ...employee as Employee,
      id: (employees.length + 1).toString(),
    };
    setEmployees([...employees, newEmployee]);
  };

  const handleUpdateEmployee = (employee: Partial<Employee>) => {
    setEmployees(employees.map(emp => 
      emp.id === employee.id ? { ...emp, ...employee } : emp
    ));
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  return (
    <ConfigProvider>
      <Layout className="min-h-screen">
        <Header className="flex items-center">
          <Title level={3} className="text-white m-0">
            Employee Management Dashboard
          </Title>
        </Header>
        <Content className="p-6">
          <EmployeeGrid
            data={employees}
            onAddEmployee={handleAddEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;