db.employees.updateOne(
  { email: "admin@example.com" },
  {
    $set: {
      name: "Alex Johnson",
      email: "admin@example.com",
      position: "Administrator",
      department: "Admin",
      role: "admin"
    }
  },
  { upsert: true }
);

db.employees.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      name: "Emma Wilson",
      email: "user@example.com",
      position: "Employee",
      department: "General",
      role: "user"
    }
  },
  { upsert: true }
);
