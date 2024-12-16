export const getTableFields = (name) => {
  switch (name) {

    case "Users":
      return [
        { label: "No", field: "id" },
        { label: "User Name", field: "username" },
        { label: "First Name", field: "first_name" },
        { label: "Last Name", field: "last_name" },
        { label: "Email", field: "email" },
        { label: "Street Number", field: "street_number" },
        { label: "Sector", field: "sector" },
        { label: "District", field: "district" },
        { label: "Created At", field: "date_joined" },
       // { label: "Last Login", field: "last_login" },
        { label: "Status", field: "is_active" },
        { label: "Role", field: "role" },
      ];

    case "Clients":
      return [
        { label: "No", field: "id" },
        { label: "User Name", field: "username" },
        { label: "First Name", field: "first_name" },
        { label: "Last Name", field: "last_name" },
        { label: "Email", field: "email" },
        { label: "Street Number", field: "street_number" },
        { label: "Sector", field: "sector" },
        { label: "District", field: "district" },
        { label: "Created At", field: "date_joined" },
       // { label: "Last Login", field: "last_login" },
        { label: "Status", field: "is_active" },
        { label: "Role", field: "role" },
      ];

    case "Drivers":
      return [
        { label: "No", field: "id" },
        { label: "User Name", field: "username" },
        { label: "First Name", field: "first_name" },
        { label: "Last Name", field: "last_name" },
        { label: "Email", field: "email" },
        { label: "Street Number", field: "street_number" },
        { label: "Sector", field: "sector" },
        { label: "District", field: "district" },
        { label: "Created At", field: "date_joined" },
       // { label: "Last Login", field: "last_login" },
        { label: "Status", field: "is_active" },
        { label: "Role", field: "role" },
      ];

    case "Staff":
      return [
        { label: "No", field: "id" },
        { label: "User Name", field: "username" },
        { label: "First Name", field: "first_name" },
        { label: "Last Name", field: "last_name" },
        { label: "Email", field: "email" },
        { label: "Street Number", field: "street_number" },
        { label: "Sector", field: "sector" },
        { label: "District", field: "district" },
        { label: "Created At", field: "date_joined" },
       // { label: "Last Login", field: "last_login" },
        { label: "Status", field: "is_active" },
        { label: "Role", field: "role" },
      ];

    case "Vehicles":
      return [
        { label: "id", field: "id" },
        { label: "License Plate", field: "license_plate" },
        { label: "Number of Seats", field: "number_of_seats" },
        { label: "Latitude", field: "lat" },
        { label: "Longitude", field: "log" },
        { label: "Buy Time", field: "buy_time" },
      ];

    case "Trips":
      return [
        { label: "ID", field: "id" },
        { label: "From", field: "route.from_place" },  
        { label: "To", field: "route.to_place" },  
        { label: "Vehicle", field: "vehicle.license_plate" },
        { label: "Driver", field: "driver.first_name" },  
        { label: "Date", field: "date" },
        { label: "Departure Time", field: "departure_time" },
        { label: "Arrival Time", field: "arrival_time" },
        { label: "User", field: "arrival_time" },
     //   { label: "Agency", field: "agency" },
        { label: "Status", field: "status" },
      ];

    case "Messages":
      return [
        { label: "Id", field: "id" },
        { label: "Sender Name", field: "name" },
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
        { label: "id", field: "id" },
        { label: "Agency Name", field: "agency_name" },
        { label: "Number of Vehicles", field: "number_of_vehicles" },
        { label: "Created At", field: "created_at" },
      ];

    case "Routes":
      return [
        { label: "id", field: "id" },
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
        { label: "Staff Name", field: "staff.first_name" },  
        { label: "Work Hours", field: "work_hour" },
        { label: "Controlled At", field: "controlled_at" },
      ];

    case "Moved":
      return [
        { label: "Vehicle License Plate", field: "vehicle.license_plate" },
        { label: "Route", field: "route.from_place" },
        { label: "Speed", field: "speed" },
        { label: "Moved At", field: "moved_at" },
      ];

      case "Order":
        return [
          { label: "Client", field: "client.first_name" },
          { label: "Vehicle License Plate", field: "vehicle.license_plate" },
          { label: "Order Time", field: "order_time" },
        ];

        case "Rides":
          return [
            { label: "Id", field: "id" },
            { label: "Trip Ref", field: "trip.id" },
            { label: "Order Time", field: "ride_time" },
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
