import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const EmployeeCard = ({ item, onPress, onDelete }) => {
  const [fadeAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ ...styles.card, opacity: fadeAnimation }}>
      <Text style={styles.cardText}>Employee Name: {item.employee_name}</Text>
      <Text style={styles.cardText}>Salary: {item.employee_salary}</Text>
      <Text style={styles.cardText}>Age: {item.employee_age}</Text>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => onPress(item)}
      >
        <Text style={styles.actionButtonText}>Update</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButtonDelete}
        onPress={() => onDelete(item.id)}
      >
        <AntDesign name="delete" size={24} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const baseUrl = 'https://dummy.restapiexample.com/api/v1';

  const fetchEmployees = async () => {
    try {
      const response = await fetch(baseUrl + '/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setEmployees(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addEmployee = async (employeeData) => {
    try {
      const response = await fetch(baseUrl + '/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      if (!response.ok) {
        throw new Error('Failed to add employee');
      }
      Alert.alert('Success', 'Employee added successfully');
      closeModal();
      fetchEmployees();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
      closeModal();
    }
  };

  const updateEmployee = async (employeeData) => {
    try {
      const response = await fetch(baseUrl + '/update/' + employeeData.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });
      if (!response.ok) {
        throw new Error('Failed to update employee');
      }
      Alert.alert('Success', 'Employee updated successfully');
      closeModal();
      fetchEmployees();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
      closeModal();
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const response = await fetch(baseUrl + '/delete/' + id, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }
      Alert.alert('Success', 'Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const openModal = (employee = null) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEmployee(null);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const renderItem = ({ item }) => (
    <EmployeeCard
      item={item}
      onPress={(employee) => openModal(employee)}
      onDelete={deleteEmployee}
    />
  );

  const handleSave = (employeeData) => {
    if (selectedEmployee) {
      updateEmployee({ ...selectedEmployee, ...employeeData });
    } else {
      addEmployee(employeeData);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Employee Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openModal()}
        >
          <Text style={styles.addButtonText}>Add Employee</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.list}
        data={employees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedEmployee ? 'Update Employee' : 'Add Employee'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={selectedEmployee?.employee_name || ''}
              onChangeText={(text) =>
                setSelectedEmployee((prevEmployee) => ({
                  ...prevEmployee,
                  employee_name: text,
                }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Salary"
              value={selectedEmployee?.employee_salary || ''}
              onChangeText={(text) =>
                setSelectedEmployee((prevEmployee) => ({
                  ...prevEmployee,
                  employee_salary: text,
                }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={selectedEmployee?.employee_age || ''}
              onChangeText={(text) =>
                setSelectedEmployee((prevEmployee) => ({
                  ...prevEmployee,
                  employee_age: text,
                }))
              }
            />
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSave(selectedEmployee)}
            >
              <Text style={styles.actionButtonText}>
                {selectedEmployee ? 'Update' : 'Add'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={closeModal}
            >
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#42a5f5',
    padding: 10,
    borderRadius: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    width: '100%',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    width: '100%',
    alignSelf: 'center',
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#42a5f5',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  actionButtonDelete: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
});
