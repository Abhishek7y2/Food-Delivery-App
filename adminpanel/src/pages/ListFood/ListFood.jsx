import React, { useEffect, useState } from 'react'
import { deleteFood, getFoodList, updateFood } from "../../services/foodService";
import { toast } from 'react-toastify'                 
import 'react-toastify/dist/ReactToastify.css'
import './ListFood.css'

const ListFood = () => {
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: '', description: '' });

  const fetchList = async () => {
      try {
         const data = await getFoodList();
          setList(data);
      }catch (error) {
        toast.error('Error while reading the food list.');
      }
    }

  const removeFood = async (foodId) => {
    try {
      const success = await deleteFood(foodId);
      if(success) {
        toast.success('Food removed successfully.');
        await fetchList();
      }else{
        toast.error('Error while removing the food.');
      }
    }catch (error) {
      toast.error('Error while removing the food.');
    }
  }

  const handleEditClick = (item) => {
    setEditId(item.id);
    setEditData({ name: item.name, description: item.description || '' });
  }

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  }

  const saveEdit = async () => {
    try {
      await updateFood(editId, editData);
      toast.success('Food updated successfully.');
      setEditId(null);
      fetchList();
    } catch (error) {
      toast.error('Error while updating food.');
    }
  }

  const cancelEdit = () => {
    setEditId(null);
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list-food-container">
      <div className="modern-list-card">
        <h2 className="modern-list-title">All Foods List</h2>
        <div className="modern-table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                list.map((items, index) => {
                  if (editId === items.id) {
                    return (
                      <tr key={index} className="edit-row">
                        <td>
                          <img src={items.imageUrl} alt={items.name} className="food-list-img" />
                        </td>
                        <td colSpan="3">
                          <input type="text" name="name" value={editData.name} onChange={handleEditChange} className="modern-input mb-2" placeholder="Name" />
                          <textarea name="description" value={editData.description} onChange={handleEditChange} className="modern-textarea" placeholder="Description" rows="2"></textarea>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-success rounded-circle" onClick={saveEdit} title="Save"><i className="bi bi-check-lg"></i></button>
                            <button className="btn btn-sm btn-secondary rounded-circle" onClick={cancelEdit} title="Cancel"><i className="bi bi-x-lg"></i></button>
                          </div>
                        </td>
                      </tr>
                    )
                  }

                  return (
                    <tr key={index}>
                      <td>
                        <img src={items.imageUrl} alt={items.name} className="food-list-img" />
                      </td>
                      <td className="fw-bold text-dark">{items.name}</td>
                      <td>
                        <span className="category-badge">{items.category}</span>
                      </td>
                      <td className="price-text">&#8377;{items.price}.00</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="edit-btn" onClick={() => handleEditClick(items)} title="Edit">
                            <i className="bi bi-pencil-fill"></i>
                          </div>
                          <div className="delete-btn" onClick={() => removeFood(items.id)} title="Delete">
                            <i className="bi bi-trash-fill"></i>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ListFood;