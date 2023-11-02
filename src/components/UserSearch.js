import React, { useState, useEffect } from 'react';
import { axiosRequest } from '../api/axiosDefaults';
import { ListGroup, Spinner } from 'react-bootstrap';
import debounce from 'lodash.debounce';
import SpinnerButton from './Spinner';

function UserSearch({ onSelectUser }) { 
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (search) => {
    setLoading(true);
    try {
      const response = await axiosRequest.get(`/search-users/?username=${search}`);
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
    setLoading(false);
  };

  const debouncedFetchUsers = debounce((search) => {
    if (search.length > 2) {
      fetchUsers(search);
    } else {
      setUsers([]);
    }
  }, 300);

  useEffect(() => {
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, []);

  const handleSearchChange = (e) => {
    const search = e.target.value;
    setSearchTerm(search);
    debouncedFetchUsers(search);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {loading && <SpinnerButton />}
      <ListGroup>
        {users.map(user => (
          <ListGroup.Item key={user.user_id} onClick={() => onSelectUser(user)}>
            {user.username} {user.user_id}
          </ListGroup.Item>
        ))}
        {!loading && users.length === 0 && searchTerm && <p>No users found</p>}
      </ListGroup>
    </div>
  );
}

export default UserSearch;
