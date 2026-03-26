export const formConfig = ({ action, user }) => {
    if (action === "Add Faculty") {
        return [
            { name: 'name', type: 'text', placeholder: 'Full Name', required: true },
            { name: 'email', type: 'email', placeholder: 'Email Address', required: true },
            { name: 'department', type: 'select', label: 'Department', required: true, 
                options: 
                ["Civil Engineering", 
                    "Mechanical Engineering", 
                    "Electrical and Electronics Engineering", 
                    "Electronics and Communication Engineering", 
                    "Industrial Engineering and Management", 
                    "Computer Science and Engineering", 
                    "Electronics and Telecommunication Engineering", 
                    "Information Science and Engineering", 
                    "Electronics and Instrumentation Engineering", 
                    "Medical Electronics Engineering", 
                    "Chemical Engineering", 
                    "Bio-Technology",
                    "Computer Applications (MCA)",
                    "Management Studies and Research Centre",
                    "Mathematics Department",
                    "Physics Department",
                    "Chemistry Department",
                    "Aerospace Engineering",
                    "Machine Learning (AI and ML)",
                    "Computer Science and Engineering (DS)",
                    "Computer Science and Engineering (IoT and CS)",
                    "Artificial Intelligence and Data Science",
                    "Computer Science and Business Systems"], 
                    defaultValue: "Machine Learning (AI and ML)" },
            { name: 'role', type: 'text', placeholder: 'Role', required: true, value: "FACULTY", display: "none" },
            { name: 'password', type: 'text', value: "1234", required: true, display: "none" },
            { name: 'is_active', type: 'checkbox', placeholder: 'Is Active?', default: true },
        ]
    }

    else if (action === "Update Faculty") {
        return [
            { name: 'name', type: 'text', placeholder: 'Full Name', required: true },
            { name: 'email', type: 'email', placeholder: 'Email Address', required: true },
            { name: 'department', type: 'select', label: 'Department', required: true, 
                options: ["Civil Engineering", 
                    "Mechanical Engineering", 
                    "Electrical and Electronics Engineering", 
                    "Electronics and Communication Engineering", 
                    "Industrial Engineering and Management", 
                    "Computer Science and Engineering", 
                    "Electronics and Telecommunication Engineering", 
                    "Information Science and Engineering", 
                    "Electronics and Instrumentation Engineering", 
                    "Medical Electronics Engineering", 
                    "Chemical Engineering", 
                    "Bio-Technology",
                    "Computer Applications (MCA)",
                    "Management Studies and Research Centre",
                    "Mathematics Department",
                    "Physics Department",
                    "Chemistry Department",
                    "Aerospace Engineering",
                    "Machine Learning (AI and ML)",
                    "Computer Science and Engineering (DS)",
                    "Computer Science and Engineering (IoT and CS)",
                    "Artificial Intelligence and Data Science",
                    "Computer Science and Business Systems"
                ], 
                defaultValue: "Machine Learning (AI and ML)" 
            },
            { name: 'password', type: 'text', placeholder: 'Password', required: true },
            { name: 'is_active', type: 'checkbox', placeholder: 'Is Active?', default: true },
        ]
    }
    else if (action === "Delete Faculty") {
        return [
            { name: 'id', type: 'int', placeholder: 'Faculty ID', required: true },
        ]
    }
    else if (action === "Change Password") {
        return [
            { name: 'pass', type: 'text', placeholder: 'New password', required: true },
        ]
    }

    else if (action === "Add books") {
        if (user === "admin") {
            return [
                { name: 'faculty_id', type: 'int', placeholder: 'Faculty ID', required: true },
                { name: 'title', type: 'text', placeholder: 'Book Title', required: true },
                { name: 'publisher_details', type: 'text', placeholder: 'Publisher Details', required: true },
                { name: 'publication_month_year', type: 'string', placeholder: 'Publication Date (YYYY-MM-DD)', required: true },
            ]
        } else {
            return [
                { name: 'title', type: 'text', placeholder: 'Book Title', required: true },
                { name: 'publisher_details', type: 'text', placeholder: 'Publisher Details', required: true },
                { name: 'publication_month_year', type: 'string', placeholder: 'Publication Year (YYYY-MM-DD)', required: true },
            ]   
        }
    }
    else if (action === "Add journals") {
        if (user === "admin") {
            return [
                { name: 'faculty_id', type: 'int', placeholder: 'Faculty ID', required: true },
                { name: 'title_of_paper', type: 'text', placeholder: 'Title of Paper/Article', required: true },
                { name: 'journal_type', type: 'select', label: 'Journal Type', required: true, options: ['International', 'National'], defaultValue: "International" },
                { name: 'journal_name', type: 'text', placeholder: 'Journal Name', required: true },
                { name: 'url_doi', type: 'text', placeholder: 'URL or DOI (Optional)', required: false },
                { name: 'issn', type: 'text', placeholder: 'ISSN (Optional)', required: false },
                { name: 'publication_month_year', type: 'string', placeholder: 'Publication Date (YYYY-MM-DD)', required: true },
                { name: 'page_numbers', type: 'text', placeholder: 'Page Numbers (e.g., 120-135)', required: true },
            ]
        } else {
            return [
                { name: 'title_of_paper', type: 'text', placeholder: 'Title of Paper/Article', required: true },
                { name: 'journal_type', type: 'select', label: 'Journal Type', required: true, options: ['International', 'National'], defaultValue: "International" },
                { name: 'journal_name', type: 'text', placeholder: 'Journal Name', required: true },
                { name: 'url_doi', type: 'text', placeholder: 'URL or DOI (Optional)', required: false },
                { name: 'issn', type: 'text', placeholder: 'ISSN (Optional)', required: false },
                { name: 'publication_month_year', type: 'string', placeholder: 'Publication Date (YYYY-MM-DD)', required: true },
                { name: 'page_numbers', type: 'text', placeholder: 'Page Numbers (e.g., 120-135)', required: true },
            ]
        }
    }
    else if (action === "Add conferences") {
        if (user === "admin") {
            return [
                { name: 'faculty_id', type: 'int', placeholder: 'Faculty ID', required: true },
                { name: 'title_of_paper', type: 'text', placeholder: 'Title of Paper/Presentation', required: true },
                { name: 'conference_name', type: 'text', placeholder: 'Conference Name', required: true },
                { name: 'held_on', type: 'string', placeholder: 'Date Held (YYYY-MM-DD)', required: true },
                { name: 'place', type: 'text', placeholder: 'City, Country', required: true },
                { name: 'isbn', type: 'text', placeholder: 'ISBN (Optional)', required: false },
            ]
        } else {
            return [
                { name: 'title_of_paper', type: 'text', placeholder: 'Title of Paper/Presentation', required: true },
                { name: 'conference_name', type: 'text', placeholder: 'Conference Name', required: true },
                { name: 'held_on', type: 'string', placeholder: 'Date Held (YYYY-MM-DD)', required: true },
                { name: 'place', type: 'text', placeholder: 'City, Country', required: true },
                { name: 'isbn', type: 'text', placeholder: 'ISBN (Optional)', required: false },
            ]
        }
    }
    else {
        return []
    }
};