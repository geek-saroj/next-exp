import { ReactNode } from "react";
import { default as ReactSelect } from "react-select";

export interface ColourOption {
  size?: "lg" | "sm" | "md" | "xl";
  label: ReactNode;
  options: { label: string; value: string }[];
  value?: any;
  onChange?: (selected: any) => void;
  className: string;
  error: any;
}

const MultiSelect = ({ size, label, ...props }: ColourOption) => {
  const customStyles = {
    input: (provided: any) => ({
      ...provided,
      "input:focus": {
        boxShadow: "none",
      },
      color: "inherit",
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight:
        size === "xl"
          ? "56px"
          : size === "lg"
          ? "48px"
          : size === "md"
          ? "40px"
          : "32px",
      fontSize:
        size === "xl"
          ? "18px"
          : size === "lg"
          ? "16px"
          : size === "md"
          ? "14px"
          : "12px",
      borderColor: props.error ? "red" : "",
      backgroundColor: "transparent",
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
      // backgroundColor: "#333333",
    }),
    menuPortal: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
    singleValue: (base: any) => ({
      ...base,
      // color: "inherit",
    }),
    option: (styles: any, state: any) => ({
      ...styles,
      // backgroundColor: state.isSelected ? "red" : "",
      // "&:hover": {
      //   backgroundColor: "black",
      // },
    }),
  };

  return (
    <div className="flex flex-col flex-1 gap-1.5">
      {label}
      <ReactSelect {...props} styles={customStyles} isMulti defaultValue={[]} />
      <p className="text-red-600">{props.error}</p>
    </div>
  );
};
export default MultiSelect;
