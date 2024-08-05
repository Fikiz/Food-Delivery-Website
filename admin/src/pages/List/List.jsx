import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/foods/`);
      console.log('API response:', response.data);
      if (Array.isArray(response.data)) {
        setList(response.data);
      } else {
        console.error('Unexpected response data format:', response.data);
        toast.error('An error occurred while fetching the list');
      }
    } catch (error) {
      toast.error('An error occurred while fetching the list');
      console.error('Error:', error);
    }
  };

  const removeFood = async (foodId) => {
    try {
      await axios.delete(`${url}/api/foods/${foodId}`);
      toast.success('Food deleted successfully');
      fetchList(); // Fetch the updated list after deletion
    } catch (error) {
      toast.error('An error occurred while removing the food item');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {Array.isArray(list) ? (
          list.map((item, index) => (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/${item.image}`} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
            </div>
          ))
        ) : (
          <p>No items found</p>
        )}
      </div>
    </div>
  );
};

export default List;
