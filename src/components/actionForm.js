import { useState, useEffect } from "react";
import { formConfig } from "./formConfigs";
import { addFaculty, updateFaculty, deleteFaculty, addRecord, updateRecord, deleteRecord } from "./api";

import "../styles/form.css";

export default function DynamicForm({ action, user="faculty", id=null, onClose }) {
  const inputs = formConfig({ action, user });
  const [formData, setFormData] = useState({});

  // Auto-populate state with config defaults on load
  useEffect(() => {
    const currentInputs = formConfig({ action, user });
    const initialData = {};
    
    currentInputs.forEach(field => {
      if (field.type === "checkbox") {
        initialData[field.name] = field.default !== undefined ? field.default : true;
      } else if (field.value !== undefined) {
        initialData[field.name] = field.value;
      } else if (field.defaultValue !== undefined) {
        initialData[field.name] = field.defaultValue;
      }
    });
    setFormData(initialData);
  }, [action, user]); // Re-runs if the action or user type changes

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
      } else if (action.startsWith("Add ")) {
        const type = action.replace("Add ", "").toLowerCase();
        await addRecord(formData, type, localStorage.getItem("accessToken"));
      } else if (action.startsWith("Update ")) {
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
            // Style set to inherit whatever display setting comes from config
            <label key={field.name} className="checkbox-label" style={{display: field.display || "none"}}>
              <input
                type="checkbox"
                name={field.name}
                // Check state layer rather than a static true value
                checked={formData[field.name] ?? true}
                onChange={handleChange}
              />
              {field.placeholder}
            </label>
          ) : field.type === "select" ? (
            <select
              key={field.name}
              name={field.name}
              required={field.required}
              className="form-inputs"
              value={formData[field.name] || ""}
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
              // Connect completely to state so preloaded values don't block user edits
              value={formData[field.name] || ""}
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
