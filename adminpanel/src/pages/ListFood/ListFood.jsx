import React, { useEffect, useState } from 'react'
import { deleteFood, getFoodList } from "../../services/foodService";
import { toast } from 'react-toastify'                 
import 'react-toastify/dist/ReactToastify.css'


const ListFood = () => {
  const [list, setList] = useState([]);
  const fetchList = async () => 
    {
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

  useEffect(() => {
    fetchList();
  }, []);
  return (
    <div className="py-5 row justify-content-center">
      <div className="col-11 card">
        <table className='table'>
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
                return (
                  <tr key={index}>
                    <td>
                      <img src={items.imageUrl} alt="" height={48} width={48} />
                    </td>
                    <td>{items.name}</td>
                    <td>{items.category}</td>
                    <td>&#8377;{items.price}.00</td>
                    <td className='text-danger'>
                      <i className='bi bi-x-circle-fill' onClick={() => removeFood(items.id)}></i>
                    </td>

                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListFood;