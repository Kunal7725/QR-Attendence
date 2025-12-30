// CRUD operations for localStorage
export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

export const getData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting data:', error);
    return [];
  }
};

export const updateData = (key, id, newData) => {
  try {
    let items = getData(key);
    const index = items.findIndex(item => 
      item.adminId === id || item.studentId === id || item.id === id
    );
    
    if (index !== -1) {
      items[index] = { ...items[index], ...newData };
      saveData(key, items);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating data:', error);
    return false;
  }
};

export const deleteData = (key, id) => {
  try {
    let items = getData(key);
    items = items.filter(item => 
      item.adminId !== id && item.studentId !== id && item.id !== id
    );
    saveData(key, items);
    return true;
  } catch (error) {
    console.error('Error deleting data:', error);
    return false;
  }
};

// Add new item to array
export const addData = (key, newItem) => {
  try {
    const items = getData(key);
    items.push(newItem);
    saveData(key, items);
    return true;
  } catch (error) {
    console.error('Error adding data:', error);
    return false;
  }
};