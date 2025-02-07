"use client";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Checkbox } from "@material-ui/core";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Input,Password } from "rizzui";

interface IFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  favoriteFlavors: { value: string; label: string }[];
  acceptTerms: boolean;
  datetime: string;
  search: string;
}

function App() {
  const { handleSubmit, control, register, reset } = useForm<IFormInputs>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      favoriteFlavors: [],
      datetime: "",
      acceptTerms: false,
      search: "",
    },
  });

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const animatedComponents = makeAnimated();

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    console.log(data);
    reset();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Register
        </h2>

        {/* First Name */}
        <div>
          <label className="block text-gray-600 font-medium">First Name</label>
          <input
            type="text"
            {...register("firstName", { required: true })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your first name"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-gray-600 font-medium">Last Name</label>
          <input
            type="text"
            {...register("lastName", { required: true })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your last name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-600 font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your email"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-600 font-medium">Phone</label>
          <input
            type="tel"
            {...register("phone", { required: true })}
            className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Password */}
        <div>
      
          <Password
            label="password"
            placeholder="Enter your password"
            {...register("password", { required: true })}
            rounded="pill"
            className="w-full "
          />
        </div>

        {/* Favorite Flavors */}
        <div>
          <label className="block text-gray-600 font-medium">
            Favorite Flavors
          </label>
          <Controller
            name="favoriteFlavors"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                closeMenuOnSelect={false}
                components={animatedComponents}
                options={options}
                placeholder="Select your favorite flavors"
                className="mt-1"
              />
            )}
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium">Rizz input</label>
          <Input
            type="datetime-local"
            label="Datetime Local"
            {...register("datetime", { required: true })}
          />
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-center">
          <Controller
            name="acceptTerms"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <Checkbox {...field} color="primary" />}
          />
          <span className="text-gray-600">
            I accept the{" "}
            <a href="#" className="text-blue-500">
              terms and conditions
            </a>
            .
          </span>
        </div>

        <Input
          type="search"
          label="Search"
          placeholder="Search"
          {...register("search")}
          error="This field is required"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
