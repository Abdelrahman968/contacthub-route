# ContactHub - Smart Contact Manager

> A modern, beautiful contact manager web app that brings the classic phone book into the digital age!  
> Remember when every home had a paper address book full of landline numbers? After mastering CRUD operations, it's time to build the same idea — but as a sleek, fully functional Web App (definitely no paper involved).

Live Demo → https://abdelrahman968.github.io/contacthub-route/  
Repository → https://github.com/Abdelrahman968/contacthub-route

## Features

- **Add / Edit / Delete** contacts with full CRUD operations  
- **Real-time Search** by name, phone, or email  
- **Favorites System** – star your most important contacts  
- **Emergency Contacts** – dedicated quick-access panel  
- **Custom Avatars** – upload photo or auto-generate colorful initials  
- **Click-to-Call** (`tel:`) and **Click-to-Email** (`mailto:`) buttons  
- **Rich Contact Info** – name, phone, email, address, group, notes  
- **Form Validation** with instant feedback (Egyptian numbers supported)  
- **Fully Persistent** – all data saved in **LocalStorage**  
- **Beautiful Alerts** powered by SweetAlert2  
- **Responsive Design** – works perfectly on mobile, tablet & desktop  
- **Clean UI** built with Bootstrap 5 + custom styles  

## Tech Stack

- HTML5 / CSS3 / Vanilla JavaScript (ES6+)  
- Bootstrap 5.3  
- SweetAlert2  
- Font Awesome Pro  
- LocalStorage API  
- FileReader API (for image preview)  

## Assignment 9 - Route Frontend (Completed)

| Requirement                          | Status |
|-------------------------------------|-----------|
| Full CRUD (Create, Read, Update, Delete) | Done |
| Search by Name / Phone / Email       | Done |
| Add/Remove from Favorites            | Done |
| Call button (`tel:`) & Email button (`mailto:`) | Done |
| Form Validation + Uniqueness checks  | Done |
| Data persistence using LocalStorage  | Done |
| SweetAlert2 for alerts & confirmations | Done |
| Responsive + Beautiful UI            | Done |

## How to Run Locally

```bash
git clone https://github.com/Abdelrahman968/contacthub-route.git
cd contacthub-route
# Just open index.html in your browser!
```

```bash
contacthub-route/
├── index.html
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css
│   │   └── main.css
│   ├── js/
│   │   ├── bootstrap.bundle.min.js
│   │   └── main.js
│   └── images/
└── README.md
```

💡 Usage Guide
--------------

### 🆕 Adding a New Contact

1.  🖱️ Click the **"Add Contact"** button in the header
    
2.  📝 Fill in the modal form:
    
    *   ✏️ **Full Name** (Required) - 3-100 characters
        
    *   📞 **Phone Number** (Required) - Egyptian format (010/011/012/015 + 8 digits)
        
    *   📧 **Email Address** (Optional) - Must be valid email format
        
    *   📍 **Address** (Optional) - 10-500 characters
        
    *   👥 **Group** (Optional) - Family, Friends, Work, School, or Other
        
    *   📝 **Notes** (Optional) - Additional information
        
3.  📸 **Upload Photo** (Optional) - Click "Change Photo" button
    
4.  ⭐ Check **"Favorite"** if this is an important contact
    
5.  🚨 Check **"Emergency"** if this is an urgent contact
    
6.  💾 Click **"Save Contact"**
    
7.  ✅ Success notification appears!
    

### ✏️ Editing an Existing Contact

1.  🔍 Find the contact you want to edit
    
2.  🖊️ Click the **edit icon** (pen) on the contact card
    
3.  ✨ Modal opens with pre-filled information
    
4.  📝 Modify any fields you want to change
    
5.  💾 Click **"Save Contact"** to update
    
6.  ✅ Success notification confirms the update!
    

### 🗑️ Deleting a Contact

1.  🔍 Locate the contact you want to remove
    
