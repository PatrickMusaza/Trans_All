export const getTableFields = (name) => {
  switch (name) {

    case "Users":
      return [
        { label: "No", field: "id" },
        { label: "User Name", field: "username" },
        { label: "First Name", field: "first_name" },
        { label: "Last Name", field: "last_name" },
        { label: "Email", field: "email" },
        { label: "Created At", field: "created_at" },
        { label: "Last Login", field: "last_login" },
        { label: "Status", field: "is_active" },
      ];

    case "Clients":
      return [
        { label: "ID", field: "id" },
        { label: "First Name", field: "first_name" },
        { label: "Last Name", field: "last_name" },
        { label: "Age", field: "age" },
        { label: "Signup Time", field: "signup_time" },
      ];

    case "Drivers":
      return [
        { label: "ID", field: "id" },
        { label: "First Name", field: "first_name" },
        { label: "Last Name", field: "last_name" },
        { label: "Age", field: "age" },
        { label: "District", field: "district" },
        { label: "Sector", field: "sector" },
        { label: "Street Number", field: "street_number" },
        { label: "Created At", field: "created_at" },
      ];

    case "Staff":
      return [
        { label: "ID", field: "id" },
        { label: "First Name", field: "first_name" },
        { label: "Last Name", field: "last_name" },
        { label: "Age", field: "age" },
        { label: "Address", field: "district" },
        { label: "Street Number", field: "street_number" },
        { label: "Created At", field: "created_at" },
      ];

    case "Vehicles":
      return [
        { label: "License Plate", field: "license_plate" },
        { label: "Number of Seats", field: "number_of_seats" },
        { label: "Buy Time", field: "buy_time" },
      ];

    case "Trips":
      return [
        { label: "ID", field: "id" },
        { label: "Route", field: "route.from_place" },  // From place as a representative
        { label: "Vehicle", field: "vehicle.license_plate" },
        { label: "Driver", field: "driver.first_name" },  // You can modify based on your use case
        { label: "Date", field: "date" },
        { label: "Departure Time", field: "departure_time" },
        { label: "Arrival Time", field: "arrival_time" },
        { label: "Agency", field: "agency" },
        { label: "Status", field: "status" },
      ];

    case "Messages":
      return [
        { label: "Name", field: "name" },
        { label: "Email", field: "email" },
        { label: "Subject", field: "subject" },
        { label: "Category", field: "category" },
        { label: "Phone", field: "phone" },
        { label: "Message", field: "message" },
        { label: "Status", field: "status" },
        { label: "Sent At", field: "sent_at" },
      ];

    case "Agencies":
      return [
        { label: "Agency Name", field: "agency_name" },
        { label: "Number of Vehicles", field: "number_of_vehicles" },
        { label: "Created At", field: "created_at" },
      ];

    case "Route":
      return [
        { label: "From Place", field: "from_place" },
        { label: "To Place", field: "to_place" },
        { label: "Distance", field: "distance" },
      ];

    case "Located":
      return [
        { label: "Vehicle License Plate", field: "vehicle.license_plate" },
        { label: "Agency Name", field: "agency.agency_name" },
      ];

    case "Controlled":
      return [
        { label: "Vehicle License Plate", field: "vehicle.license_plate" },
        { label: "Staff Name", field: "staff.first_name" },  // You can modify for first and last name
        { label: "Work Hours", field: "work_hour" },
        { label: "Controlled At", field: "controlled_at" },
      ];

    case "Moved":
      return [
        { label: "Vehicle License Plate", field: "vehicle.license_plate" },
        { label: "Route", field: "route.from_place" },  // From place as a representative
        { label: "Speed", field: "speed" },
        { label: "Moved At", field: "moved_at" },
      ];

    case "Order":
      return [
        { label: "Client", field: "client.first_name" },
        { label: "Vehicle License Plate", field: "vehicle.license_plate" },
        { label: "Order Time", field: "order_time" },
      ];

    default:
      return [
        {
          label: "N/A",
          field: "N/A"
        },
      ];
  }
};
