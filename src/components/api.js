// api.js
const API_BASE_URL = "http://127.0.0.1:8000";

export const userAuth = async (email, pass) => {
  const data = new URLSearchParams();
  data.append("username", email);
  data.append("password", pass);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data,
    });

    if (!response.ok) {
      console.log(response.status, response.statusText);
      return {
        error: "Invalid email or password",
      };
    }

    const result = await response.json();
    console.log(result.detail)
    console.log("Fetch successful");
    if (!response.ok) {
      return { error: result.detail || "Login failed" };
    }
    return result

  } catch (err) {
    console.error("Error calling backend:", err);
  }
};


export const fetchData = async (field) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${field}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.log(response.status, response.statusText)
      return {
        error: `HTTP ${response.status} - ${response.statusText}`,
      };
    }

    const result = await response.json();
    console.log("Fetch successful",result);
    return result;
  } catch (err) {
    console.error("Error calling backend:", err);
  }
};

export const fetchFacultyData = async (accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${accessToken}`},
    });

    const result = await response.json();
    if (!response.ok) {return {error: result.detail || result.error || `HTTP ${response.status}`}}
    return {data: result}
  } catch (err) {
    return {error: err.message}
  }
};

export const fetchAllFactulty = async (accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/faculty/`, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${accessToken}`},
    });
    const result = await response.json();
    if (!response.ok) {return {error: result.detail || result.error || `HTTP ${response.status}`}}
    return {data: result}
  } catch (err) {return {error: err.message}}
}


export const addRecord = async (recordData, type, accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${type}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization":`Bearer ${accessToken}`},
      body: JSON.stringify(recordData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.detail || result.error || `HTTP ${response.status}`,
      };
    }

    return {data: result};
  } catch (err) {
    return {error: err.message};
  }
};

export const updateRecord = async (id, updatedData, type, accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${type}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify(updatedData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.detail || result.error || `HTTP ${response.status}`,
      };
    }

    return { data: result };
  } catch (err) {
    console.error(`Error updating ${type}:`, err);
    return { error: err.message };
  }
};

export const deleteRecord = async (type, id, accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${type}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
    });
    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.error || `HTTP ${response.status} - ${response.statusText}`,
      };
    }

    return {
      message: result.message || "Deletion successful!",
    };
  } catch (err) {
    console.error("Error deleting JSON row:", err);
    return {
      error: err.message,
    };
  }
};


export const addFaculty = async (facultyData, accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/faculty`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
      body: JSON.stringify(facultyData),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: null,
        error: result.detail || result.error || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      message: "Successful!",
      data: result,  
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      message: null,
      error: err.message,
    };
  }
};


export const updateFaculty = async (data, id, accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/faculty/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.error || `HTTP ${response.status} - ${response.statusText}`,
      };
    }

    return {message: result.message || "Deletion successful!"};
  } catch (err) {
    console.error("Error deleting JSON row:", err);
    return {error: err.message};
  }
};

export const deleteFaculty = async (id, accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
    });
    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.error || `HTTP ${response.status} - ${response.statusText}`,
      };
    }

    return {message: result.message || "Deletion successful!"};
  } catch (err) {
    console.error("Error deleting JSON row:", err);
    return {error: err.message};
  }
};

export const uploadFile = async (fileData, type, accessToken) => {
  try {
    const formData = new FormData();
    formData.append("file", fileData); // key name must match backend

    const response = await fetch(`${API_BASE_URL}/upload/${type}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.error || `HTTP ${response.status} - ${response.statusText}`,
      };
    }
    console.log(response)
    return result;
  } catch (err) {
    console.error("Error uploading excel file:", err);
    return { error: err.message };
  }
};