2.  🗑️ Click the **delete icon** (trash can)
    
3.  ⚠️ Confirmation dialog appears asking "Are you sure?"
    
4.  ✔️ Click **"Yes, delete it!"** to confirm
    
5.  ❌ Or click **"No, cancel!"** to keep the contact
    
6.  ✅ Success notification if deleted!
    

### 🔍 Searching for Contacts

1.  📍 Locate the search bar under "All Contacts" heading
    
2.  ⌨️ Start typing in the search field
    
3.  🔎 Search works across:
    
    *   👤 **Name** - Partial or full name
        
    *   📞 **Phone** - Any digits from the number
        
    *   📧 **Email** - Any part of the email address
        
4.  ⚡ Results filter **instantly** as you type
    
5.  🧹 Clear the search to see all contacts again
    

### ⭐ Managing Favorites

#### Adding to Favorites:

1.  🔍 Find the contact on any contact card
    
2.  ⭐ Click the **star icon** (hollow star)
    
3.  💛 Star fills in and turns yellow
    
4.  📌 Contact appears in "Favorites" sidebar
    

#### Removing from Favorites:

1.  ⭐ Click the **filled star icon** on the contact
    
2.  ⚪ Star becomes hollow again
    
3.  📤 Contact removed from "Favorites" sidebar
    

### 🚨 Managing Emergency Contacts

#### Marking as Emergency:

1.  🔍 Find the contact card
    
2.  ❤️ Click the **heart icon**
    
3.  💗 Heart fills in and turns red
    
4.  🚨 Contact appears in "Emergency" sidebar
    
5.  🏷️ "Emergency" badge appears on contact card
    

#### Removing Emergency Status:

1.  ❤️ Click the **filled heart icon**
    
2.  🤍 Heart becomes hollow again
    
3.  📤 Contact removed from "Emergency" sidebar
    

### 📞 Quick Actions

#### Making a Call:

*   ☎️ Click the **phone icon** in the contact card footer
    
*   📱 Your device's phone app opens with the number pre-filled
    

#### Sending an Email:

*   ✉️ Click the **envelope icon** in the contact card footer
    
*   📧 Your default email client opens with a new message
    

#### Viewing Notes:

*   ℹ️ Hover over the **info icon** in the contact card footer
    
*   💬 Tooltip appears showing the contact's notes

👨‍💻 Author
------------

### **Abdelrahman Ayman** 🚀

🙏 Acknowledgments
------------------

Special thanks to:

*   🎓 [**Route Academy**](https://www.linkedin.com/company/routeacademy/) - For the amazing learning opportunity and assignment
    
*   🎨 [**Bootstrap Team**](https://getbootstrap.com/) - For the incredible UI framework
    
*   ✨ [**SweetAlert2**](https://sweetalert2.github.io/) - For beautiful, customizable alerts
    
*   🎯 [**Font Awesome**](https://fontawesome.com/) - For the comprehensive icon library
    
*   💻 **Open Source Community** - For inspiration and resources
    

📞 Support & Feedback
---------------------

### 💬 Need Help?

*   🐛 **Found a bug?** [Open an issue](https://github.com/Abdelrahman968/contacthub-route/issues)
    
*   💡 **Have a suggestion?** [Start a discussion](https://github.com/Abdelrahman968/contacthub-route/discussions)
    
*   ❓ **Have a question?** Check existing issues or create a new one
    

### 🌟 Show Your Support

If you find this project useful:

*   ⭐ **Star this repository**
    
*   🍴 **Fork it** for your own projects
    
*   📢 **Share it** with others
    
*   💖 **Contribute** to make it better
    

### 🎉 Thank you for checking out ContactHub! 🎉

**Made with ❤️ and ☕ by** [**Abdelrahman Ayman**](https://github.com/Abdelrahman968)

⭐ **Star this repo if you found it helpful!** ⭐
    
