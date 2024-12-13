export const getTableFields = (name) => {
    switch (name) {
      case "Clients":
        return [
          { label: "ID", field: "id" },
          { label: "First Name", field: "user.first_name" },
          { label: "Last Name", field: "user.last_name" },
          { label: "Age", field: "age" },
          { label: "Address", field: "district" },
          { label: "Signup Time", field: "signup_time" },
        ];
  
      case "Drivers":
        return [
          { label: "ID", field: "id" },
          { label: "First Name", field: "user.first_name" },
          { label: "Last Name", field: "user.last_name" },
          { label: "Created At", field: "created_at" },
        ];
  
      case "Staff":
        return [
          { label: "ID", field: "id" },
          { label: "First Name", field: "user.first_name" },
          { label: "Last Name", field: "user.last_name" },
          { label: "Created At", field: "created_at" },
        ];
  
      case "Vehicles":
        return [
          { label: "License Plate", field: "license_plate" },
          { label: "Number of Seats", field: "number_of_seats" },
          { label: "Buy Time", field: "buy_time" },
        ];
  
      // Add more cases for other models like Trip, Agency, etc.
      
      default:
        return [
          { label: "ID", field: "id" },
          { label: "First Name", field: "first_name" },
          { label: "Last Name", field: "last_name" },
          { label: "Age", field: "age" },
          { label: "Address", field: "address" },
        ];
    }
  };
  