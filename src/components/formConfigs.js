// recordConfig.js

export const formConfig = ({ action, user }) => {
    if (action === "Add Faculty") {
        return [
            { name: 'name', type: 'text', placeholder: 'Full Name', required: true },
            { name: 'email', type: 'email', placeholder: 'Email Address', required: true },
            { name: 'department', type: 'text', placeholder: 'Department', required: true },
            { name: 'role', type: 'text', placeholder: 'Role', required: true, value: "FACULTY", display: "none" },
            { name: 'password', type: 'password', placeholder: 'Temporary Password', required: true },
            { name: 'is_active', type: 'checkbox', placeholder: 'Is Active?', default: true },
        ]
    }

    else if (action === "Update Faculty") {
        return [
            { name: 'name', type: 'text', placeholder: 'Full Name', required: true },
            { name: 'email', type: 'email', placeholder: 'Email Address', required: true },
            { name: 'department', type: 'text', placeholder: 'Department', required: true },
            { name: 'password', type: 'password', placeholder: 'Temporary Password', required: true },
            { name: 'is_active', type: 'checkbox', placeholder: 'Is Active?', default: true },
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
                { name: 'journal_type', type: 'select', label: 'Journal Type', required: true, options: ['International', 'National'], defaultValue: "National" },
                { name: 'journal_name', type: 'text', placeholder: 'Journal Name', required: true },
                { name: 'url_doi', type: 'text', placeholder: 'URL or DOI (Optional)', required: false },
                { name: 'issn', type: 'text', placeholder: 'ISSN (Optional)', required: false },
                { name: 'publication_month_year', type: 'string', placeholder: 'Publication Date (YYYY-MM-DD)', required: true },
                { name: 'page_numbers', type: 'text', placeholder: 'Page Numbers (e.g., 120-135)', required: true },
            ]
        } else {
            return [
                { name: 'title_of_paper', type: 'text', placeholder: 'Title of Paper/Article', required: true },
                { name: 'journal_type', type: 'select', label: 'Journal Type', required: true, options: ['International', 'National'], defaultValue: "National" },
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
    else if (action === "Update books") {
        return [
            { name: 'id', type: 'int', placeholder: 'Book ID', required: true },
            { name: 'title', type: 'text', placeholder: 'Book Title', required: true },
            { name: 'publisher_details', type: 'text', placeholder: 'Publisher Details', required: true },
            { name: 'publication_month_year', type: 'string', placeholder: 'Publication Date (YYYY-MM-DD)', required: true },
        ]
    }
    else if (action === "Update journals") {
        return [
            { name: 'id', type: 'int', placeholder: 'Journal ID', required: true },
            { name: 'title_of_paper', type: 'text', placeholder: 'Title of Paper/Article', required: true },
            { name: 'journal_type', type: 'select', label: 'Journal Type', required: true, options: ['International', 'National'], defaultValue: "National" },
            { name: 'journal_name', type: 'text', placeholder: 'Journal Name', required: true },
            { name: 'url_doi', type: 'text', placeholder: 'URL or DOI (Optional)', required: false },
            { name: 'issn', type: 'text', placeholder: 'ISSN (Optional)', required: false },
            { name: 'publication_month_year', type: 'string', placeholder: 'Publication Date (YYYY-MM-DD)', required: true },
            { name: 'page_numbers', type: 'text', placeholder: 'Page Numbers (e.g., 120-135)', required: true },
        ]
    }
    else if (action === "Update conferences") {
        return [            
            { name: 'id', type: 'int', placeholder: 'Conference ID', required: true },
            { name: 'title_of_paper', type: 'text', placeholder: 'Title of Paper/Presentation', required: true },
            { name: 'conference_name', type: 'text', placeholder: 'Conference Name', required: true },
            { name: 'held_on', type: 'stringb', placeholder: 'Date Held (YYYY-MM-DD)', required: true },
            { name: 'place', type: 'text', placeholder: 'City, Country', required: true },
            { name: 'isbn', type: 'text', placeholder: 'ISBN (Optional)', required: false },
        ]

    }
    else if (action.includes("Delete")) {
        return [
            { name: 'id', type: 'text', placeholder: 'ID', required: true },
        ]
    }
    else {
        return []
    }
};