import { useState } from "react";
import { formConfig } from "./formConfigs";
import { addFaculty, updateFaculty, deleteFaculty, addRecord, updateRecord, deleteRecord } from "./api";

import "../styles/form.css";

export default function DynamicForm({ action, user="faculty", id=null, onClose }) {
  const inputs = formConfig({ action, user });
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (action === "Add Faculty") {
        await addFaculty(formData, localStorage.getItem("accessToken"));
      } else if (action === "Update Faculty" || action === "Change Password") {
        await updateFaculty(formData);
      } else if (action === "Delete Faculty") {
        await deleteFaculty(Object.values(formData), localStorage.getItem("accessToken"));
      }else if (action.startsWith("Add ")) {
        const type = action.replace("Add ", "").toLowerCase();
        await addRecord(formData, type, localStorage.getItem("accessToken"));
      }else if (action.startsWith("Update ")) {
        const type = action.replace("Update ", "").toLowerCase();
        const { id, ...dataToUpdate } = formData;
        const token = localStorage.getItem("accessToken");
        await updateRecord(id, dataToUpdate, type, token);
      } else {
        const type = action.replace("Delete ", "").toLowerCase();
        await deleteRecord(type, Object.values(formData), localStorage.getItem("accessToken"))
      }

      onClose(); // CLOSE MODAL ON SUCCESS
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="blur">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2>{action}</h2>

        <button
          type="button"
          className="cancel_button"
          onClick={onClose}
        >
          ×
        </button>

        {inputs.map(field =>
          field.type === "checkbox" ? (
            <label key={field.name} className="checkbox-label" style={{display:"none"}}>
              <input
                type="checkbox"
                name={field.name}
                checked={true}
                onChange={handleChange}
              />
              {field.placeholder}
            </label>
          ) : field.type === "select" ? (
            <select
              name={field.name}
              required={field.required}
              className="form-inputs"
              value={formData[field.name] || field.defaultValue || ""}
              onChange={handleChange}
            >
              <option value="" disabled>{field.label}</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              key={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={field.value}
              required={field.required}
              style={{display:field.display}}
              className="form-inputs"
              onChange={handleChange}
            />
          )
        )}

        <button type="submit" className="form-button">Submit</button>
      </form>
    </div>
  );
}
