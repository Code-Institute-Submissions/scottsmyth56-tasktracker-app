import React, { useState, useEffect } from 'react';
import { axiosRequest } from '../api/axiosDefaults';
import { ListGroup} from 'react-bootstrap';
import debounce from 'lodash.debounce';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

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
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </InputGroup>
      
      <ListGroup>
        {users.map(user => (
          <ListGroup.Item 
            key={user.user_id} 
            action
            onClick={() => onSelectUser(user)}
            className="d-flex justify-content-between align-items-center"
          >
            {user.username}
            <Button variant="outline-primary" onClick={() => onSelectUser(user)}>
              Invite to Task
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      {!loading && users.length === 0 && searchTerm && <p>No users found</p>}
    </div>
  );
}

export default UserSearch;
