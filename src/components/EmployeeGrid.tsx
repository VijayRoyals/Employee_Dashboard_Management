import React, { useState, useCallback, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { Button, Input, Select, Switch, Space, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Employee } from '../types/employee';
import { EmployeeModal } from './EmployeeModal';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface EmployeeGridProps {
  data: Employee[];
  onAddEmployee: (employee: Partial<Employee>) => void;
  onUpdateEmployee: (employee: Partial<Employee>) => void;
  onDeleteEmployee: (id: string) => void;
}

export const EmployeeGrid: React.FC<EmployeeGridProps> = ({
  data,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
}) => {
  const [gridApi, setGridApi] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Partial<Employee> | null>(null);

  const departments = useMemo(() => [...new Set(data.map(emp => emp.department))], [data]);

  const columnDefs: ColDef[] = [
    { field: 'id', headerName: 'Employee ID', sortable: true, filter: true },
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'department', headerName: 'Department', sortable: true, filter: true },
    { field: 'role', headerName: 'Role', sortable: true, filter: true },
    {
      field: 'salary',
      headerName: 'Salary',
      sortable: true,
      filter: true,
      valueFormatter: (params) => {
        return `$${params.value.toLocaleString()}`;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: true,
      filter: true,
      cellRenderer: (params: any) => (
        <span className={params.value ? 'text-green-600' : 'text-red-600'}>
          {params.value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => handleEdit(params.data)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            onClick={() => handleDelete(params.data.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };

  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Employee',
      content: 'Are you sure you want to delete this employee?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => onDeleteEmployee(id),
    });
  };

  const handleSearch = (value: string) => {
    gridApi?.setQuickFilter(value);
  };

  const handleDepartmentFilter = (value: string) => {
    const filterInstance = gridApi?.getFilterInstance('department');
    if (value === 'all') {
      filterInstance?.setModel(null);
    } else {
      filterInstance?.setModel({
        type: 'equals',
        filter: value,
      });
    }
    gridApi?.onFilterChanged();
  };

  const handleStatusFilter = (checked: boolean) => {
    const filterInstance = gridApi?.getFilterInstance('status');
    filterInstance?.setModel({
      type: 'equals',
      filter: checked,
    });
    gridApi?.onFilterChanged();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowAddModal(true)}
        >
          Add Employee
        </Button>
        <Input.Search
          placeholder="Search employees..."
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 250 }}
        />
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={handleDepartmentFilter}
        >
          <Select.Option value="all">All Departments</Select.Option>
          {departments.map((dept) => (
            <Select.Option key={dept} value={dept}>
              {dept}
            </Select.Option>
          ))}
        </Select>
        <Space>
          <span>Status:</span>
          <Switch
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            onChange={handleStatusFilter}
          />
        </Space>
      </div>

      <div className="ag-theme-alpine" style={{ height: 600 }}>
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={10}
          rowSelection="multiple"
        />
      </div>

      <EmployeeModal
        visible={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onSubmit={(values) => {
          onAddEmployee(values);
          setShowAddModal(false);
        }}
        title="Add Employee"
      />

      <EmployeeModal
        visible={showEditModal}
        onCancel={() => {
          setShowEditModal(false);
          setSelectedEmployee(null);
        }}
        onSubmit={(values) => {
          onUpdateEmployee({ ...values, id: selectedEmployee?.id });
          setShowEditModal(false);
          setSelectedEmployee(null);
        }}
        initialValues={selectedEmployee}
        title="Edit Employee"
      />
    </div>
  );
};